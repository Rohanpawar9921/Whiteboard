import { Response } from 'express';
import { AuthenticatedRequest, PredictionRequest } from '../types';
import mlService from '../services/mlService';

export const predictImage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // Check if file was uploaded
    if (req.file) {
      // File upload - forward buffer to ML server
      const prediction = await mlService.predictImageFromBuffer(
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname
      );
      res.status(200).json(prediction);
      return;
    }

    // Otherwise, check for imageUrl in body
    // Only destructure if req.body exists and is not empty
    if (req.body && typeof req.body === 'object') {
      const { imageUrl } = req.body as PredictionRequest;
      
      if (imageUrl) {
        // URL-based prediction
        const prediction = await mlService.predictImage(imageUrl);
        res.status(200).json(prediction);
        return;
      }
    }

    // Neither file nor imageUrl provided
    res.status(400).json({ error: 'Either image file or imageUrl is required' });
  } catch (error) {
    console.error('Prediction error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to predict image';
    res.status(500).json({ error: errorMessage });
  }
};
