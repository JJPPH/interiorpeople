const path = require('path')
const fs = require('fs')
const morgan = require('morgan')
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const dotenv = require('dotenv')
const RedisStore = require('connect-redis').default
const helmet = require('helmet')
const hpp = require('hpp')
const cron = require('node-cron')

const { sequelize } = require('./models/index')

const baseRouter = require('./routes/base.routes')
const authRouter = require('./routes/auth.routes')
const communityRouter = require('./routes/community.routes')
const myPageRouter = require('./routes/myPage.routes')
const supportRouter = require('./routes/support.routes')
const imageConversionRouter = require('./routes/imageConversion.routes')

const setPassportConfig = require('./utils/passport/passport.config')

const autoLogin = require('./utils/autoLogin')
const redisClient = require('./utils/redisClient')

const app = express()

dotenv.config()
setPassportConfig()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV === 'development') {
  app.use('/userProfileImg', express.static(path.join(__dirname, 'uploads/userProfileImg')))
  app.use('/userPostImg', express.static(path.join(__dirname, 'uploads/userPostImg')))
  app.use('/testPostImg', express.static(path.join(__dirname, 'uploads/testPostImg')))
}

app.use('/basicProfileImg', express.static(path.join(__dirname, 'images/basicProfileImg')))
app.use('/machineLearning', express.static(path.join(__dirname, 'uploads/machineLearning')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
  app.use(hpp())
  app.use(helmet({ contentSecurityPolicy: false }))
}

app.use(cookieParser(process.env.COOKIE_SECRET))

const expressSessionOption = {
  name: 'connectID',
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    name: 'connectUser',
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
  },
}

if (process.env.NODE_ENV === 'development') {
  expressSessionOption.store = new session.MemoryStore({ prefix: 'userSession:' })
} else {
  expressSessionOption.store = new RedisStore({ client: redisClient, prefix: 'userSession:' })
}

app.use(session(expressSessionOption))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user
  } else {
    res.locals.user = { id: null, profileImg: null }
  }
  next()
})

if (process.env.NODE_ENV === 'development') {
  // app.use(autoLogin)
}

app.use('/auth', authRouter)
app.use('/support', supportRouter)
app.use('/community', communityRouter)
app.use('/my-page', myPageRouter)
app.use('/image-conversion', imageConversionRouter)
app.use(baseRouter)

app.use((req, res, next) => {
  res.status(404)
  const error = new Error(`${req.method}/${req.url}`)
  next(error)
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (res.statusCode === 404) {
    res.status(404).render('error/404', { pageTitle: '404' })
  } else {
    res.status(500).render('error/500', { pageTitle: '500' })
  }
})

sequelize.sync({ force: false }).then(() => {
  redisClient.connect().then(() => {
    app.listen(process.env.PORT)
  })
})

cron.schedule('5 * * * *', () => {
  const folderPath = './uploads/machineLearning'

  const mlFolderContents = fs.readdirSync(folderPath)
  const currentTimestamp = Date.now()

  mlFolderContents.forEach((folder) => {
    const folderContentsPath = path.join(folderPath, folder)
    const subFolderContents = fs.readdirSync(folderContentsPath)

    subFolderContents.forEach((subFolder) => {
      const subFolderPath = path.join(folderContentsPath, subFolder)
      const timestampString = subFolder.split('-')[0]
      const folderTimestamp = parseInt(timestampString, 10)

      const timeDifference = currentTimestamp - folderTimestamp

      // 1시간(3,600,000 밀리초) 이상 차이나는 경우 해당 폴더 삭제
      if (timeDifference >= 3600000) {
        fs.rm(subFolderPath, { recursive: true, force: true }, () => {})
      }
    })
  })
})
