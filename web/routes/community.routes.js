const express = require('express')
const { body: bodyValidator, param: paramValidator } = require('express-validator')

/** 컨트롤러 */
const communityController = require('../controllers/community.controller')

/** 미들웨어 */
const { isLoggedIn } = require('../middlewares/checkAuth.middleware')
const multerConfig = require('../middlewares/multerConfig.middleware')

const postImgFolderName = 'userPostImg'
const uploadPostImg = multerConfig(postImgFolderName)

const router = express.Router()

// = 모든 포스트 가져오기
router.get('/all-posts', communityController.getAllPosts)

// = 다음 포스트 가져오기
router.get('/next-posts', communityController.getNextPosts)

// = 포스트 상세 가져오기
router.get('/post/:postId', paramValidator('postId').notEmpty(), communityController.getPost)

// = 좋아요 처리하기
router.patch('/like/:postId', isLoggedIn, paramValidator('postId').notEmpty(), communityController.patchLike)

// = 새 포스트 작성 화면 가져오기
router.get('/create-post', isLoggedIn, communityController.getCreatePost)

// = 새 포스트 작성 처리하기
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

// = 포스트 삭제 처리하기
router.delete('/:postId', isLoggedIn, paramValidator('postId').notEmpty(), communityController.deletePost)

// = 포스트 수정 화면 가져오기
router.get('/edit/:postId', isLoggedIn, paramValidator('postId').notEmpty(), communityController.getEditPost)

// = 새 댓글 작성 처리하기
router.post('/comment/:postId', isLoggedIn, paramValidator('postId').notEmpty(), communityController.postComments)

// = 댓글 삭제 처리하기
router.delete(
  '/comment/:postId/:commentId',
  isLoggedIn,
  [paramValidator('postId').notEmpty(), paramValidator('commentId').notEmpty()],
  communityController.deleteComment
)

module.exports = router
