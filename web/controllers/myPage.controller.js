const User = require('../models/user.model')

// &
exports.getMyPage = (req, res) => {
  res.render('user/my-page/my-page', { pageTitle: 'my-page' })
}

// &
exports.postMyPage = async (req, res, next) => {
  try {
    const user = await User.findOne({
      id: req.user.id,
    })
    if (user) {
      res.render('/my-page', { pageTitle: 'my-page' })
    } else {
      res.status(404).send('no uer')
    }
  } catch (error) {
    next(error)
  }
}
