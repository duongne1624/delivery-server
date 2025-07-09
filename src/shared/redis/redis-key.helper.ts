export class RedisKey {
  static otp(phone: string): string {
    return `otp:${phone}`;
  }

  static assignment(shipperId: string): string {
    return `assignment:${shipperId}`;
  }

  static notification(userId: string): string {
    return `notification:${userId}`;
  }

  static orderLock(orderId: string): string {
    return `lock:order:${orderId}`;
  }
}
