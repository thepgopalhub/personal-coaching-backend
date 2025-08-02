import express from 'express';
import upload from '../middlewares/multer.js';
import { uploadVideo, getVideos } from '../controllers/videoController.js';
import cloudinary from '../utils/cloudinary.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

router.post("/upload", isAdmin, upload.single("video"), uploadVideo); 
router.get("/", getVideos);

router.get('/test-cloudinary', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
