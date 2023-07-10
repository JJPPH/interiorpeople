// @ts-check

/** 모듈 */
const { Router } = require('express')
const requestip = require('request-ip')
const mongoose = require('mongoose')
const fs = require('fs')
const { promisify } = require('util')

const fileUnlink = promisify(fs.unlink)

/** 데이터베이스 관련 */
const Post = require('../schemas/Post')
const Like = require('../schemas/Like')
const Bookmark = require('../schemas/Bookmark')
const Follow = require('../schemas/Follow')
const Comment = require('../schemas/Comment')

/** 로그인 관련 */
const { isLoggedIn, ifIsLoggedIn } = require('../middlewares/authentication')

/** multer 및 AWS 관련 */
const { multerConfig } = require('../middlewares/multerConfig')
const { s3 } = require('../aws')

const uploadPost = multerConfig('post_img')

/** 라우터 */
const communityRouter = Router()

// TODO : 메인홈
// TODO : 포스트 클릭 어떻게 구현
// TODO : 인기글, 나의 글 구현

/** 공개된 모든 포스트 불러오기  */
communityRouter.get('/post-list', ifIsLoggedIn, async (req, res) => {
  const { lastPostId } = req.query
  try {
    // 유효하지 않은 포스트의 id인 경우
    if (lastPostId && !mongoose.isValidObjectId(lastPostId)) {
      throw new Error('잘못된 접근입니다.')
    }
    const posts = await Post.find(lastPostId ? { _id: { $lt: lastPostId } } : {})
      .sort({ _id: -1 })
      .limit(20)
    res.status(200).json(posts)
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 나의 포스트 불러오기 */
communityRouter.get('/mypost', isLoggedIn, async (req, res) => {
  const { lastPostId } = req.query
  try {
    // @ts-ignore
    const userId = req.user.id
    // const realUserId = req.cookies.user

    // 유효하지 않은 포스트의 id인 경우
    if (lastPostId && !mongoose.isValidObjectId(lastPostId)) {
      throw new Error('잘못된 접근입니다.')
    }
    // @ts-ignore
    if (!userId) {
      throw new Error('권한이 없습니다.')
    }
    // @ts-ignore
    const myPosts = await Post.find(
      lastPostId ? { writer_id: userId, _id: { $lt: lastPostId } } : { writer_id: userId }
    )
      .sort({ _id: -1 })
      .limit(20)
    res.status(200).json(myPosts)
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 포스트 상세 */
communityRouter.get('/post/:postId', ifIsLoggedIn, async (req, res) => {
  const { postId } = req.params
  try {
    // 포스트 찾아오기
    const currentPost = await Post.findById(postId)

    // @ts-ignore
    const userId = req.user ? req.user.id : undefined
    // 로그인한 유저인 경우
    if (userId) {
      // 조회수 기록
      if (userId && !req.cookies[postId]) {
        // 조회수 증가
        const clientIP = requestip.getClientIp(req) // 사용자 ip
        res.cookie(postId, clientIP, { maxAge: 1000 * 10 * 60 })
        currentPost.view_count += 1
        await currentPost.save()
      }

      const checkResult = { likeCheckResult: '', bookmarkCheckResult: '', followCheckResult: '' }
      // 좋아요가 눌러져 있는지 확인
      const userLikeList = await Like.findOne({ id: userId })
      if (!userLikeList) {
        checkResult.likeCheckResult = 'unLike'
      } else {
        const likeCheck = userLikeList.post_id.includes(postId)
        if (likeCheck) {
          // 이미 좋아요를 한 경우
          checkResult.likeCheckResult = 'like'
        } else {
          // 좋아요를 하지 않은 경우
          checkResult.likeCheckResult = 'unLike'
        }
      }

      // 북마크가 눌러져 있는지 확인
      const userBookmarkList = await Bookmark.findOne({ id: userId })
      if (!userBookmarkList) {
        checkResult.bookmarkCheckResult = 'unBookmark'
      } else {
        const bookmarkCheck = userBookmarkList.post_id.includes(postId)
        if (bookmarkCheck) {
          // 이미 스크랩을 한 경우
          checkResult.bookmarkCheckResult = 'bookmark'
        } else {
          // 스크랩을 하지 않은 경우
          checkResult.bookmarkCheckResult = 'unBookmark'
        }
      }

      // 팔로우가 되어 있는지 확인
      const userFollowList = await Follow.find({ id: userId })
      if (!userFollowList) {
        checkResult.followCheckResult = 'unFollow'
      } else {
        let followCheck = false
        for (let i = 0; i < userFollowList.length; i += 1) {
          if (userFollowList[i].followed_id === currentPost.writer_id) {
            followCheck = true
            break
          }
        }
        if (followCheck) {
          // 이미 팔로우를 한 경우
          checkResult.followCheckResult = 'follow'
        } else {
          // 팔로우를 하지 않은 경우
          checkResult.followCheckResult = 'unFollow'
        }
      }
      res.status(200).json({ post: currentPost, checkResult })
    } else {
      res.status(200).json({ post: currentPost })
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 북마크를 눌렀을 시 */
communityRouter.post('/post/:postId/bookmark', isLoggedIn, async (req, res) => {
  const { postId } = req.params
  // @ts-ignore
  const userId = req.user.id

  try {
    // 먼저 Bookmark 컬렉션에 유저 아이디가 있는지 확인
    const userBookmarkList = await Bookmark.findOne({ user_id: userId })
    if (userBookmarkList) {
      // 이미 북마크가 되어 있어 북마크를 취소할 시
      // @ts-ignore
      const postIdIndex = userBookmarkList.post_id.findIndex((element) => element === postId)
      if (postIdIndex !== -1) {
        userBookmarkList.post_id.splice(postIdIndex, 1)
        await userBookmarkList.save()
        res.status(200).json({ message: 'unBookmark' })
      }
      // 북마크를 할 시
      else {
        userBookmarkList.post_id = [...userBookmarkList.post_id, postId]
        await userBookmarkList.save()
        res.status(200).json({ message: 'bookmark' })
      }
    } else {
      // 컬렉션에 데이터 생성
      await new Bookmark({
        user_id: userId,
        post_id: [postId],
      }).save()
      res.status(200).json({ message: 'bookmark' })
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 팔로우을 눌렀을 시 */
communityRouter.post('/post/:postId/follow', isLoggedIn, async (req, res) => {
  const { postId } = req.params
  // @ts-ignore
  const userId = req.user.id

  try {
    // 먼저 like 컬렉션에 유저 아이디가 있는지 확인
    const currentPost = await Post.findById(postId)
    const writerIdOfPost = currentPost.writer_id
    // 이미 팔로우 되어 있다면 팔로우를 찾는 동시에 삭제함으로써 팔로우 해제시킴
    const isFollowing = await Follow.findOneAndDelete({
      follower_id: userId,
      followed_id: writerIdOfPost,
    })
    /**
     * ? findOneAndDelete 리턴값
     * ? isFollowing === null : 애초에 데이터가 없음
     * ? isFollowing === 어떤 객체 : 삭제한 데이터를 반환함
     */
    if (isFollowing) {
      // 이미 팔로우가 되어 있어 팔로우를 취소한 경우
      res.status(200).json({ message: 'unFollow' })
    } else {
      // 팔로우를 하는 경우
      await new Follow({ follower_id: userId, followed_id: writerIdOfPost }).save()
      res.status(200).json({ message: 'follow' })
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 좋아요를 눌렀을 시 */
communityRouter.post('/post/:postId/like', isLoggedIn, async (req, res) => {
  const { postId } = req.params
  // @ts-ignore
  const userId = req.user.id
  // 먼저 like 컬렉션에 유저 아이디가 있는지 확인
  try {
    const userLikeList = await Like.findOne({ user_id: userId })
    const currentPost = await Post.findById(postId)
    if (!currentPost) {
      throw new Error('존재하지 않는 포스트입니다.')
    }
    // 있는 경우
    if (userLikeList) {
      // 이미 좋아요가 되어 있어 좋아요를 취소할 시
      // @ts-ignore
      const postIdIndex = userLikeList.post_id.findIndex((element) => element === postId)
      if (postIdIndex !== -1) {
        userLikeList.post_id.splice(postIdIndex, 1)
        currentPost.like_num -= 1
        await userLikeList.save()
        await currentPost.save()
        res.status(200).json({ message: 'unLike' })
      }
      // 좋아요를 할 시
      else {
        userLikeList.post_id = [...userLikeList.post_id, postId]
        currentPost.like_num += 1
        await userLikeList.save()
        await currentPost.save()
        res.status(200).json({ message: 'like' })
      }
    }
    // 없는 경우
    else {
      // 좋아요를 누름
      currentPost.like_num += 1
      await currentPost.save()
      await new Like({
        user_id: userId,
        post_id: [postId],
      }).save()
      res.status(200).json({ message: 'like' })
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 포스트 작성 */
// upload.array('키', 최대파일개수)
communityRouter.post(
  '/mypost/write',
  isLoggedIn,
  uploadPost.array('images', 10),
  async (req, res) => {
    try {
      // 객체 배열에서 특정 요소를 추출할 때는 filter가 아니라 map을 사용함.
      if (process.env.NODE_ENV === 'dev') {
        // @ts-ignore
        req.files.forEach((element) => {
          // eslint-disable-next-line no-param-reassign
          element.location = element.filename
        })
      }

      // @ts-ignore
      const imgURLs = req.files.map((element) => element.location)
      // 포스트 생성
      const createdPost = await new Post({
        // @ts-ignore
        writer_id: req.user.id,
        title: req.body.title,
        content: req.body.content,
        like_num: 0,
        s3_photo_img_url: imgURLs,
      }).save()
      res.status(200).json(createdPost)
    } catch (err) {
      // @ts-ignore
      res.status(400).json({ message: err.message })
    }
  }
)

/** 포스트 삭제 */
communityRouter.delete('/post/:postId/delete', isLoggedIn, async (req, res) => {
  // @ts-ignore
  const userId = req.user.id
  const { postId } = req.params
  try {
    // ObjectId 인지 확인
    if (!mongoose.isValidObjectId(postId)) {
      throw new Error(`올바르지 않은 포스트입니다.`)
    }
    // 댓글, 북마크, 좋아요 삭제
    await Comment.deleteMany({ post_id: postId })
    await Bookmark.updateMany({}, { $pull: { post_id: postId } })
    await Like.updateMany({}, { $pull: { post_id: postId } })

    const post = await Post.findOneAndDelete({ _id: postId, writer_id: userId })
    if (!post) {
      return res.status(400).json({ message: '존재하지 않는 포스트입니다.' })
    }
    const imgUrls = post.s3_photo_img_url
    if (process.env.NODE_ENV === 'dev') {
      Array.from(imgUrls).forEach(async (element) => {
        await fileUnlink(`./uploads/${element}`)
      })
    } else if (process.env.NODE_NEV === 'production') {
      // ? 유사배열이라고 한다.
      Array.from(imgUrls).forEach(async (element) => {
        const key = `${element.split('/').slice(3, 4)}/${element.split('/').slice(4)}`
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
      })
    }

    return res.status(200).json({ message: '성공적으로 삭제되었습니다.' })
  } catch (err) {
    // @ts-ignore
    return res.status(400).json({ message: err.message })
  }
})

/** 댓글 불러오기 */
communityRouter.get('/post/:postId/comment-list', ifIsLoggedIn, async (req, res) => {
  const { lastCommentId } = req.query
  const { postId } = req.params
  try {
    if (lastCommentId && !mongoose.isValidObjectId(lastCommentId)) {
      throw new Error('잘못된 접근입니다.')
    }
    const comments = await Comment.find(
      lastCommentId ? { post_id: postId, _id: { $lt: lastCommentId } } : { post_id: postId }
    )
      .sort({ _id: -1 })
      .limit(5)
    res.status(200).json(comments)
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 댓글 작성 */
communityRouter.post('/post/:postId/write-comment', isLoggedIn, async (req, res) => {
  // @ts-ignore
  const userId = req.user.id
  const { parentCommentId, content } = req.body
  const { postId } = req.params
  try {
    if (parentCommentId === '') {
      // 일반 댓글인 경우
      await new Comment({
        user_id: userId,
        post_id: postId,
        content,
        nestedComments: [],
      }).save()
      res.status(200).json({ message: 'created' })
    } else {
      // 대댓글인 경우
      const comment = await Comment.findById(parentCommentId)
      comment.nestedComments.push({
        user_id: userId,
        content,
      })
      await comment.save()
      res.status(200).json({ message: 'created' })
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 댓글 삭제 */
communityRouter.delete('/post/:postId/delete-comment', isLoggedIn, async (req, res) => {
  // @ts-ignore
  const userId = req.user.id
  const { parentCommentId, commentId } = req.body
  try {
    // 일반 댓글을 삭제하는 경우
    if (parentCommentId === '') {
      await Comment.findOneAndDelete({ _id: commentId, user_id: userId })
      res.status(200).json({ message: 'deleted' })
    } else {
      // 대댓글을 삭제하는 경우
      const parentComment = await Comment.findById(parentCommentId)
      parentComment.nestedComments = parentComment.nestedComments.filter(
        // @ts-ignore
        // eslint-disable-next-line
        (comment) => !(comment._id === commentId && user_id === userId)
      )
      parentComment.save()
      res.status(200).json({ message: 'deleted' })
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

module.exports = { communityRouter }
