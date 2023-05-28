const Sequelize = require('sequelize')

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        name: {
          type: Sequelize.STRING(15),
          allowNull: false,
          unique: false,
        },
        email: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
        profileImg: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        // loginMethod:{},
        // snsId:{},
        // age: {
        //   type: Sequelize.INTEGER.UNSIGNED,
        //   allowNull: false,
        // },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }

  static associate(db) {
    db.User.hasMany(db.Post)
    db.User.belongsToMany(db.User, {
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow',
    })
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow',
    })
    db.User.hasMany(db.Comment, { foreignKey: 'commenterId', sourceKey: 'id' })
  }
}

module.exports = User
