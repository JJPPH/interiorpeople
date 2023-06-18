const { Sequelize, DataTypes } = require('sequelize')

class Comment extends Sequelize.Model {
  static initiate(sequelize) {
    Comment.init(
      {
        commentContent: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        commenterId: {
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
        timeStamps: false,
        underscored: false,
        modelName: 'Comment',
        tableName: 'comments',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }

  static associate(db) {
    db.Comment.belongsTo(db.User, { foreignKey: 'commenterId', targetKey: 'id' })
    db.Comment.belongsTo(db.Post, { foreignKey: 'postId', targetKey: 'id' })
  }
}

module.exports = Comment
