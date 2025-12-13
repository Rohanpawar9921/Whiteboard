import { Router } from 'express';
import uploadRoutes from './upload';
import predictRoutes from './predict';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
router.use('/upload', uploadRoutes);
router.use('/predict', predictRoutes);

export default router;
