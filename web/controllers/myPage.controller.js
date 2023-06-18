const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
require('dotenv').config()

const User = require('../models/user.model')

// = 유저 프로필 이미지 변경 화면 보여주기
exports.getEditProfile = async (req, res) => {
  res.render('my-page/edit-profile', { pageTitle: 'edit profile' })
}

// = 유저 프로필 이미지 변경 처리하기
exports.patchEditProfile = async (req, res, next) => {
  try {
    const profileImg = req.file
    if (!profileImg) {
      return res.status(400).json({ message: '프로필 이미지를 업로드해주시길 바랍니다.', success: false })
    }

    await User.update({ profileImg: `/userProfileImg/${profileImg.filename}` }, { where: { id: req.user.id } })

    return res.json({ message: '프로필 변경 성공', success: true })
  } catch (error) {
    return next(error)
  }
}

// = 유저 계정 관리 화면 보여주기
exports.getEditAccount = async (req, res) => {
  res.render('my-page/edit-account', { pageTitle: 'edit account' })
}

// = 유저 계정의 이름 변경 처리하기
exports.patchEditUsername = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ message: validationErrors.array()[0].msg, success: false })
    }

    const { newUsername } = req.body
    const { id: userId } = req.user

    await User.update({ name: newUsername }, { where: { id: userId } })

    return res.json({ message: '이름 변경 성공', success: true })
  } catch (error) {
    return next(error)
  }
}

// = 유저 계정의 이메일 변경 처리하기
exports.patchEditEmail = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ message: validationErrors.array()[0].msg, success: false })
    }

    const { newEmail } = req.body
    const { id: userId } = req.user

    await User.update({ email: newEmail }, { where: { id: userId } })

    return res.json({ message: '이메일 변경 성공', success: true })
  } catch (error) {
    return next(error)
  }
}

// = 유저 게정의 비밀번호 변경 처리하기
exports.patchEditPassword = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ message: validationErrors.array()[0].msg, success: false })
    }

    const { currentPassword, newPassword } = req.body
    const { id: userId } = req.user

    const user = await User.findByPk(userId)
    const passwordCheck = await bcrypt.compare(currentPassword, user.password)
    if (!passwordCheck) {
      return res.status(401).json({ message: validationErrors.array()[0].msg, success: false })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 6)
    user.password = hashedPassword
    await user.save()

    return res.json({ message: '이름 변경 성공', success: true })
  } catch (error) {
    return next(error)
  }
}

// = 유저 계정 탈퇴 화면 보여주기
exports.getDeleteAccount = async (req, res) => {
  res.render('my-page/delete-account', { pageTitle: 'delete account' })
}

// = 유저 계정 탈퇴 처리하기
exports.deleteAccount = async (req, res, next) => {
  try {
    await User.destroy({ where: { id: req.user.id } })

    return req.logout(() => {
      res.clearCookie('connectID')
      req.session.destroy((error) => {
        if (error) {
          return next(error)
        }
        return res.json({ message: '계정 탙퇴 성공', success: true })
      })
    })
  } catch (error) {
    return next(error)
  }
}
