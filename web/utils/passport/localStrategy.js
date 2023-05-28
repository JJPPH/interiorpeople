const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const User = require('../../models/user.model')

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordFiled: 'password',
        passReqToCallback: false,
      },
      async (email, password, done) => {
        try {
          const existingUser = await User.findOne({ where: { email } })

          if (!existingUser) {
            done(null, false, { message: '잘못된 이메일' })
          } else {
            const passwordCheck = await bcrypt.compare(password, existingUser.password)
            if (!passwordCheck) {
              done(null, false, { message: '잘못된 비밀번호' })
            } else {
              done(null, existingUser)
            }
          }
        } catch (error) {
          done(error)
        }
      }
    )
  )
}
