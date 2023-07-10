exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(400).send('로그인이 필요합니다.')
  }
}

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next()
  } else {
    // eslint-disable-next-line no-console
    console.error('이미 로그인되어 있습니다.')
    res.status(400).send('이미 로그인되어 있습니다.')
  }
}

exports.ifIsLoggedIn = (req, res, next) => {
  req.isAuthenticated()
  next()
}
