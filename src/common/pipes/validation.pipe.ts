/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessages = errors.map((error) =>
        Object.values(error.constraints || {}).join(', ')
      );
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
