const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bootway/resumes', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    public_id: (req, file) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `resume-${uniqueSuffix}`;
    }
  }
});

module.exports = {
  cloudinary,
  storage
};
