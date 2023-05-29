const User = require('../models/user.model')

// &
exports.getMyPage = (req, res) => {
  res.render('user/my-page/my-page', { pageTitle: 'my-page' })
}

// &
// TODO : 수정
exports.postMyPage = async (req, res, next) => {
  try {
    const profileImg = req.file
    if (!profileImg) {
      res.redirect('/')
    }

    await User.update(
      {
        profileImg: profileImg.path,
      },
      { where: { email: req.user.email } }
    )

    res.json({ a: 1 })
  } catch (error) {
    next(error)
  }
}

// &
// TODO : 수정 필요
exports.deleteAccount = async (req, res, next) => {
  try {
    await User.destroy({ where: { email: req.user.email } })
    req.logout()
    res.json({ message: 'user deleted' })
  } catch (error) {
    next(error)
  }
}
