// @ts-check

/** 모듈 */
const { Router } = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const fs = require('fs')

/** 데이터베이스 관련 */
const User = require('../schemas/User')
const Post = require('../schemas/Post')
const Bookmark = require('../schemas/Bookmark')

/** 로그인 관련 */
const { isLoggedIn } = require('../middlewares/authentication')

/** multer 및 AWS 관련 */
const { multerConfig } = require('../middlewares/multerConfig')
const { s3 } = require('../aws')
const interiorImage = require('../schemas/interiorImage')

const uploadProfilePhoto = multerConfig('profilePhoto_img')

/** 라우터선언 */
const myPageRouter = Router()

/** 메인 페이지 */
myPageRouter.get('/', isLoggedIn, async (req, res) => {
  try {
    // @ts-ignore
    const currentUser = await User.findOne({ id: req.user.id }).select(
      '_id id name s3_profilephoto_img_url email googleId naverId'
    )
    res.status(200).json(currentUser)
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 추천 기록 페이지 */
myPageRouter.get('/history', isLoggedIn, async (req, res) => {
  const { lastRecommendId } = req.query
  try {
    // @ts-ignore
    const userId = req.user.id

    // 유효하지 않은 포스트의 id인 경우
    if (lastRecommendId && !mongoose.isValidObjectId(lastRecommendId)) {
      throw new Error('잘못된 접근입니다.')
    }
    // @ts-ignore
    if (!userId) {
      throw new Error('권한이 없습니다.')
    }
    // @ts-ignore
    const Recommends = await interiorImage
      .find(
        lastRecommendId ? { user_id: userId, _id: { $lt: lastRecommendId } } : { user_id: userId }
      )
      .sort({ _id: -1 })
      .limit(20)
    // @ts-ignore
    if (Recommends) {
      res.status(200).json(Recommends)
    } else {
      res.status(200).json([])
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 북마크 페이지 */
myPageRouter.get('/bookmark', isLoggedIn, async (req, res) => {
  const { lastPostId } = req.query
  try {
    // @ts-ignore
    const userId = req.user.id

    // 유효하지 않은 포스트의 id인 경우
    if (lastPostId && !mongoose.isValidObjectId(lastPostId)) {
      throw new Error('잘못된 접근입니다.')
    }
    // @ts-ignore
    if (!userId) {
      throw new Error('권한이 없습니다.')
    }
    // @ts-ignore
    const bookmarkedPostId = await Bookmark.findOne(
      lastPostId ? { user_id: userId, post_id: { $lt: lastPostId } } : { user_id: userId }
    )
      .sort({ _id: -1 })
      .limit(20)
    // @ts-ignore
    if (bookmarkedPostId) {
      const bookmarkedPosts = await Post.find({ _id: { $in: bookmarkedPostId.post_id } })
      res.status(200).json(bookmarkedPosts)
    } else {
      res.status(200).json([])
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 프로필 수정 페이지 */
myPageRouter.patch('/profile', isLoggedIn, uploadProfilePhoto.single('image'), async (req, res) => {
  // @ts-ignore
  const currentUser = await User.findOne({ id: req.user.id })
  try {
    // 비밀번호 변경
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 11)
      currentUser.hashedPassword = hashedPassword
    }

    // 이름 변경
    if (req.body.name) {
      currentUser.name = req.body.name
    }

    // 프로필 사진 변경
    if (req.file) {
      const preProfilePhotoUrl = currentUser.s3_profilephoto_img_url
      if (preProfilePhotoUrl) {
        if (process.env.NODE_ENV === 'dev') {
          fs.unlink(`./uploads/${preProfilePhotoUrl}`, (err) => {
            if (err) {
              throw new Error('로컬 파일 삭제 불가')
            }
          })
        } else if (process.env.NODE_NEV === 'production') {
          const key = `${preProfilePhotoUrl.split('/').slice(3, 4)}/${preProfilePhotoUrl
            .split('/')
            .slice(4)}`
          s3.deleteObject(
            {
              Bucket: 'interiorpeople',
              Key: key,
            },
            (err) => {
              if (err) {
                throw new Error('s3 파일 삭제 실패')
              }
            }
          )
        }
      }
      if (process.env.NODE_ENV === 'dev') {
        // @ts-ignore
        req.file.location = req.file.filename
      }
      // @ts-ignore
      currentUser.s3_profilephoto_img_url = req.file.location
    }

    await currentUser.save()
    res.status(200).json({ succuss: true })
  } catch (err) {
    // @ts-ignore
    res.status(200).json({ message: err.message })
  }
})

module.exports = { myPageRouter }
