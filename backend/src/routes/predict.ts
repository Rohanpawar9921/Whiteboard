import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth';
import { predictImage } from '../controllers/predictController';

const router = Router();

// Configure multer for in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

// POST /api/predict - Predict image by uploading file or providing URL
router.post('/', authenticateToken, upload.single('image'), predictImage);

export default router;
