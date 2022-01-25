import { UsersService } from './users.service';
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { JoinRequestDto } from './dto/join.request.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(@Req() req: Request) {
    return req.user;
  }

  @Post()
  PostUsers(@Body() data: JoinRequestDto) {
    this.usersService.postUsers(data.email, data.nickname, data.password);
  }

  @Post('login')
  logIn() {
    return req.user;
  }

  // 웬만하면 controller도 req, res에 대해 모르는 것이 좋다
  // service에서는 당연히 몰라야한다.
  // 로그아웃은 어쩔 수 없다
  @Post('logout')
  logOut(@Req() req: Request, @Res() res: Response) {
    req.logOut();
    res.clearCookie('connect-sid', { httpOnly: true });
    res.send('ok');
  }
}
