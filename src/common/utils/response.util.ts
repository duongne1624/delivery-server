export class ResponseUtil {
  static success<T>(data: T, message = 'Success', meta?: any) {
    return {
      success: true,
      data,
      message,
      meta,
    };
  }

  static error(message: string, errors?: any[]) {
    return {
      success: false,
      message,
      errors,
    };
  }

  static paginated<T>(data: T[], meta: any, message = 'Success') {
    return {
      success: true,
      data,
      message,
      meta,
    };
  }
}
