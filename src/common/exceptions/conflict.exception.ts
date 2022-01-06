import { HttpException } from "./http.exception";

export class ConflictException extends HttpException {
  constructor(message: string = '이미 존재하는 자원입니다.') {
    super(409, message);
  }
}