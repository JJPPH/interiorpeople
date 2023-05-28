const Sequelize = require('sequelize')

const env = process.env.NODE_ENV || 'development'
const config = require('../config/sequelize.config.json')[env]

const User = require('./user.model')
const Comment = require('./comment.model')
const Hashtag = require('./hashtag.model')
const Post = require('./post.model')

const db = {}

const sequelize = new Sequelize(config.database, config.username, config.password, config)

db.sequelize = sequelize

db.User = User
db.Comment = Comment
db.Hashtag = Hashtag
db.Post = Post

User.initiate(sequelize)
Comment.initiate(sequelize)
Hashtag.initiate(sequelize)
Post.initiate(sequelize)

User.associate(db)
Comment.associate(db)
Hashtag.associate(db)
Post.associate(db)

module.exports = db
