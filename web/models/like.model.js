const { Sequelize, DataTypes } = require('sequelize')

class Like extends Sequelize.Model {
  static initiate(sequelize) {
    Like.init(
      {
        likeUserId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'Like',
        tableName: 'likes',
        paranoid: false,
      }
    )
  }
}

module.exports = Like
