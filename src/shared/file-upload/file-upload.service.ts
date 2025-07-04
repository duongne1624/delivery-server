import { Injectable } from '@nestjs/common';
import { AppConfig } from '@config/app.config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  async saveFile(file: Express.Multer.File): Promise<string> {
    // In production, you would upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
    // For now, we'll just return the local file path
    return `/uploads/${file.filename}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(originalName);
    return `${timestamp}_${randomString}${extension}`;
  }

  validateFile(file: Express.Multer.File): boolean {
    const allowedMimes = AppConfig.fileUpload.allowedMimeTypes;
    const maxSize = AppConfig.fileUpload.maxSize;

    return allowedMimes.includes(file.mimetype) && file.size <= maxSize;
  }

  async saveMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    const savedFiles: string[] = [];

    for (const file of files) {
      if (this.validateFile(file)) {
        const savedPath = await this.saveFile(file);
        savedFiles.push(savedPath);
      }
    }

    return savedFiles;
  }
}
