const { Sequelize, DataTypes } = require('sequelize')

class PostImage extends Sequelize.Model {
  static initiate(sequelize) {
    PostImage.init(
      {
        originalname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        postImgUrl: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        postImgKey: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        postId: {
          type: DataTypes.INTEGER,
          primaryKey: false,
        },
      },
      {
        sequelize,
        timestamps: true,
      }
    )
  }

  static associate(db) {
    db.PostImage.belongsTo(db.Post, { foreignKey: 'postId', sourceKey: 'id' })
  }
}

module.exports = PostImage
