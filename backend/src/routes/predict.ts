import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { predictImage } from '../controllers/predictController';

const router = Router();

// POST /api/predict - Predict image (placeholder)
router.post('/', authenticateToken, predictImage);

export default router;
