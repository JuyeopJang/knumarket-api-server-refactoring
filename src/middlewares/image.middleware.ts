import { Request, Response, NextFunction } from 'express';
import { upload } from '../lib/multer-s3';

export const uploadImage = (req: Request, res: Response, next: NextFunction) => {
    upload.single('image');
    next();
}