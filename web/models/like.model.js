const { Sequelize } = require('sequelize')

class Like extends Sequelize.Model {
  static initiate(sequelize) {
    Like.init(
      {},
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
