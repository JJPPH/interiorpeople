const bcrypt = require('bcrypt')
const crypto = require('crypto')
const passport = require('passport')
const { validationResult } = require('express-validator')

const User = require('../models/user.model')

const redisClient = require('../utils/redisClient')
const emailTransporter = require('../utils/nodemailerTransport')

// = 로그인 화면 보여주기
exports.getLogin = (req, res) => {
  const errorMessage = req.flash('errorMessage')
  res.render('auth/login', { pageTitle: 'Login', errorMessage })
}

// = 로그인 처리하기
exports.postLogin = (req, res, next) => {
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    req.flash('errorMessage', validationErrors.array()[0].msg)
    return res.redirect('/auth/login')
  }

  return passport.authenticate('local', (authError, userId) => {
    if (authError) {
      return next(authError)
    }
    if (!userId) {
      req.flash('errorMessage', '정보가 올바른지 다시 확인해주세요.')
      return res.redirect('/auth/login')
    }

    return req.login(userId, (loginError) => {
      if (loginError) {
        return next(loginError)
      }
      return res.redirect('/')
    })
  })(req, res, next)
}

// = 회원가입 화면 보여주기
exports.getSignup = (req, res) => {
  const errorMessage = req.flash('errorMessage')
  res.render('auth/signup', { pageTitle: 'Signup', errorMessage })
}

// = 회원가입 처리하기
exports.postSignup = async (req, res, next) => {
  const { username, email, password } = req.body
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    req.flash('errorMessage', validationErrors.array()[0].msg)
    return res.redirect('/auth/signup')
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 6)

    await User.create({
      name: username,
      email,
      password: hashedPassword,
    })

    return res.redirect('/')
  } catch (error) {
    return next(error)
  }
}

// = 로그아웃 처리하기
exports.postLogout = (req, res, next) => {
  req.logout(() => {
    res.clearCookie('connectID')
    req.session.destroy((error) => {
      if (error) {
        return next(error)
      }
      return res.redirect('/')
    })
  })
}

// = 비밀번호 재설정 화면 보여주기
exports.getResetPassword = (req, res) => {
  const errorMessage = req.flash('errorMessage')
  res.render('auth/reset-password', { pageTitle: 'Reset Password', errorMessage })
}

// = 비밀번호 재설정 처리하기
exports.postResetPassword = async (req, res, next) => {
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    req.flash('errorMessage', validationErrors.array()[0].msg)
    return res.redirect('/auth/reset-password')
  }

  try {
    const token = crypto.randomBytes(20).toString('hex')

    const user = await User.findOne({ where: { email: req.body.email } })

    await redisClient.set(`${user.id}_token`, token)
    await redisClient.expire(`${user.id}_token`, 3600)

    emailTransporter.sendMail({
      to: req.body.email,
      from: 'ADMIN@InteriorPeople',
      subject: 'InteriorPeople 계정 관련',
      html: `<h1>비밀번호 변경 확인</h1>
              <p>안녕하세요, ${user.name}님!</p>
              <p>비밀번호 변경 요청이 접수되었습니다. 아래 링크를 클릭하여 비밀번호를 변경해주세요.</p>
              <p><a href="http://localhost:3000/auth/new-password/${user.id}/${token}">비밀번호 변경하기</a></p>
              <p>이 링크는 1시간 동안 유효합니다. 유효 기간이 지나면 다시 비밀번호 변경 요청을 하셔야 합니다.</p>
              <p>문제가 있거나 도움이 필요한 경우, 저희에게 연락해주세요.</p>
              <p>감사합니다.</p>
            `,
    })

    // TODO : 메일을 발송하였음을 알려주기
    return res.redirect('/auth/login')
  } catch (error) {
    return next(error)
  }
}

// = 비밀번호 새로 설정 화면 보여주기
exports.getNewPassword = async (req, res) => {
  const { userId, passwordToken } = req.params

  const tokenOfUser = await redisClient.get(`passwordToken:${userId}`)
  if (!tokenOfUser || tokenOfUser !== passwordToken) {
    return res.redirect('/auth/reset-password')
  }

  return res.render('auth/new-password', {
    pageTitle: 'New Password',
    userId,
    passwordToken,
  })
}

// = 비밀번호 새로 설정 처리하기
exports.postNewPassword = async (req, res, next) => {
  try {
    const { userId, passwordToken } = req.params

    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      req.flash('errorMessage', validationErrors.array()[0].msg)
      return res.redirect(`/auth/reset-password/${userId}/${passwordToken}`)
    }

    const tokenOfUser = await redisClient.get(`passwordToken:${userId}`)
    if (!tokenOfUser || tokenOfUser !== passwordToken) {
      throw new Error('잘못된 접근입니다.')
    }

    await redisClient.del(`passwordToken:${userId}`)

    const hashedPassword = await bcrypt.hash(req.body['new-password'], 6)

    await User.update(
      { password: hashedPassword },
      {
        where: {
          id: userId,
        },
      }
    )

    return res.redirect('/auth/login')
  } catch (error) {
    return next(error)
  }
}
