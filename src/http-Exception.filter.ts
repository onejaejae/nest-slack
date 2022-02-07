// interceptor는 컨트롤러 앞뒤에서 실행되고
// exceptionFilter는 컨트롤러 뒤에서 실행된다.

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // HttpException의 status code 정보가 담겨있다.
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | { message: any; statusCode: number }
      // class-v    alidator
      | { error: string; statusCode: 400; message: string[] };

    console.log(status, err);

    // // let msg = '';
    if (typeof err !== 'string' && err.statusCode === 400) {
      return response.status(status).json({
        success: false,
        code: status,
        data: err.message,
      });
    }

    response.status(status).json({
      success: false,
      code: status,
      data: err.message,
    });
  }
}
