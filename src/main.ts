import { HttpExceptionFilter } from './http-Exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT;

  // useGlobalFilters로 등록하면
  // 앞으로 컨트롤러에서 발생하는 httpexception을 걸러준다
  app.useGlobalFilters(new HttpExceptionFilter());

  // 이것을 설정해두면 class-validator가 붙은 dto가 있으면
  // 알아서 검증까지 해준다.
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const options = new DocumentBuilder()
    .setTitle('Sleact API')
    .setDescription('Sleact 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  console.log(`Listening on port ${PORT}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
