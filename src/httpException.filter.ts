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
      | string
      | { error: string; statusCode: 400; message: string[] };

    console.log(status, err);
    response.status(status).json({ msg: err });

    // // let msg = '';
    // if (typeof err !== 'string' && err.error === 'Bad Request') {
    //   return response.status(status).json({
    //     success: false,
    //     code: status,
    //     data: err.message,
    //   });
    // }
  }
}
