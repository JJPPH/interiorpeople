const passport = require('passport')
const local = require('./localStrategy')

const User = require('../../models/user.model')

const setPassportConfig = () => {
  passport.serializeUser((user, done) => {
    done(null, user.email)
  })

  passport.deserializeUser(async (email, done) => {
    try {
      const user = await User.findOne({ where: { email } })
      done(null, user)
    } catch (error) {
      done(error)
    }
  })

  local()
}

module.exports = setPassportConfig
