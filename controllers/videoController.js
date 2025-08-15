import Video from "../models/video.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const toggleLike = async (req, res) => {
  console.log("📌 toggleLike called with params:", req.params);
  console.log("📌 Authenticated user:", req.user);
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ error: "Video not found"});

    const alreadyLiked = video.likes.some(
      (likeUserId) => likeUserId.toString() === userId
    );

    if (alreadyLiked) {
      console.log("📌 Removing like");
      video.likes = video.likes.filter((likeUserId) => likeUserId.toString() !== userId);
    } else {
      console.log("📌 Adding like");
      video.likes.push(req.user._id);
    }

    await video.save();
    res.json({ likesCount: video.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    video.comments.push({user: userId, text});
    await video.save();

    res.json({ comment: video.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadVideo = async (req, res) => {
  
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
    const { className, subject } = req.query;

    const filter = {};
    if (className) filter.className = className;
    if (subject) filter.subject = { $regex: subject, $options: "i" };

    const videos = await Video.find(filter).sort({ createdAt: -1});
    res.status(200).json(videos);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};