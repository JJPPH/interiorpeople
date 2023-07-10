const express = require('express')
const { body: bodyValidator } = require('express-validator')

const communityController = require('../controllers/community.controller')

const { isLoggedIn } = require('../middlewares/authentication.middleware')
const multerConfig = require('../middlewares/multerConfig.middleware')

const postImgFolderName = 'userPostImg'
const uploadPostImg = multerConfig(postImgFolderName)

const router = express.Router()

router.get('/all-posts', communityController.getAllPosts)

router.get('/next-posts', communityController.getNextPosts)

router.get('/create-post', isLoggedIn, communityController.getCreatePost)

router.post(
  '/create-post',
  isLoggedIn,
  uploadPostImg.array('post-images', 5),
  [
    bodyValidator('title')
      .notEmpty()
      .trim()
      .withMessage('제목을 작성해 주세요.')
      .isLength({ min: 1, max: 30 })
      .withMessage('제목은 1글자 이상 30글자 이하로 작성해주세요.'),
    bodyValidator('content')
      .notEmpty()
      .trim()
      .withMessage('포스트의 내용을 작성해 주세요.')
      .isLength({ min: 1, max: 200 })
      .withMessage('포스트의 내용은 1글자 이상 200글자 이하로 작성해 주세요.'),
  ],
  (req, res, next) => {
    req.imgFolderName = postImgFolderName
    next()
  },
  communityController.postCreatePost
)

router.post('/like/:postId', isLoggedIn, communityController.postLike)

router.get('/post/:postId', communityController.getPost)

router.delete('/:postId', isLoggedIn, communityController.deletePost)

// router.get('/edit/:postId', isLoggedIn,  communityController.getEditPost)

router.post('/comment/:postId', isLoggedIn, communityController.postComments)

router.delete('/comment/:postId/:commentId', isLoggedIn, communityController.deleteComment)

module.exports = router
