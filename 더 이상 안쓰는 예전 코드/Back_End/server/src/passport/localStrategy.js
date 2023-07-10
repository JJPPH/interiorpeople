const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const User = require('../schemas/User')

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'password',
      },
      async (id, password, done) => {
        try {
          const userCheck = await User.findOne({ id })
          if (userCheck) {
            // 비밀번호 비교
            const result = await bcrypt.compare(password, userCheck.hashedPassword)
            if (result) {
              // req.user에 넣을 정보를 정함
              done(null, userCheck)
            } else {
              done(null, false, { message: '입력된 정보가 올바르지 않습니다.' })
            }
          } else {
            done(null, false, { message: '입력된 정보가 올바르지 않습니다.' })
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err)
          done(err)
        }
      }
    )
  )
}
