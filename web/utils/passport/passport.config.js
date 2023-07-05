const passport = require('passport')

const local = require('./localStrategy')

const User = require('../../models/user.model')

const setPassportConfig = () => {
  passport.serializeUser((userId, done) => {
    done(null, userId)
  })

  passport.deserializeUser(async (userId, done) => {
    try {
      const user = await User.findByPk(userId)
      const { id, profileImgUrl } = user
      done(null, { id, profileImgUrl })
    } catch (error) {
      done(error)
    }
  })

  local()
}

module.exports = setPassportConfig
