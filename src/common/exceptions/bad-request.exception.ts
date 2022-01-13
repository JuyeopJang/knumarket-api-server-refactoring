import { Result, ValidationError } from 'express-validator';
import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {

  constructor(errors?: any) {
    if (typeof errors === 'string') {
      super(400, errors);
    } else {
      super(400, '잘못된 요청입니다.');
      this.errors = errors;
    }
  }
}