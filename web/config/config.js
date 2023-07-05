require('dotenv').config()

const development = {
  username: 'root',
  password: '1234',
  database: 'interiorpeople',
  host: '127.0.0.1',
  dialect: 'mysql',
}

const test = {
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
  host: process.env.RDS_HOST,
  port: process.env.RDS_PORT,
  dialect: 'mysql',
}

const production = {
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
  host: process.env.RDS_HOST,
  port: process.env.RDS_PORT,
  dialect: 'mysql',
  logging: false,
}

module.exports = { development, test, production }
