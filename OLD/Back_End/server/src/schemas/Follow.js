const mongoose = require('mongoose')

const FollowSchema = new mongoose.Schema(
  {
    follower_id: { type: String, required: true, default: '' },
    followed_id: { type: String, required: true, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Follow', FollowSchema)
