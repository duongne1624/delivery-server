import { Injectable } from '@nestjs/common';
import { cloudinary } from './file-upload.provider';

@Injectable()
export class FileUploadService {
  async uploadImageToCloudinary(
    file: Express.Multer.File
  ): Promise<{ secure_url: string; public_id: string }> {
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'delivery' },
          (error, result) => {
            if (error) {
              reject(new Error(error.message || 'Cloudinary upload failed'));
            } else if (!result || !result.secure_url || !result.public_id) {
              reject(new Error('Incomplete upload result from Cloudinary'));
            } else {
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
            }
          }
        );

        uploadStream.end(file.buffer);
      }
    );

    return result;
  }

  async deleteImageFromCloudinary(publicId: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      cloudinary.uploader.destroy(publicId, (error, result) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (error) return reject(new Error(error.message));
        if (result.result !== 'ok' && result.result !== 'not found') {
          return reject(new Error(`Failed to delete image: ${result.result}`));
        }
        resolve();
      });
    });
  }
}
