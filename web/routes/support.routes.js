const { Router } = require('express')

/** 컨트롤러 */
const { getFAQ, getGuide } = require('../controllers/support.controller')

const router = Router()

// = faq 보여주기
router.get('/faq', getFAQ)

// = guide 보여주기
router.get('/guide', getGuide)

module.exports = router
