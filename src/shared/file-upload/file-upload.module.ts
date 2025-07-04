import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileUploadService } from './file-upload.service';
import { AppConfig } from '@config/app.config';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: AppConfig.fileUpload.uploadPath,
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: AppConfig.fileUpload.maxSize,
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = AppConfig.fileUpload.allowedMimeTypes;
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type'), false);
        }
      },
    }),
  ],
  providers: [FileUploadService],
  exports: [FileUploadService, MulterModule],
})
export class FileUploadModule {}
