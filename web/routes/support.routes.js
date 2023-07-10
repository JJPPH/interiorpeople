const express = require('express')

const { getFAQ } = require('../controllers/support.controller')

const router = express.Router()

router.get('/faq', getFAQ)

// router.get('/guide', getGuide)

module.exports = router
