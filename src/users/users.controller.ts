import { User } from './../common/decorators/user.decorator';
import { UserDto } from './../common/dto/user.dto';
import { UsersService } from './users.service';
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { JoinRequestDto } from './dto/join.request.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('USER')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserDto, description: '성공' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@User() user) {
    // return req.user;
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  PostUsers(@Body() data: JoinRequestDto) {
    // this.usersService.postUsers(data.email, data.nickname, data.password);
  }

  @ApiOkResponse({ type: UserDto, description: '성공' })
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@User() user) {
    // return req.user;
  }

  // 웬만하면 controller도 req, res에 대해 모르는 것이 좋다
  // service에서는 당연히 몰라야한다.
  // 로그아웃은 어쩔 수 없다
  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut(@Req() req: Request, @Res() res: Response) {
    // req.logOut();
    // res.clearCookie('connect-sid', { httpOnly: true });
    // res.send('ok');
  }
}
