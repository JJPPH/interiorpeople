const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema(
  {
    user_id: { type: String, ref: 'User', required: true },
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', require: true },
    content: { type: String, required: true, default: '' },
    nestedComments: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId },
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: {
          type: String,
          required: true,
          default: '',
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Comment', CommentSchema)
