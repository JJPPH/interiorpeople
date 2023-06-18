const nodemailer = require('nodemailer')
const Transport = require('nodemailer-sendinblue-transport')

const emailTransporter = nodemailer.createTransport(new Transport({ apiKey: process.env.BREVO_API_KEY }))

module.exports = emailTransporter
