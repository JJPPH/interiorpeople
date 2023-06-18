const bcrypt = require('bcrypt')
const { generateUsername } = require('unique-username-generator')
require('dotenv').config()

module.exports = {
  async up(queryInterface) {
    const testUsers = []
    const testTasks = []

    // 테스트용으로 단순한 유저 데이터를 생성
    for (let i = 1; i < Number(process.env.TEST_USER_COUNT) + 1; i += 1) {
      const testTask = bcrypt.hash(i.toString(), 6).then((hashedPassword) => {
        testUsers.push({
          id: i,
          name: generateUsername('_', 0, 15),
          email: `${i}@test.com`,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })
      testTasks.push(testTask)
    }

    await Promise.all(testTasks)
    await queryInterface.bulkInsert('users', testUsers)
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {})
  },
}
