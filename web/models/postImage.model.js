const { Sequelize, DataTypes } = require('sequelize')

class PostImage extends Sequelize.Model {
  static initiate(sequelize) {
    PostImage.init(
      {
        originalname: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: '이미지의 기존 이름',
        },
        postImgUrl: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: '이미지의 URL',
        },
        postImgKey: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: 's3에 저장된 이미지의 키',
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
