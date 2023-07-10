const { Sequelize, DataTypes } = require('sequelize')

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: '사용자의 이름',
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: { isEmail: true },
          comment: '사용자의 이메일',
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: '사용자의 비밀번호',
        },
        profileImgUrl: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: '/basicProfileImg/basic-user-image.png',
          comment: '이미지의 기존 이름',
        },
        profileImgKey: {
          type: DataTypes.STRING,
          allowNull: true,
          default: null,
          comment: '이미지의 기존 이름',
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }

  static associate(db) {
    db.User.hasMany(db.Post, { foreignKey: 'authorId', sourceKey: 'id' })
    db.User.hasMany(db.Comment, { foreignKey: 'commenterId', sourceKey: 'id' })
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'LikedPost', foreignKey: 'userId' })
  }
}

module.exports = User
