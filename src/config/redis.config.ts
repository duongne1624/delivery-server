export class RedisConfig {
  static get url(): string {
    return process.env.REDIS_URL || 'redis://localhost:6379';
  }

  static get host(): string {
    return process.env.REDIS_HOST || 'localhost';
  }

  static get port(): number {
    return parseInt(process.env.REDIS_PORT || '6379', 10);
  }

  static get password(): string | undefined {
    return process.env.REDIS_PASSWORD;
  }

  static get db(): number {
    return parseInt(process.env.REDIS_DB || '0', 10);
  }

  static get ttl(): number {
    return parseInt(process.env.REDIS_TTL || '300', 10);
  }

  static getConfig() {
    return {
      type: 'single' as const,
      url: this.url,
      options: {
        ...this.getConnectionOptions(),
      },
    };
  }

  static getConnectionOptions() {
    return {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
    };
  }
}
