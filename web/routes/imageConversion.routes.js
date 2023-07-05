const express = require('express')

/** 컨트롤러 */
const imageConversionController = require('../controllers/imageConversion.controller')

/** 미들웨어 */
const { isLoggedIn } = require('../middlewares/authentication.middleware')

const router = express.Router()

// = 변환하고자 하는 이미지 업로드 화면 보여주기
router.get('/', isLoggedIn, imageConversionController.getInteriorImageUpload)

// = 변환하고자 하는 이미지 업로드 및 가구 세그멘테이션 처리
router.post('/segmentation', isLoggedIn, imageConversionController.postSegmentation)

// = 로컬 스타일 트랜스퍼 처리
router.post('/local-style-transfer', isLoggedIn, imageConversionController.postLocalTransfer)

module.exports = router
