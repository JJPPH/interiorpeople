const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    name: { type: String, required: false, default: '' },
    s3_profilephoto_img_url: { type: String, default: '' },
    s3_history_img_url: [{ type: String }],
    s3_myphoto_img_url: [{ type: String }],
    // 미구현 사항
    email: { type: String, required: false, trim: true, default: '' }, // , unique: true
    googleId: { type: String, required: false, default: '' }, // , unique: true
    naverId: { type: String, required: false, default: '' }, // , unique: true
    age: { type: Number, required: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)
