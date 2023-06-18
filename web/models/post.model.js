const { Sequelize, DataTypes } = require('sequelize')

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init(
      {
        title: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(250),
          allowNull: false,
        },
        authorId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        likeCount: {
          type: DataTypes.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
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
    db.Post.hasMany(db.PostImage, { foreignKey: 'postId', sourceKey: 'id' })

    db.Post.belongsTo(db.User, { foreignKey: 'authorId', sourceKey: 'id' })

    db.Post.belongsToMany(db.User, { foreignKey: 'postId', through: 'Like' })

    db.Post.belongsTo(db.Comment, { foreignKey: 'postId', sourceKey: 'id' })
  }
}

module.exports = Post
