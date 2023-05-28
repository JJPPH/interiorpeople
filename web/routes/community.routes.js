const express = require('express')

const communityController = require('../controllers/community.controller')

// const { isLoggedIn } = require('../middlewares/check-auth.middleware')
// const multerConfig = require('../middlewares/multerConfig.middleware')

// const uploadPost = multerConfig('post_img')

const router = express.Router()

// TODO : 모든 포스트 가져오기
router.get('/all-post', communityController.getAllPost)

// TODO : 특정 유저의 포스트 가져오기
// router.get('/:id')

// TODO : 포스트 상세
// router.get('/post/:postId')

// TODO : 북마크를 눌렀을 시
// router.post('/post/:postId/bookmark')

// TODO : 팔로우를 눌렀을 시
// router.post('/post/:postId/follow')

/** 좋아요를 눌렀을 시 */

/** 포스트 작성 페이지 불러오기 */
// router.get('/post/create-post', isLoggedIn, communityController.getCreatePost)
/** 작성한 포스트 생성  */
// router.post('/post/create-post', isLoggedIn, uploadPost.array('images', 5), communityController.postCreatePost)

/** 포스트 삭제 */

/** 댓글 불러오기 */

/** 댓글 작성 */

/** 댓글 삭제 */

/** 댓글 신고 */

module.exports = router
