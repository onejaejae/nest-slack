import { ChannelsService } from './channels.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  getAllChnnels(@Param('url') url: string, @User() user: Users) {
    return this.channelsService.getWorkspaceChannels(url, user.id);
  }

  @Get(':name/chats')
  getChats(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

  @Get(':name/members')
  getAllMembers() {}

  @Get(':name')
  getSpecificChannel() {}

  @Post()
  createChannel(@Body() body) {}

  @Post(':name/chats')
  postChat(@Body() body) {}

  @Post(':name/members')
  inviteMembers() {}
}
