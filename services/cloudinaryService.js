const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary SDK
cloudinary.config({
    cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
    api_key:     process.env.CLOUDINARY_API_KEY,
    api_secret:  process.env.CLOUDINARY_API_SECRET
});

// Use memory storage so we can pipe the buffer directly to Cloudinary
const upload = multer({
    storage: multer.memoryStorage(),
    limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB cap
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'), false);
        }
    }
});

/**
 * Uploads a buffer to Cloudinary and returns the secure URL.
 * @param {Buffer} buffer - The file buffer from multer memoryStorage
 * @param {string} folder - Cloudinary folder path (default: rongo_cms/team)
 * @returns {Promise<string>} Cloudinary secure URL
 */
const uploadToCloudinary = (buffer, folder = 'rongo_cms/team') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};

module.exports = { upload, uploadToCloudinary };
