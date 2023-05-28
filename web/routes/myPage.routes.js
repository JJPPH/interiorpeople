const express = require('express')

const { isLoggedIn } = require('../middlewares/check-auth.middleware')
const { getMyPage, postMyPage } = require('../controllers/myPage.controller')
const multerConfig = require('../middlewares/multerConfig.middleware')

const uploadUserProfileImg = multerConfig('user_profile_img')

const router = express.Router()

router.get('/', isLoggedIn, getMyPage)
router.post('/', isLoggedIn, uploadUserProfileImg.single('profileImg'), postMyPage)

module.exports = router
