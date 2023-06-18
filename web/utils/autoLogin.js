// 개발 시 자동으로 로그인
const passport = require('passport')

module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.body.email = '11@test.com'
    req.body.password = '11'

    passport.authenticate('local', async (authError, user) => {
      if (authError) {
        return next(authError)
      }

      return req.login(user, (loginError) => {
        if (loginError) {
          return next(loginError)
        }
        return next()
      })
    })(req, res, next)
  } else {
    next()
  }
}
