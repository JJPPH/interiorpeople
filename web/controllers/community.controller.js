const { validationResult } = require('express-validator')
const { Op } = require('sequelize')

const Post = require('../models/post.model')
const PostImage = require('../models/postImage.model')
const User = require('../models/user.model')
const Like = require('../models/like.model')
const Comment = require('../models/comment.model')

// &
exports.getAllPosts = async (req, res) => {
  res.render('community/all-post', { pageTitle: 'all-posts' })
}

exports.getNextPosts = async (req, res, next) => {
  try {
    const lastPostId = req.query['last-post-id']

    // TODO : 코드를 더 짧게 수정 필요
    let allPosts
    if (!lastPostId) {
      allPosts = await Post.findAll({
        attributes: ['title', 'content', 'id', 'createdAt'],
        limit: 10,
        include: [
          { model: PostImage },
          {
            model: User,
            attributes: ['name', 'profileImg'],
          },
        ],
      })
    } else {
      allPosts = await Post.findAll({
        where: {
          id: {
            [Op.gt]: lastPostId,
          },
        },
        limit: 10,
        include: [
          { model: PostImage },
          {
            model: User,
            attributes: ['name', 'profileImg'],
          },
        ],
      })
    }

    return res.json(allPosts)
  } catch (error) {
    return next(error)
  }
}

exports.getCreatePost = (req, res) => {
  res.render('community/create-post', { pageTitle: 'create-post' })
}

// TODO : multer에서 사진을 다섯 개만 올리라고 했는데 6개 이상 올리는 경우 에러 처리
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
      // console.log(postImage)
      await post.createPostImage({
        originalname: postImage.filename,
        filename: postImage.filename,
        foldername: req.imgFolderName,
      })
    })

    return res.redirect('/community/all-posts')
  } catch (error) {
    return next(error)
  }
}

exports.patchLike = async (req, res, next) => {
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    // req.flash('errorMessage', validationErrors.array()[0].msg)
    throw new Error('잘못되었습니다.')
  }

  try {
    const { postId } = req.params
    const post = await Post.findByPk(postId)

    if (!post) {
      throw new Error('없는 포스트입니다.')
    }

    const { id: userId } = req.user

    const like = await Like.create({ userId, postId }) // TODO : 수정
    return res.json(like)
  } catch (error) {
    return next(error)
  }
}

exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params
    if (!postId) {
      throw new Error('유효하지 않은 포스트입니다.')
    }

    const post = await Post.findByPk(postId, {
      include: {
        model: User,
        attributes: ['id', 'name'],
      },
      raw: true,
    })

    const comments = await Comment.findAll({
      where: { postId },
      order: [['createdAt', 'ASC']],
      include: [{ model: User, attributes: ['name'] }],
      raw: true,
    })
    console.log(comments)

    return res.render('community/postDetail', { post, comments, pageTitle: post.title })
  } catch (error) {
    return next(error)
  }
}

exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params

    const post = await Post.findByPk(postId, {
      include: {
        model: User,
        where: { id: req.user.id },
      },
    })

    if (!post) {
      console.log(post)
    }

    if (!post) {
      console.log('throw error?', post)

      // TODO
      // !
      throw new Error('해당 유저는 포스트를 삭제할 수 없거나 존재하지 않는 포스트입니다.')
    }

    await post.destroy()

    return res.redirect('/community/all-posts')
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

exports.getEditPost = async (req, res, next) => {
  try {
    const { postId } = req.params

    const post = await Post.findByPk(postId, {
      include: {
        model: User,
        where: { id: req.user.id },
      },
      raw: true,
    })

    if (!post) {
      throw new Error('해당 유저는 포스트를 수정할 수 없습니다.')
    }

    return res.render('community/editPost', { pageTitle: 'edit post', post })
  } catch (error) {
    return next(error)
  }
}

// ! TODO : 수정피룡
exports.postComments = async (req, res, next) => {
  try {
    const { postId } = req.params
    if (!postId) {
      throw new Error('유효하지 않은 포스트입니다.')
    }

    const { comment } = req.body

    const post = await Post.findByPk(postId, { raw: true })

    if (!post) {
      console.log(123)
      throw new Error('존재하지 않는 포스트입니다.')
    }

    await Comment.create({ commenterId: req.user.id, postId, comment })

    const comments = await Comment.findAll({
      where: { postId },
      order: [['createdAt', 'ASC']],
      include: [{ model: User, attributes: ['id', 'name'] }],
      raw: true,
    })

    console.log(comments)
    return res.json(comments)
  } catch (error) {
    return next(error)
  }
}

exports.deleteComment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params
    console.log(postId, commentId)
    if (!postId || !commentId) {
      throw new Error('유효하지 않은 접근입니다.')
    }

    const comment = await Comment.findByPk(commentId)
    console.log(comment.dataValues.postId)
    if (Number(postId) !== comment.dataValues.postId) {
      throw new Error('이상한 접근입니다.')
    }
    console.log(123)
    await comment.destroy()

    return res.json({ delete: true, message: 'Deleted' })
  } catch (error) {
    return next(error)
  }
}
