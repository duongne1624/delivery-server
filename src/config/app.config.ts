export class AppConfig {
  static get port(): number {
    return parseInt(process.env.PORT ?? '3000', 10);
  }

  static get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  static get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  static get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  static get jwt() {
    return {
      secret: process.env.JWT_SECRET || 'your-super-secret-key',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    };
  }

  static get cors() {
    return {
      origins: process.env.CORS_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'http://localhost:3001',
      ],
    };
  }

  static get fileUpload() {
    return {
      maxSize: parseInt(process.env.MAX_FILE_SIZE ?? `${10 * 1024 * 1024}`, 10),
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
      uploadPath: process.env.UPLOAD_PATH || './uploads',
    };
  }

  static get bcrypt() {
    return {
      saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    };
  }
}
