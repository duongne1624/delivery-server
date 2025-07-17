import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { toZonedTime, format } from 'date-fns-tz';

const TIMEZONE = 'Asia/Ho_Chi_Minh';

@Injectable()
export class TransformDateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transformDates(data)));
  }

  private transformDates(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformDates(item));
    }

    if (typeof obj === 'object') {
      const transformed: Record<string, any> = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];

          if (
            key.toLowerCase().includes('date') ||
            key === 'created_at' ||
            key === 'updated_at'
          ) {
            transformed[key] = this.convertDate(value);
          } else {
            transformed[key] = this.transformDates(value);
          }
        }
      }
      return transformed;
    }

    return obj;
  }

  private convertDate(date: any): any {
    if (typeof date === 'string' || date instanceof Date) {
      try {
        const d = new Date(date);
        const zoned = toZonedTime(d, TIMEZONE);
        return format(zoned, "yyyy-MM-dd'T'HH:mm:ssXXX", {
          timeZone: TIMEZONE,
        });
      } catch {
        return date;
      }
    }
    return date;
  }
}
