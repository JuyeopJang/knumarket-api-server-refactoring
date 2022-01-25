import { HttpException } from "./http.exception";

export class NotFoundException extends HttpException {
  constructor(message: string = '존재하지 않는 자원입니다.') {
    super(404, message);
  }
}