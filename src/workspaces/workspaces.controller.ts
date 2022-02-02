import { LoggedInGuard } from './../auth/logged-in.guard';
import { WorkspacesService } from './workspaces.service';
import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateWorkspaceDto } from './dto/create.workspace.dto';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  getMyWorkspaces(@User() user: Users) {
    // param, query는 기본적으로 string이다.
    // string -> number
    // 1. parseint
    // 2. string 앞에 +를 붙임
    // 가장 좋은 것은 처음부터 number로 바꿔주는 것
    // 이럴 때 parseIntPipe를 사용할 수 있다
    return this.workspacesService.getMyWorkspaces(user.id);
  }

  @UseGuards(new LoggedInGuard())
  @Post()
  createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(
      body.workspace,
      body.url,
      user.id,
    );
  }

  // 변수명 길게 짓는 것이 좋은 습관
  @Get(':url/members')
  getAllMembersFromWorkspace() {}

  @Post(':url/members')
  inviteMembersToWorkspace() {}

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {}

  @Get(':url/members/:id')
  getMemberInfoInWorkspace() {}
}
