const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    getGalleryItems,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem
} = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/api/gallery', getGalleryItems);

router.post('/api/admin/gallery', protect, upload.single('image'), createGalleryItem);
router.put('/api/admin/gallery/:id', protect, upload.single('image'), updateGalleryItem);
router.delete('/api/admin/gallery/:id', protect, deleteGalleryItem);

module.exports = router;
