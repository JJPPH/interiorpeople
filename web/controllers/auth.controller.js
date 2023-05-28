const bcrypt = require('bcrypt')
const passport = require('passport')
const { validationResult } = require('express-validator')

const User = require('../models/user.model')

// &
exports.getLogin = (req, res) => {
  const errorMessage = req.flash('errorMessage')
  res.render('auth/login', { pageTitle: 'Login', errorMessage })
}

// &
exports.postLogin = (req, res, next) => {
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    req.flash('errorMessage', validationErrors.array()[0].msg)
    return res.redirect('/auth/login')
  }

  return passport.authenticate('local', (authError, user) => {
    if (authError) {
      return next(authError)
    }
    if (!user) {
      req.flash('errorMessage', '정보가 올바른지 다시 확인해주세요.')
      return res.redirect('/auth/login')
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError)
      }
      return res.redirect('/')
    })
  })(req, res, next)
}

// &
exports.getSignup = (req, res) => {
  const errorMessage = req.flash('errorMessage')
  res.render('auth/signup', { pageTitle: 'Signup', errorMessage })
}

// &
exports.postSignup = async (req, res, next) => {
  const { username, email, password } = req.body
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    req.flash('errorMessage', validationErrors.array()[0].msg)
    return res.redirect('/auth/signup')
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 15)

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

// &
exports.postLogout = (req, res) => {
  req.logout(() => {
    res.redirect('/')
  })
}

// &
exports.getForgotPassword = (req, res) => {
  res.render('auth/forgot-password', { pageTitle: 'Forget Password' })
}
