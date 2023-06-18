const path = require('path')
const morgan = require('morgan')
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const dotenv = require('dotenv')
const RedisStore = require('connect-redis').default
// const helmet = require('helmet')
// const hpp = require('hpp')
// const cors = require('cors')

/** 데이터베이스 */
const { sequelize } = require('./models/index')

/** 라우터 */
const baseRouter = require('./routes/base.routes')
const authRouter = require('./routes/auth.routes')
const communityRouter = require('./routes/community.routes')
const myPageRouter = require('./routes/myPage.routes')
const supportRouter = require('./routes/support.routes')
// const imageProcessingRouter = require('./routes/.routes')

const setPassportConfig = require('./utils/passport/passport.config')

/** 유틸 */
const autoLogin = require('./utils/autoLogin')
const redisClient = require('./utils/redisClient')

const app = express()

dotenv.config()
redisClient.connect().catch((err) => {
  // eslint-disable-next-line no-console
  console.log(err)
})
setPassportConfig()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}

app.use(express.static(path.join(__dirname, 'public')))

app.use('/userProfileImg', express.static(path.join(__dirname, 'uploads/userProfileImg')))
app.use('/testPostImg', express.static(path.join(__dirname, 'uploads/testPostImg')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(
  session({
    name: 'connectID',
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      name: 'connectUser',
      maxAge: 60 * 60 * 1000,
      // secure: false,
      // httpOnly: true,
    },
    store: new RedisStore({
      client: redisClient,
      prefix: 'userSession:',
    }),
  })
)
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

if (process.env.NODE_ENV === 'development') {
  app.use(autoLogin)
}

// TODO : 수정 필요
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

app.use('/auth', authRouter)
app.use('/support', supportRouter)
app.use('/community', communityRouter)
app.use('/my-page', myPageRouter)
app.use(baseRouter)

// 에러 처리
app.use((req, res, next) => {
  const error = new Error(`${req.method} : ${req.url}`)
  next(error)
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // TODO : 에러 처리
  res.status(400).send(`<p>${err}</p><br><p>에러 발생</p>`)
})

sequelize.sync({ force: false })

app.listen(process.env.PORT, () => {
  // TODO : 에러 처리
  // eslint-disable-next-line no-console
  console.log('server on')
})
