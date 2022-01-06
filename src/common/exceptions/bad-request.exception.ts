import { Result, ValidationError } from 'express-validator';
import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {

  constructor(errors?: any) {
    super(400, '잘못된 요청입니다.');
    this.errors = errors;
  }
}