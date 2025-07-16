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

  static get cors() {
    return {
      origins: process.env.CORS_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'http://localhost:3001',
      ],
    };
  }

  static get jwt() {
    return {
      secret: process.env.JWT_SECRET || 'your-super-secret-key',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    };
  }

  static get database() {
    return {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
    };
  }

  static get redis() {
    return {
      url: process.env.REDIS_URL,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB,
      ttl: parseInt(process.env.REDIS_TTL ?? '300', 10),
    };
  }

  static get mongo() {
    return {
      uri: process.env.MONGO_URI,
      dbName: process.env.MONGO_DB_NAME,
    };
  }

  static get cloudinary() {
    return {
      name: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    };
  }

  static get email() {
    return {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
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

  static get vnpay() {
    return {
      VNP_TMNCODE: process.env.VNP_TMNCODE || '',
      VNP_HASHSECRET: process.env.VNP_HASHSECRET || '',
      VNP_URL: process.env.VNP_URL || '',
      VNP_RETURN_URL: process.env.VNP_RETURN_URL || '',
    };
  }
}
