import { NotLoggedInGuard } from './../auth/not-logged-in.guard';
import { LoggedInGuard } from './../auth/logged-in.guard';
import { User } from './../common/decorators/user.decorator';
import { UserDto } from './../common/dto/user.dto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JoinRequestDto } from './dto/join.request.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { undefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@UseInterceptors(undefinedToNullInterceptor)
@ApiTags('USER')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserDto, description: '성공' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@User() user) {
    return user || false;
  }

  @UseGuards(new NotLoggedInGuard())
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async Join(@Body() data: JoinRequestDto) {
    await this.usersService.join(data.email, data.nickname, data.password);
  }

  @ApiOkResponse({ type: UserDto, description: '성공' })
  @ApiOperation({ summary: '로그인' })
  // Guards의 주요 목적은
  // controller에 접근하기 전에 권한같은 것이 있는지 또는 데이터가 제대로 들어있는지
  // 주요 목적은 권한 체크(권한, 로그인 유무, 보통 401, 403 에러와 관련된 것)이다.
  // Guards는 lifecycle을 보면 interceptor보다 먼저 실행되기 때문에 guard에서 에러가 발생하면
  // interceptor, controller, service 이런 것들이 실행이 안되고 바로 exception filter로 넘어간다.
  // 데이터 체크는 class-validator(pipe)가 대신 할 수 있기 때문이다
  @UseGuards(LocalAuthGuard)
  @Post('login')
  logIn(@User() user) {
    return user;
  }

  // 웬만하면 controller도 req, res에 대해 모르는 것이 좋다
  // service에서는 당연히 몰라야한다.
  // 로그아웃은 어쩔 수 없다
  @UseGuards(new LoggedInGuard())
  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut(@Req() req: Request, @Res() res: Response) {
    // req.logOut();
    // res.clearCookie('connect-sid', { httpOnly: true });
    // res.send('ok');
  }
}
