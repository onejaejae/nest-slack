import { Workspaces } from './../entities/Workspaces';
import { Channels } from './../entities/Channels';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { ChannelChats } from 'src/entities/ChannelChats';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<Channels>,
    @InjectRepository(Workspaces)
    private workspaceRepository: Repository<Channels>,
    @InjectRepository(ChannelChats)
    private channelChatsRepository: Repository<Channels>,
    @InjectRepository(Users) private usersRepository: Repository<Channels>,
  ) {}

  async findById(id: number) {
    return this.channelsRepository.findOne({ where: { id } });
  }

  async getWorkspaceChannels(url: string, myId: number) {
    const channel = this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoinAndSelect(
        'channels.ChannelMembers',
        'channelMembers',
        'channelMembers.userId = :myId',
        { myId },
      )
      .innerJoinAndSelect(
        'channels.Workspace',
        'workspace',
        'workspace.url =:url',
        { url },
      )
      .getMany();

    console.log(channel);
    return channel;
  }
}
