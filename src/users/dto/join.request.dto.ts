import { Users } from './../../entities/Users';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class JoinRequestDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {}
