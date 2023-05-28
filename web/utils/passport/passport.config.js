const passport = require('passport')
const local = require('./localStrategy')

const User = require('../../models/user.model')

const setPassportConfig = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } })
      done(null, user)
    } catch (error) {
      done(error)
    }
  })

  local()
}

module.exports = setPassportConfig
