import { Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';
import cloudinary from './cloudinary.config';

@Injectable()
export class StorageService {
  private driver = process.env.STORAGE_DRIVER || 'local';

  async upload(file: Express.Multer.File): Promise<string> {
    if (this.driver === 'cloudinary') {
      const res = await cloudinary.uploader.upload(file.path, {
        folder: 'products',
      });

      await unlink(file.path).catch(() => {});

      return res.secure_url; // URL final
    }

    // Local → guardamos el filename
    return file.filename;
  }

  async delete(pathOrUrl: string) {
    if (this.driver === 'cloudinary') {
      try {
        // Extraer el public_id de la URL
        const parts = pathOrUrl.split('/');
        const filename = parts[parts.length - 1].split('.')[0];
        await cloudinary.uploader.destroy(`products/${filename}`);
      } catch (e) {
        console.error('Error deleting Cloudinary file:', e.message);
      }
      return;
    }

    // Local
    try {
      // await unlink(join(process.cwd(), 'uploads/products', pathOrUrl));
      // const localPath = join(process.cwd(), pathOrUrl);
      const localPath = join(process.cwd(), 'uploads', 'products', pathOrUrl);
      await unlink(localPath);
    } catch (e) {
      console.error('Error deleting local file:', e.message);
    }
  }
}
