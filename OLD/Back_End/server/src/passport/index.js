const passport = require('passport')
const local = require('./localStrategy')
const User = require('../schemas/User')

module.exports = () => {
  // 로그인 시 실행
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // 매 요청 시 실행
  passport.deserializeUser((id, done) => {
    // ! 몽구스랑 몽고디비 쿼리 사용할 때 주의할 것
    User.findOne({ id })
      .then((user) => {
        done(null, user)
      })
      .catch((err) => {
        done(err)
      })
  })

  local()
}
