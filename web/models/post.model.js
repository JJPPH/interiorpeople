const Sequelize = require('sequelize')

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init(
      {
        content: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
        // TODO : 이미지를 몇 개로 할 것인지
        // img:{}
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Post',
        tableName: 'posts',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }

  static associate(db) {
    db.Post.belongsTo(db.User)
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' })
  }
}

module.exports = Post
