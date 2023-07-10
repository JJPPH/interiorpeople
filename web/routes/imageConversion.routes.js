const express = require('express')

const imageConversionController = require('../controllers/imageConversion.controller')

const { isLoggedIn } = require('../middlewares/authentication.middleware')

const router = express.Router()

router.get('/', isLoggedIn, imageConversionController.getInteriorImageUpload)

router.post('/segmentation', isLoggedIn, imageConversionController.postSegmentation)

router.post('/local-style-transfer', isLoggedIn, imageConversionController.postLocalTransfer)

module.exports = router
