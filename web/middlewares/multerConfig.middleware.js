const path = require('path')
const multer = require('multer')
// const multer_s3 = require('multer-s3')
const { v1: uuid } = require('uuid')
// const mime = require('mime-types')
const fs = require('fs')

/** AWS 관련 */
// const { s3 } = require('../aws')

const multerConfig = (imageDirName) => {
  let multerSetting = multer()
  if (process.env.NODE_ENV === 'development') {
    /** 개발 환경에서는 로컬 스토리지에서 이미지 관리 */

    if (!fs.existsSync(`./uploads/${imageDirName}`)) {
      fs.mkdirSync(`./uploads/${imageDirName}`, { recursive: true })
    }

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './uploads')
      },
      filename: (req, file, cb) => {
        const fileName = `${imageDirName}/${uuid()}.${path.extname(file.originalname)}`
        cb(null, fileName)
      },
    })

    multerSetting = multer({
      storage,
      fileFilter: (req, file, cb) => {
        if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
          cb(null, true)
        } else {
          // @ts-ignore
          cb(new Error(`파일 타입이 이미지가 아닙니다! : ${file.mimetype}`), false)
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // 파일 크기를 5mb로 제한
      },
    })
  }

  // } else if (process.env.NODE_ENV === 'production') {
  //   /** production 환경일 경우 AWS S3에서 이미지 관리 */
  //   multerVariable = multer({
  //     storage: multers3({
  //       s3,
  //       bucket: 'interiorpeople',
  //       key(req, file, cb) {
  //         // 저장할 파일 위치 설정
  //         cb(null, `${imageDirName}/${uuid()}${path.extname(file.originalname)}`)
  //       },
  //     }),
  //     fileFilter: (req, file, cb) => {
  //       if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
  //         cb(null, true)
  //       } else {
  //         // @ts-ignore
  //         cb(new Error(`파일 타입이 이미지가 아닙니다! : ${file.mimetype}`), false)
  //       }
  //     },
  //     limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기를 5mb로 제한
  //   })
  // }
  return multerSetting
}

module.exports = multerConfig
