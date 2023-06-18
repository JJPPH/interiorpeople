module.exports = {
  up: async (queryInterface) => {
    // 모든 테이블 이름을 조회
    const tableNames = await queryInterface.showAllTables()

    // 각 테이블을 순회하며 데이터 삭제
    await Promise.all(
      tableNames.map(async (tableName) => {
        await queryInterface.bulkDelete(tableName, null, {})
      })
    )
  },
}
