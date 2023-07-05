const path = require('path')
const multer = require('multer')
const { v4: uuid } = require('uuid')
const multerS3 = require('multer-s3')
const fs = require('fs')
const dotenv = require('dotenv')

const s3Client = require('../aws')

dotenv.config()

const multerConfig = (imageDirName) => {
  let multerSetting
  // 개발 환경에서는 로컬 스토리지에서 관리
  if (process.env.NODE_ENV === 'development') {
    const imageBasicPath = path.join(__dirname, '..', 'uploads', `${imageDirName}`)
    if (!fs.existsSync(imageBasicPath)) {
      fs.mkdirSync(imageBasicPath, { recursive: true })
    }

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, imageBasicPath)
      },
      filename: (req, file, cb) => {
        const fileName = `${uuid()}${path.extname(file.originalname)}`
        cb(null, fileName)
      },
    })

    multerSetting = multer({
      storage,
    })
  } else {
    // 개발 환경 이외에서는 S3에서 관리
    multerSetting = multer({
      storage: multerS3({
        s3: s3Client,
        bucket: process.env.S3_BUCKET_NAME,
        key(req, file, cb) {
          cb(null, `${imageDirName}/${uuid()}${path.extname(file.originalname)}`)
        },
      }),
    })
  }

  multerSetting.fileFilter = (req, file, cb) => {
    if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`파일 타입이 이미지가 아닙니다! : ${file.mimetype}`), false)
    }
  }

  multerSetting.limits = {
    fileSize: 1024 * 1024 * 5,
  }

  return multerSetting
}

module.exports = multerConfig
