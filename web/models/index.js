const Sequelize = require('sequelize')

const env = process.env.NODE_ENV || 'development'
const config = require('../config/config.json')[env]

const User = require('./user.model')
const Post = require('./post.model')
const PostImage = require('./postImage.model')
const Like = require('./like.model')
const Comment = require('./comment.model')

const db = {}

const sequelize = new Sequelize(config.database, config.username, config.password, config)

db.sequelize = sequelize

db.User = User
db.Post = Post
db.PostImage = PostImage
db.Comment = Comment
db.Like = Like

User.initiate(sequelize)
Post.initiate(sequelize)
PostImage.initiate(sequelize)
Comment.initiate(sequelize)
Like.initiate(sequelize)

User.associate(db)
Post.associate(db)
PostImage.associate(db)
Comment.associate(db)

module.exports = db
