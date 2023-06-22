// @ts-check

/** 모듈 */
const express = require('express')
require('dotenv').config() // dotenv 설정 불러오기
const morgan = require('morgan') // morgan
const cookieParser = require('cookie-parser') // cookieParser
const session = require('express-session')
const passport = require('passport')
// const helmet = require('helmet') // !
// const hpp = require('hpp') // !
const redis = require('redis')
const RedisStore = require('connect-redis')(session)
// const cors = require('cors')

/** 데이터베이스 관련 */
const connect = require('./schemas')

/** 로그인 관련 */
const passportConfig = require('./passport')

/** 라우터 */
const { authRouter } = require('./routes/authRouter') // 유저 정보 관련 라우터
const { communityRouter } = require('./routes/communityRouter') // 커뮤니티 기능 관련 라우터
const { supportRouter } = require('./routes/supportRouter') // 서포트 라우터
const { myPageRouter } = require('./routes/myPageRouter') // 마이 페이지 라우터
const { imageRouter } = require('./routes/imageRouter') // 이미지 처리 라우터

const app = express()
const { PORT, COOKIE_KEY, NODE_ENV } = process.env
passportConfig() // 패스포트 설정

connect() // 몽고디비 연결

/** 미들웨어 설정 */
if (NODE_ENV === 'production') {
  // 베포 환경일 경우
  app.use(morgan('combined')) // 많은 사용자 정보를 로그로 남김
  // app.use(helmet())
  // @ts-ignore
  // app.use(hpp({ contentSecurityPolicy: false }))
} else {
  // 개발 환경일 경우
  app.use(morgan('dev'))
}

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// 레디스 설정
// const redisClient = redis.createClient({
//   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//   password: process.env.REDIS_PASSWORD,
// })

// app.use(
//   cors({
//     origin: true,
//     Credentials: true,
//   })
// )
// 세션 및 쿠키 설정
app.use(cookieParser(COOKIE_KEY))
const sessionOption = {
  key: 'sid',
  proxy: true,
  resave: true,
  httpOnly: false,
  saveUninitialized: false,
  secret: COOKIE_KEY,
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 1000 * 60 * 10,
  },
}
if (NODE_ENV === 'production') {
  // https 적용을 위해 노드 서버 앞에 다른 서버를 두었을 경우 true로 적용
  sessionOption.proxy = true
  sessionOption.cookie.secure = true
  // @ts-ignore
  // sessionOption.store = new RedisStore({ client: redisClient }) // ! redis 관련 수정
}

// @ts-ignore
app.use(session(sessionOption))
app.use(passport.initialize())
app.use(passport.session())
app.use('/uploads', express.static('uploads'))

/** 라우터 연결 */

// ! 삭제 필요
// * 불필요한 요청 방지
app.get('/favicon.ico', (req, res) => res.status(204).end())
app.get('/logo192.png', (req, res) => res.status(204).end())

// * 로그인, 로그아웃, 회원가입, 비밀번호 찾기 라우터
app.use('/api/account', authRouter)

// * 고객센터 라우터
app.use('/api/support', supportRouter)

// * 마이 페이지 라우터
app.use('/api/mypage', myPageRouter)

// * 커뮤니티 라우터
app.use('/api/community', communityRouter)

// * 이미지 프로세싱 라우터
app.use('/api/image', imageRouter)

/** 에러 핸들링 라우터 : 페이지가 없을 경우 메인 페이지로 돌아간다. */
app.use((err, req, res) => {
  // @ts-ignore
  const errorMessage = err.message
  // @ts-ignore
  const wrongUrl = req.url
  // eslint-disable-next-line
  console.error(` \n\n오류가 발생했습니다. : ${errorMessage}`)
  // eslint-disable-next-line
  console.error(`${wrongUrl} : 해당 페이지가 없습니다.`)
  // @ts-ignore
  // res.redirect('/')
  res.status(400).json({ message: 'ERROR!' })
})

/** 서버 실행 */
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`익스프레스 서버 실행 포트 : ${PORT}`)
})
