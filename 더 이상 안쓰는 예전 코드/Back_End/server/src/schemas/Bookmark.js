const mongoose = require('mongoose')

const BookmarkSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, default: '', unique: true },
    post_id: [{ type: String }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Bookmark', BookmarkSchema)
