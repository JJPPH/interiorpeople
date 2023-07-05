const { validationResult } = require('express-validator')
const { Op } = require('sequelize')
const { DeleteObjectCommand } = require('@aws-sdk/client-s3')

const s3Client = require('../aws')

const Post = require('../models/post.model')
const PostImage = require('../models/postImage.model')
const User = require('../models/user.model')
const Comment = require('../models/comment.model')

// = 모든 포스트 가져오기
exports.getAllPosts = async (req, res) => {
  res.status(200).render('community/allPosts', { pageTitle: 'all-posts' })
}

// = 다음 포스트 가져오기
exports.getNextPosts = async (req, res) => {
  try {
    const lastPostId = req.query['last-post-id']

    const posts = await Post.findAll({
      order: [['id', 'DESC']],
      limit: 10,
      attributes: ['title', 'content', 'id', 'createdAt', 'likeCount'],
      where: lastPostId ? { id: { [Op.lt]: lastPostId } } : null,
      include: [
        {
          model: PostImage,
          attributes: ['postImgUrl', 'originalname'],
        },
        {
          model: User,
          attributes: [
            ['name', 'authorName'],
            ['profileImgUrl', 'authorProfileImgUrl'],
          ],
        },
      ],
    })

    if (!posts || posts.length === 0) {
      return res.status(204).end()
    }

    return res.status(200).json({ posts, success: true })
  } catch (error) {
    return res.status(500).json({ message: '서버 에러가 발생했습니다.', success: false })
  }
}

// = 새 포스트 작성 화면 가져오기
exports.getCreatePost = (req, res) => {
  const errorMessage = req.flash('errorMessage')
  res.render('community/createPost', { pageTitle: 'create post', errorMessage })
}

// = 새 포스트 작성 처리하기
exports.postCreatePost = async (req, res, next) => {
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    req.flash('errorMessage', validationErrors.array()[0].msg)
    return res.redirect('/community/create-post')
  }

  const postImages = req.files
  if (!postImages || postImages.length === 0) {
    req.flash('errorMessage', '이미지를 업로드해주세요.')
    return res.redirect('/community/create-post')
  }

  const { title, content } = req.body
  try {
    const post = await Post.create({ authorId: req.user.id, title, content })
    postImages.forEach(async (postImage) => {
      await post.createPostImage({
        originalname: postImage.originalname,
        postImgUrl: postImage.location,
        postImgKey: postImage.key,
      })
    })

    return res.redirect('/community/all-posts')
  } catch (error) {
    return next(error)
  }
}

// = 좋아요 처리하기
exports.patchLike = async (req, res, next) => {
  try {
    const { postId } = req.params
    const post = await Post.findByPk(postId)

    if (!post) {
      throw new Error('없는 포스트입니다.')
    }

    const hasLiked = await post.hasLiker(req.user.id)

    if (hasLiked) {
      await post.removeLiker(req.user.id)
      post.likeCount -= 1
      await post.save()
      return res.json({ message: '좋아요가 취소되었습니다.', success: true, like: false })
    }

    await post.addLiker(req.user.id)
    post.likeCount += 1
    await post.save()

    return res.json({ message: '좋아요가 성공하였습니다.', success: true, like: true })
  } catch (error) {
    return next(error)
  }
}

// = 포스트 상세 가져오기
exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params
    if (!postId) {
      throw new Error('유효하지 않은 포스트입니다.')
    }

    const post = await Post.findByPk(postId, {
      include: { model: User, attributes: ['name'] },
    })

    if (!post) {
      throw new Error('유효하지 않은 포스트입니다.')
    }

    const postImages = await PostImage.findAll({ where: { postId } })

    const comments = await Comment.findAll({
      where: { postId },
      order: [['createdAt', 'ASC']],
      include: [{ model: User, attributes: ['name'] }],
    })

    let hasLiked
    if (req.user) {
      hasLiked = await post.hasLiker(req.user.id)
    } else {
      hasLiked = false
    }

    return res.render('community/postDetail', {
      post,
      postImages,
      comments,
      hasLiked,
      pageTitle: post.title,
    })
  } catch (error) {
    return next(error)
  }
}

// = 포스트 삭제 처리하기
exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params

    const post = await Post.findByPk(postId)

    if (!post) {
      res.status(404)
      throw new Error('존재하지 않는 포스트입니다.')
    }

    if (post.authorId !== req.user.id) {
      res.status(403)
      throw new Error('권한이 없습니다.')
    }

    const postImages = await PostImage.findAll({ where: { postId } })

    postImages.forEach(async (postImage) => {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: postImage.postImgKey,
        })
      )
    })

    await post.destroy()

    res.status(200).json({ message: '성공적으로 삭제되었습니다.', success: true })
  } catch (error) {
    if (res.statusCode === 403) {
      res.status(403).json({ message: error.message, success: false })
    } else {
      next(error)
    }
  }
}

// &
// exports.getEditPost = async (req, res, next) => {
//   try {
//     const { postId } = req.params

//     const post = await Post.findByPk(postId, {
//       include: {
//         model: User,
//         where: { id: req.user.id },
//       },
//     })

//     if (!post) {
//       throw new Error('해당 유저는 포스트를 수정할 수 없습니다.')
//     }

//     return res.render('community/editPost', { pageTitle: 'edit post', post })
//   } catch (error) {
//     return next(error)
//   }
// }

// = 새 댓글 작성 처리하기
exports.postComments = async (req, res, next) => {
  try {
    const { postId } = req.params
    const { comment } = req.body

    const post = await Post.findByPk(postId)

    if (!post) {
      throw new Error('존재하지 않는 포스트입니다.')
    }

    await Comment.create({ commenterId: req.user.id, postId, commentContent: comment })

    const comments = await Comment.findAll({
      where: { postId },
      order: [['createdAt', 'ASC']],
      include: [{ model: User, attributes: ['name'] }],
    })

    return res.json({ comments, message: '댓글이 성공적으로 생성되었습니다', success: true })
  } catch (error) {
    return next(error)
  }
}

// = 댓글 삭제 처리하기
exports.deleteComment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params

    const commentToDelete = await Comment.findByPk(commentId)
    if (Number(postId) !== commentToDelete.postId) {
      throw new Error('유효하지 않은 접근입니다.')
    }
    await commentToDelete.destroy()

    const comments = await Comment.findAll({
      where: { postId },
      order: [['createdAt', 'ASC']],
      include: [{ model: User, attributes: ['name'] }],
    })

    return res.json({ comments, message: '댓글이 성공적으로 삭제되었습니다', success: true })
  } catch (error) {
    return next(error)
  }
}
