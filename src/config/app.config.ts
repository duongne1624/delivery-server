import { BadRequestException } from '@nestjs/common';

// Class quản lý cấu hình
export class AppConfig {
  // Validate các trường bắt buộc
  private static validateRequiredFields(
    config: any,
    provider: string,
    fields: string[]
  ): void {
    fields.forEach((field) => {
      if (!config[field]) {
        throw new BadRequestException(
          `Missing required config: ${provider}.${field}`
        );
      }
    });
  }

  // Port
  static get port(): number {
    return parseInt(process.env.PORT ?? '3000', 10);
  }

  // Môi trường
  static get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  static get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  static get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  static get isSandbox(): boolean {
    return this.nodeEnv === 'sandbox';
  }

  // CORS
  static get cors() {
    return {
      origins: process.env.CORS_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'http://localhost:3001',
      ],
    };
  }

  // JWT
  static get jwt() {
    const config = {
      secret: process.env.JWT_SECRET || 'your-super-secret-key',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    };
    this.validateRequiredFields(config, 'jwt', ['secret', 'expiresIn']);
    return config;
  }

  // Database
  static get database() {
    const config = {
      host: process.env.DB_HOST || '',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME || '',
      password: process.env.DB_PASSWORD || '',
      name: process.env.DB_NAME || '',
    };
    this.validateRequiredFields(config, 'database', [
      'host',
      'username',
      'password',
      'name',
    ]);
    return config;
  }

  // Redis
  static get redis() {
    const config = {
      url: process.env.REDIS_URL || '',
      host: process.env.REDIS_HOST || '',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      password: process.env.REDIS_PASSWORD || '',
      db: process.env.REDIS_DB || '',
      ttl: parseInt(process.env.REDIS_TTL ?? '300', 10),
    };
    this.validateRequiredFields(config, 'redis', [
      'url',
      'host',
      'password',
      'db',
    ]);
    return config;
  }

  // MongoDB
  static get mongo() {
    const config = {
      uri: process.env.MONGO_URI || '',
      dbName: process.env.MONGO_DB_NAME || '',
    };
    this.validateRequiredFields(config, 'mongo', ['uri', 'dbName']);
    return config;
  }

  // Cloudinary
  static get cloudinary() {
    const config = {
      name: process.env.CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    };
    this.validateRequiredFields(config, 'cloudinary', [
      'name',
      'apiKey',
      'apiSecret',
    ]);
    return config;
  }

  // Email
  static get email() {
    const config = {
      user: process.env.EMAIL_USER || '',
      password: process.env.EMAIL_PASSWORD || '',
    };
    this.validateRequiredFields(config, 'email', ['user', 'password']);
    return config;
  }

  // File Upload
  static get fileUpload() {
    return {
      maxSize: parseInt(process.env.MAX_FILE_SIZE ?? `${10 * 1024 * 1024}`, 10),
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
      uploadPath: process.env.UPLOAD_PATH || './uploads',
    };
  }

  // Bcrypt
  static get bcrypt() {
    return {
      saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    };
  }

  static get paymentReturnUrl(): string {
    const returnUrl =
      process.env.PAYMENT_RETURN_URL ||
      'https://your-return-url.com/payments/verify';
    if (!returnUrl) {
      throw new BadRequestException(
        'Missing required config: paymentReturnUrl'
      );
    }
    return returnUrl;
  }

  // VNPay
  static get vnpay() {
    const config = {
      VNP_TMNCODE: process.env.VNP_TMNCODE || '',
      VNP_HASHSECRET: process.env.VNP_HASHSECRET || '',
      VNP_URL: this.isProduction
        ? process.env.VNP_URL || 'https://pay.vnpay.vn/vpcpay.html'
        : process.env.VNP_URL ||
          'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      VNP_RETURN_URL: this.paymentReturnUrl,
    };
    this.validateRequiredFields(config, 'vnpay', [
      'VNP_TMNCODE',
      'VNP_HASHSECRET',
      'VNP_URL',
      'VNP_RETURN_URL',
    ]);
    return config;
  }

  // Momo
  static get momo() {
    const config = {
      MOMO_PARTNER_CODE: process.env.MOMO_PARTNER_CODE || '',
      MOMO_ACCESS_KEY: process.env.MOMO_ACCESS_KEY || '',
      MOMO_SECRET_KEY: process.env.MOMO_SECRET_KEY || '',
      MOMO_RETURN_URL: this.paymentReturnUrl,
      MOMO_REQUEST_URL: this.isProduction
        ? process.env.MOMO_REQUEST_URL ||
          'https://payment.momo.vn/v2/gateway/api/create'
        : process.env.MOMO_REQUEST_URL ||
          'https://test-payment.momo.vn/v2/gateway/api/create',
    };
    this.validateRequiredFields(config, 'momo', [
      'MOMO_PARTNER_CODE',
      'MOMO_ACCESS_KEY',
      'MOMO_SECRET_KEY',
      'MOMO_RETURN_URL',
      'MOMO_REQUEST_URL',
    ]);
    return config;
  }

  // ZaloPay
  static get zalopay() {
    const config = {
      ZALOPAY_APP_ID: process.env.ZALOPAY_APP_ID || '',
      ZALOPAY_KEY1: process.env.ZALOPAY_KEY1 || '',
      ZALOPAY_KEY2: process.env.ZALOPAY_KEY2 || '',
      ZALOPAY_RETURN_URL: this.paymentReturnUrl,
      ZALOPAY_REQUEST_URL: this.isProduction
        ? process.env.ZALOPAY_REQUEST_URL || 'https://api.zalopay.vn/v2/create'
        : process.env.ZALOPAY_REQUEST_URL ||
          'https://sandbox.zalopay.vn/v2/create',
    };
    this.validateRequiredFields(config, 'zalopay', [
      'ZALOPAY_APP_ID',
      'ZALOPAY_KEY1',
      'ZALOPAY_KEY2',
      'ZALOPAY_RETURN_URL',
      'ZALOPAY_REQUEST_URL',
    ]);
    return config;
  }
}
