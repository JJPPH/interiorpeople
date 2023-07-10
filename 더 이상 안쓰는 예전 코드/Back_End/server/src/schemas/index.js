/* eslint-disable no-console */
// @ts-check
require('dotenv').config()

const mongoose = require('mongoose')

const connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true)
  }
}

/**  몽구스와 몽고디비를 연결 */
mongoose.connect(`${process.env.MONGODB_URI}`, {}, (error) => {
  if (error) {
    console.log(`몽고디비 연결 에러 : ${error}`)
  } else {
    console.log(`몽고디비가 연결되었습니다.`)
  }
})

/** 몽구스 커넥션 */
mongoose.connection.on('error', (error) => {
  console.log(`mongoDB connect ERROR : ${error}`)
})
mongoose.connection.on('disconnected', () => {
  console.log(`몽고비디가 연결이 취소되었습니다. 다시 시도하십시오.`)
  connect()
})

module.exports = connect
