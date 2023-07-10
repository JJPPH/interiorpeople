const express = require('express')
const { body } = require('express-validator')

const {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  postLogout,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
} = require('../controllers/auth.controller')

const User = require('../models/user.model')

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/authentication.middleware')

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
        const userExistsWithEmail = await User.findOne({ where: { email } })
        if (userExistsWithEmail) {
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

router.get('/reset-password', isNotLoggedIn, getResetPassword)

router.post(
  '/reset-password',
  isNotLoggedIn,
  body('email')
    .trim()
    .isEmail()
    .withMessage('올바른 이메일을 입력해주세요.')
    .custom(async (email) => {
      const userExistsWithEmail = await User.findOne({ where: { email } })
      if (userExistsWithEmail) {
        return true
      }
      throw new Error('존재하지 않는 이메일입니다.')
    }),
  postResetPassword
)

router.get('/new-password/:userId/:passwordToken', isNotLoggedIn, getNewPassword)

router.post(
  '/new-password/:userId/:passwordToken',
  isNotLoggedIn,
  [
    body('new-password')
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage('1자 이상 20자 이하의 비밀번호를 입력해주세요.')
      .isAlphanumeric()
      .withMessage('비밀번호는 알파벳과 숫자만으로 입력해주세요.'),
    body('confirm-password').custom((confirmPassword, { req }) => {
      if (confirmPassword === req.body['new-password']) {
        return true
      }
      throw new Error('비밀번호가 일치하지 않습니다.')
    }),
  ],
  postNewPassword
)

module.exports = router
