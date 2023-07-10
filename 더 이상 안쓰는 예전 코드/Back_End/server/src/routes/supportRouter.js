// @ts-check

const { Router } = require('express')

const supportRouter = Router()

/** 모델 */
const Support = require('../schemas/Support')

/** support 페이지 홈  */
supportRouter.get('/', async (req, res) => {
  const guide = await Support.find().where('type').equals('guide').select('title content')
  const faq = await Support.find().where('type').equals('faq').select('title content')
  res.json({ guide, faq })
})

module.exports = { supportRouter }
