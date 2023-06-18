const express = require('express')

/** 컨트롤러 */
const { getIndex } = require('../controllers/base.controller')

const router = express.Router()

// = 홈 화면 보여주기
router.get('/', getIndex)

module.exports = router
