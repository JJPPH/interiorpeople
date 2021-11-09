// @ts-check

/** 모듈 */
const { Router } = require('express')
const multer = require('multer')
const AWS = require('aws-sdk')
const multers3 = require('multer-s3')
const path = require('path')

/** 데이터베이스 관련 */
const User = require('../schemas/User')

/** 로그인 관련 */
const { isLoggedIn } = require('../middlewares/authentication')

const myPageRouter = Router()

/** AWS 설정 */
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2', // s3에서는 리전을 설정할 필요는 없음
})

/** 나의 사진 이미지 */
const upload_myphoto = multer({
  storage: multers3({
    s3: new AWS.S3(),
    bucket: 'interiorpeople',
    key(req, file, cb) {
      // 저장할 파일 위치 설정
      cb(null, `myphoto_img/${Date.now()}${path.basename(file.originalname)}`)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기를 5mb로 제한
})

/** 마이페이지 프로필 이미지 */
const upload_profilePhoto = multer({
  storage: multers3({
    s3: new AWS.S3(),
    bucket: 'interiorpeople',
    key(req, file, cb) {
      // 저장할 파일 위치 설정
      cb(null, `profilePhoto_img/${Date.now()}${path.basename(file.originalname)}`)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기를 5mb로 제한
})

/** 추천기록 이미지 */
const upload_history = multer({
  storage: multers3({
    s3: new AWS.S3(),
    bucket: 'interiorpeople',
    key(req, file, cb) {
      // 저장할 파일 위치 설정
      cb(null, `history_img/${Date.now()}${path.basename(file.originalname)}`)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기를 5mb로 제한
})

/** 메인 페이지 */
myPageRouter.get('/', isLoggedIn, async (req, res) => {
  // @ts-ignore
  const currentUser = await User.findOne({ id: req.user.id })
  // TODO : 무엇을 보내야 할까
  res.json(currentUser)
})

/** 나의 사진 페이지 */
// TODO : 나의 사진
myPageRouter.get('/myphoto', isLoggedIn, async (req, res) => {})

/** 스크랩 페이지 */
// TODO : 스크랩
myPageRouter.get('/scrap', isLoggedIn, async (req, res) => {})

/** 추천 기록 페이지 */
// TODO : 추천 기록
myPageRouter.get('/photo', isLoggedIn, async (req, res) => {})

/** 프로필 수정 페이지 */
// TODO : 프로필 수정
myPageRouter.patch('/photo', isLoggedIn, async (req, res) => {
  // @ts-ignore
  const currentUser = await User.findOne({ id: req.user.id })
})

module.exports = { myPageRouter }
