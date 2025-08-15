import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  className: { type: String, required: true },
  subject: { type: String, required: true },
  videoUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  comments: [commentSchema],
});

export default mongoose.model('Video', videoSchema);
