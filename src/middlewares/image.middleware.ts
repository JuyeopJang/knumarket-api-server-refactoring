import { Request, Response, NextFunction } from 'express';
import { ServerException } from '../common/exceptions';
import { upload } from '../lib/multer-s3';

export const isImageExist = (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
        next();
    } else {
        next(new ServerException('이미지 업로드에 실패했습니다.'));
    }
}