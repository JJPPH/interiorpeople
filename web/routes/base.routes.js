const express = require('express')

const { getIndex } = require('../controllers/base.controller')

const router = express.Router()

router.get('/', getIndex)

module.exports = router
