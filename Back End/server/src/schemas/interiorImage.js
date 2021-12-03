const mongoose = require('mongoose')

const InteriorImageSchema = new mongoose.Schema(
  {
    user_id: { type: String, default: '' },
    s3_pre_transfer_img_url: { type: String, default: '' },
    s3_theme_img_url: { type: String, default: 'none' },
    s3_post_transfer_img_url: { type: String, default: '' },
    category_in_img: { type: mongoose.Schema.Types.Mixed },
    selected_category: { type: mongoose.Schema.Types.Mixed },
    selected_color: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
)

module.exports = mongoose.model('InteriorImage', InteriorImageSchema)
