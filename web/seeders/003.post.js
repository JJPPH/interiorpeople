const { faker } = require('@faker-js/faker')
require('dotenv').config()

module.exports = {
  async up(queryInterface) {
    const testPosts = []

    const userIds = (await queryInterface.sequelize.query('SELECT id FROM users'))[0]

    // 테스트용으로 단순한 포스트 데이터를 생성
    for (let i = 1; i < Number(process.env.TEST_POST_COUNT) + 1; i += 1) {
      testPosts.push({
        id: i,
        title: faker.lorem.words({ min: 2, max: 5 }).slice(0, 40),
        content: faker.lorem.sentences({ min: 2, max: 5 }).slice(0, 240),
        authorId: userIds[Math.floor(Math.random() * userIds.length)].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    await queryInterface.bulkInsert('posts', testPosts)
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('posts', null, {})
  },
}
