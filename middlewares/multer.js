import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'learning_app_videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi'],
  },
});

const upload = multer({ storage });

export default upload;
