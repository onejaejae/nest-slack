import { ChannelsService } from './channels.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { postChatDto } from './dto/post-chat.dto';

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @ApiOperation({ summary: '워크스페이스 채널 모두 가져오기' })
  @Get()
  getAllChnnels(@Param('url') url: string, @User() user: Users) {
    return this.channelsService.getWorkspaceChannels(url, user.id);
  }

  @ApiOperation({ summary: '워크스페이스 특정 채널 가져오기' })
  @Get(':name')
  getSpecificChannel(@Param('url') url: string, @Param('name') name: string) {
    return this.channelsService.getWorkspaceChannel(url, name);
  }

  @ApiOperation({ summary: '워크스페이스 특정 채널 채팅 모두 가져오기' })
  @Get(':name/chats')
  getChats(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

  @ApiOperation({ summary: '워크스페이스 채널 멤버 가져오기' })
  @Get(':name/members')
  getAllMembers(@Param('url') url: string, @Param('name') name: string) {
    return this.channelsService.getWorkspaceChannelMembers(url, name);
  }

  @ApiOperation({ summary: '워크스페이스 특정 채널 채팅 생성하기' })
  @Post()
  createChannel(@Body() body, @Param('url') url: string, @User() user: Users) {
    return this.channelsService.createWorkspaceChannel(url, body.name, user.id);
  }

  @ApiOperation({ summary: '워크스페이스 채널 멤버 초대하기' })
  @Post(':name/members')
  inviteMembers(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body('email') email: string,
  ) {
    return this.channelsService.createWorkspaceChannelMembers(url, name, email);
  }

  @ApiOperation({ summary: '워크스페이스 특정 채널 채팅 생성하기' })
  @Post(':name/chats')
  postChats(
    @Body() body: postChatDto,
    @Param('url') url: string,
    @Param('name') name: string,
    @User() user: Users,
  ) {
    return this.channelsService.postChat({
      url,
      name,
      content: body.content,
      myId: user.id,
    });
  }

  @Post(':name/images')
  postImages(@Body() body) {}
}
