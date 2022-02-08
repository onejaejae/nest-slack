import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middlewares/logger.middlware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import * as ormconfig from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    EventsModule,
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
