const { Router } = require('express')

const { getFAQ, getGuide } = require('../controllers/support.controller')

const router = Router()

router.get('/faq', getFAQ)

router.get('/guide', getGuide)

module.exports = router
