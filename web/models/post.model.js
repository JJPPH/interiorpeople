const { Sequelize, DataTypes } = require('sequelize')

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: '포스트의 제목',
        },
        content: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: '포스트의 내용',
        },
        likeCount: {
          type: DataTypes.INTEGER.UNSIGNED,
          defaultValue: 0,
          comment: '해당 포스트의 좋아요 수',
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }

  static associate(db) {
    db.Post.hasMany(db.PostImage, { foreignKey: 'postId', sourceKey: 'id' })
    db.Post.belongsTo(db.User, { foreignKey: 'authorId', targetKey: 'id' })
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Liker', foreignKey: 'postId' })
    db.Post.hasMany(db.Comment, { foreignKey: 'postId', sourceKey: 'id' })
  }
}

module.exports = Post
