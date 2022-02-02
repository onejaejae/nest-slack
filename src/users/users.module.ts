import { ChannelMembers } from './../entities/ChannelMembers';
import { WorkspaceMembers } from './../entities/WorkspaceMembers';
import { Users } from './../entities/Users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, WorkspaceMembers, ChannelMembers]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
