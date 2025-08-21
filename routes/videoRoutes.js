import express from 'express';
import upload from '../middlewares/multer.js';
import { uploadVideo, getVideos, toggleLike, addComment } from '../controllers/videoController.js';
import cloudinary from '../utils/cloudinary.js';
import isAdmin from '../middlewares/isAdmin.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post("/upload", isAdmin, upload.single("video"), uploadVideo); 
router.get("/", auth, getVideos);

router.post("/:id/like", auth, toggleLike);
router.post("/:id/comment", auth, addComment);

router.get('/test-cloudinary', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
