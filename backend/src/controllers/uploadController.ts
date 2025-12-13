import { Response } from 'express';
import { AuthenticatedRequest } from '../types';

export const uploadImage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};
