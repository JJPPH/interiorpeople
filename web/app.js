const path = require('path')
const morgan = require('morgan')
const express = require('express')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
// const helmet = require('helmet')
// const hpp = require('hpp')
// const redis = require('redis')
// const RedisStore = require('connect-redis')(session)
// const cors = require('cors')

require('dotenv').config()

/** 데이터베이스 */
const { sequelize } = require('./models/index')

/** 라우터 */
const baseRouter = require('./routes/base.routes')
const authRouter = require('./routes/auth.routes')
const communityRouter = require('./routes/community.routes')
// const imageProcessingRouter = require('./routes/.routes')
const myPageRouter = require('./routes/myPage.routes')
const supportRouter = require('./routes/support.routes')

const setPassportConfig = require('./utils/passport/passport.config')

const app = express()

setPassportConfig()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

sequelize.sync({ force: false })

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}

app.use(express.static(path.join(__dirname, 'public')))
app.use('/user_profile_img', express.static(path.join(__dirname, 'uploads/user_profile_img')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      // maxAge: 60 * 60 * 1000,
      // secure: false,
      httpOnly: true,
    },
  })
)
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

// TODO : 개발용
// if (process.env.NODE_ENV !== 'production') {
//   app.use((req, res, next) => {
//     const user = { email: '1@1.com', password: '1' }

//     // TODO : 삭제 필요
//     // eslint-disable-next-line consistent-return
//     req.logIn(user, (err) => {
//       if (err) {
//         return next(err)
//       }
//       next()
//     })
//   })
// }

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
  res.send(`<p>${err}</p><br><p>에러 발생</p>`)
})

app.listen(process.env.PORT, () => {
  // TODO : 에러 처리
  // eslint-disable-next-line no-console
  console.log('server on')
})
