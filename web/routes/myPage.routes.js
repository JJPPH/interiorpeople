const express = require('express')
const { body } = require('express-validator')

const {
  getEditProfile,
  patchEditProfile,
  patchEditUsername,
  getEditAccount,
  patchEditEmail,
  patchEditPassword,
  getDeleteAccount,
  deleteAccount,
} = require('../controllers/myPage.controller')

const { isLoggedIn } = require('../middlewares/authentication.middleware')
const multerConfig = require('../middlewares/multerConfig.middleware')

const uploadUserProfileImg = multerConfig('userProfileImg')

const router = express.Router()

// = 유저 프로필 이미지 변경 화면 보여주기
router.get('/edit-profile', isLoggedIn, getEditProfile)

// = 유저 프로필 이미지 변경 처리하기
router.patch('/edit-profile', isLoggedIn, uploadUserProfileImg.single('profile-img'), patchEditProfile)

// = 유저 계정 관리 화면 보여주기
router.get('/edit-account', isLoggedIn, getEditAccount)

// = 유저 계정의 이름 변경 처리하기
router.patch(
  '/edit-username',
  isLoggedIn,
  body('newUsername').trim().notEmpty().isLength({ min: 1, max: 25 }).withMessage('올바른 이름을 입력해주세요.'),
  patchEditUsername
)

// = 유저 계정의 이메일 변경 처리하기
router.patch('/edit-email', isLoggedIn, body('newEmail').trim().isEmail().withMessage('올바른 이메일을 입력해주세요.'), patchEditEmail)

// = 유저 게정의 비밀번호 변경 처리하기
router.patch(
  '/edit-password',
  isLoggedIn,
  [
    body('newPassword')
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage('1자 이상 20자 이하의 비밀번호를 입력해주세요.')
      .isAlphanumeric()
      .withMessage('비밀번호는 알파벳과 숫자만으로 입력해주세요.'),
    body('confirmPassword').custom((confirmPassword, { req }) => {
      if (confirmPassword === req.body.newPassword) {
        return true
      }
      throw new Error('비밀번호가 일치하지 않습니다.')
    }),
  ],
  patchEditPassword
)

// = 유저 계정 탈퇴 화면 보여주기
router.get('/delete-account', isLoggedIn, getDeleteAccount)

// = 유저 계정 탈퇴 처리하기
router.delete('/delete-account', isLoggedIn, deleteAccount)

module.exports = router
