import { ChannelChats } from 'src/entities/ChannelChats';
import { PickType } from '@nestjs/swagger';

export class postChatDto extends PickType(ChannelChats, ['content'] as const) {}
