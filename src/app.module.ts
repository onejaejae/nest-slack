import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middlewares/logger.middlware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

// middleware들은 cosumer에다가 연결
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // routes 전체에다가 LoggerMiddleware 적용
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
