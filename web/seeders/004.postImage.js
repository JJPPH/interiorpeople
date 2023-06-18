require('dotenv').config()

module.exports = {
  async up(queryInterface) {
    const testPostImages = []

    const postIds = (await queryInterface.sequelize.query('SELECT id FROM posts'))[0]

    // 테스트용으로 단순한 포스트 이미지 데이터를 생성
    for (let i = 1; i < Number(process.env.TEST_POST_IMAGE_COUNT) + 1; i += 1) {
      testPostImages.push({
        id: i,
        originalname: `testImage${i.toString().padStart(3, '0')}.jpg`,
        filename: `testImage${i.toString().padStart(3, '0')}.jpg`,
        foldername: 'testPostImg',
        postId: postIds[i % process.env.TEST_POST_COUNT].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    await queryInterface.bulkInsert('postimages', testPostImages)
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('postimages', null, {})
  },
}
