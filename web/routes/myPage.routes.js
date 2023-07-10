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

router.get('/edit-profile', isLoggedIn, getEditProfile)

router.patch('/edit-profile', isLoggedIn, uploadUserProfileImg.single('profile-img'), patchEditProfile)

router.get('/edit-account', isLoggedIn, getEditAccount)

router.patch(
  '/edit-username',
  isLoggedIn,
  body('newUsername').trim().notEmpty().isLength({ min: 1 }).withMessage('올바른 이름을 입력해주세요.'),
  patchEditUsername
)

router.patch('/edit-email', isLoggedIn, body('newEmail').trim().isEmail().withMessage('올바른 이메일을 입력해주세요.'), patchEditEmail)

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

router.get('/delete-account', isLoggedIn, getDeleteAccount)

router.delete('/delete-account', isLoggedIn, deleteAccount)

module.exports = router
