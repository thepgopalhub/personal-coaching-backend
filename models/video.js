import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: String,
  className: String,
  subject: String,
  videoUrl: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Video', videoSchema);
