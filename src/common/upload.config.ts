// common/upload.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export const productImageStorage = diskStorage({
  destination: './uploads/products', // carpeta local
  filename: (_req, file, cb) => {
    const uniqueName = uuid() + extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const imageFileFilter = (_req, file, cb) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    cb(new Error('Solo se permiten imágenes JPG/PNG'), false);
  } else {
    cb(null, true);
  }
};
