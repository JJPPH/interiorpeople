const express = require('express')
const { body } = require('express-validator')

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/check-auth.middleware')
const { getLogin, postLogin, getSignup, postSignup, postLogout, getForgotPassword } = require('../controllers/auth.controller')
const User = require('../models/user.model')

const router = express.Router()

router.get('/login', isNotLoggedIn, getLogin)
router.post(
  '/login',
  isNotLoggedIn,
  [
    body('email').trim().isEmail().withMessage('올바른 이메일을 입력해주세요.'),
    body('password').trim().isLength({ min: 1, max: 20 }).withMessage('1자 이상 20자 이하의 비밀번호를 입력해주세요.'),
  ],
  postLogin
)

router.get('/signup', isNotLoggedIn, getSignup)
router.post(
  '/signup',
  isNotLoggedIn,
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('올바른 이메일을 입력해주세요.')
      .custom(async (email) => {
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
          throw new Error('해당 이메일로는 가입할 수 없습니다.')
        }
      }),
    body('password')
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage('1자 이상 20자 이하의 비밀번호를 입력해주세요.')
      .isAlphanumeric()
      .withMessage('비밀번호는 알파벳과 숫자만으로 입력해주세요.'),
    body('confirm-password').custom((confirmPassword, { req }) => {
      if (confirmPassword === req.body.password) {
        return true
      }
      throw new Error('비밀번호가 일치하지 않습니다.')
    }),
  ],
  postSignup
)

router.post('/logout', isLoggedIn, postLogout)

router.get('/forgot-password', isNotLoggedIn, getForgotPassword)

module.exports = router
