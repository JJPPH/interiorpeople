const { Sequelize, DataTypes } = require('sequelize')

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        name: {
          type: DataTypes.STRING(15),
          allowNull: false,
          unique: false,
        },
        email: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        profileImgUrl: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: '/basicProfileImg/basic-user-image.png',
        },
        profileImgKey: {
          type: DataTypes.STRING,
          allowNull: true,
          default: null,
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

    db.User.belongsToMany(db.Post, { through: 'Like', as: 'LikedPost' })

    db.User.hasMany(db.Comment, { foreignKey: 'commenterId', sourceKey: 'id' })
  }
}

module.exports = User
