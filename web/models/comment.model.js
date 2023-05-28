const Sequelize = require('sequelize')

class Comment extends Sequelize.Model {
  static initiate(sequelize) {
    Comment.init(
      {
        comment: {
          type: Sequelize.STRING(25),
          allowNull: false,
        },
      },
      {
        sequelize,
        timeStamps: true,
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
  }
}

module.exports = Comment
