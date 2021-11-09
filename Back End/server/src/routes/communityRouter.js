// @ts-check

// TODO : 사진 저장할 때 고유 id 부여해서 넣기 안그러면 중복 사진 생길 수 있음
/** 모듈 */
const { Router } = require('express')
const path = require('path')
const multer = require('multer')
const AWS = require('aws-sdk')
const multers3 = require('multer-s3')

/** 데이터베이스 관련 */
const Post = require('../schemas/Post')

/** 로그인 관련 */
const { isLoggedIn } = require('../middlewares/authentication')

const communityRouter = Router()

/** AWS 설정 */
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2', // s3에서는 리전을 설정할 필요는 없음
})

const uploadPost = multer({
  storage: multers3({
    s3: new AWS.S3(),
    bucket: 'interiorpeople',
    key(req, file, cb) {
      // 저장할 파일 위치 설정
      cb(null, `post_img/${path.basename(file.originalname)}`)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기를 5mb로 제한
})

// ! 메인 홈이랑 포스트 리스트는 무슨 차이?
// TODO : 메인홈
// ! 무한 스크롤 방식?

// TODO : 내 포스트
// ! 포스트 어케 할 것인지 물어보기
communityRouter.get('/mypost', isLoggedIn, async (req, res) => {
  // 객체 배열에서 특정 요소를 추출할 때는 filter가 아니라 map을 사용함.
  // @ts-ignore
  const imgURLs = req.files.map((element) => element.location)

  // 포스트 생성
  const result = await new Post({
    // @ts-ignore
    writer_id: req.user.id,
    title: req.body.title,
    content: req.body.content,
    like_num: 0,
    s3_photo_img_url: imgURLs,
  }).save()
  res.json(result)
})

// TODO : 포스트 리스트

/** 포스트 작성 */
// TODO : 좋아요 갯수 세기
// upload.array('키', 최대파일개수)
communityRouter.post('/write', isLoggedIn, uploadPost.array('images'), async (req, res) => {
  // 객체 배열에서 특정 요소를 추출할 때는 filter가 아니라 map을 사용함.
  // @ts-ignore
  const imgURLs = req.files.map((element) => element.location)

  // 포스트 생성
  const result = await new Post({
    // @ts-ignore
    writer_id: req.user.id,
    title: req.body.title,
    content: req.body.content,
    like_num: 0,
    s3_photo_img_url: imgURLs,
  }).save()
  res.json(result)
})

module.exports = { communityRouter }
