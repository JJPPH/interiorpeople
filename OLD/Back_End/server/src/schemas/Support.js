const mongoose = require('mongoose')

const SupportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: '' },
    content: { type: String, required: true, default: '' },
    type: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Support', SupportSchema)
