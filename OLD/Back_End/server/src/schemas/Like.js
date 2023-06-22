const mongoose = require('mongoose')

const LikeSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, default: '' },
    post_id: [{ type: String }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Like', LikeSchema)
