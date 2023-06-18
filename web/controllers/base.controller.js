// = 홈 화면 보여주기
exports.getIndex = (req, res) => {
  res.render('index', { pageTitle: 'HOME' })
}
