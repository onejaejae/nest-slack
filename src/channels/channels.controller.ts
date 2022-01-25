import { Controller } from '@nestjs/common';

@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  @Get()
  getAllChnnels() {}

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
