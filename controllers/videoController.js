import Video from "../models/video.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadVideo = async (req, res) => {
  console.log("📥 Hit uploadVideo route");
  try {
    const { title, className, subject } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No video file provided or upload failed" });
    }

    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "lms_videos", 
    });

    const newVideo = new Video({
      title,
      className,
      subject,
      videoUrl: cloudinaryResult.secure_url,
    });

    await newVideo.save();

    res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: err.message || "Unknown server error" });
  }
};


export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};