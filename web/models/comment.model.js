const { Sequelize, DataTypes } = require('sequelize')

class Comment extends Sequelize.Model {
  static initiate(sequelize) {
    Comment.init(
      {
        commentContent: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: '댓글의 내용',
        },
      },
      {
        sequelize,
        timeStamps: true,
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
