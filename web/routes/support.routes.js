const { Router } = require('express')

const { getFAQ } = require('../controllers/support.controller')

const router = Router()

// = faq 보여주기
router.get('/faq', getFAQ)

// = guide 보여주기
// router.get('/guide', getGuide)

module.exports = router
