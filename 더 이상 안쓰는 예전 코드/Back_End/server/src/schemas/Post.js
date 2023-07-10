const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
  {
    writer_id: { type: String, required: true, default: '' },
    title: { type: String, required: true, default: '' },
    content: { type: String, required: true, default: '' },
    like_num: { type: Number, required: true, default: 0 }, // 좋아요 수
    view_count: { type: Number, required: true, default: 0 }, // 조회수
    s3_photo_img_url: [{ type: String }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Post', PostSchema)
