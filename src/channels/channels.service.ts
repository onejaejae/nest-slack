import { Workspaces } from './../entities/Workspaces';
import { Channels } from './../entities/Channels';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { ChannelChats } from 'src/entities/ChannelChats';
import { Users } from 'src/entities/Users';
import { MoreThan, Repository } from 'typeorm';

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
      // filter 1) 내가 들어있는 채널
      .innerJoinAndSelect(
        'channels.ChannelMembers',
        'channelMembers',
        'channelMembers.userId = :myId',
        { myId },
      )
      // filter 2) 내가 들어있는 채널 중 해당 url
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

  async getWorkspaceChannel(url: string, name: string) {
    const channel = this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoin('channels.Workspace', 'workspace', 'workspace.url =:url', {
        url,
      })
      .where('channels.name=:name', { name })
      .getOne();

    console.log(channel);
    return channel;
  }

  async createWorkspaceChannel(url: string, name: string, myId: number) {
    // 해당 워크스페이스 찾기
    const workspace = await this.workspaceRepository.findOne({
      where: { url },
    });

    // 새로운 채널 생성
    const channel = new Channels();
    channel.name = name;
    channel.WorkspaceId = workspace.id;
    const channelReturned = await this.channelsRepository.save(channel);

    // 새로운 채널에 유저 정보 넣기
    const channelMember = new ChannelMembers();
    channelMember.ChannelId = channelReturned.id;
    channelMember.UserId = myId;
    await this.channelMembersRepository.save(channelMember);
  }

  // 채널에 멤버들 가져오기
  async getWorkspaceChannelMembers(url: string, name: string) {
    const user = this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.Channels', 'channels', 'channels.name =:name', {
        name,
      })
      .innerJoin('channels.Workspace', 'workspace', 'workspace.url=:url', {
        url,
      })
      .getMany();

    return user;
  }

  async createWorkspaceChannelMembers(
    url: string,
    name: string,
    email: string,
  ) {
    // 해당 채널 가져오기
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();

    if (!channel) {
      throw new NotFoundException('채널이 존재하지 않습니다.');
    }

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .innerJoin('user.Workspaces', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getOne();

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    const channelMember = new ChannelMembers();
    channelMember.ChannelId = channel.id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  // 해당 채널의 채팅 내역 가져오기
  async getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    return (
      this.channelChatsRepository
        .createQueryBuilder('channelChats')
        .innerJoin('channelChats.Channel', 'channel', 'channel.name=:name', {
          name,
        })
        .innerJoin('channel.Workspace', 'workspace', 'workspace.url=:url', {
          url,
        })
        .innerJoinAndSelect('channelChats.User', 'user')
        .orderBy('channelChats.createAt', 'DESC')
        // take는 limit과 같은 역할
        .take(perPage)
        .skip(perPage * (page - 1))
        .getMany()
    );
  }

  // 채널에서 내가 아직 읽지 않은 메시지들
  // 개수 보여주는 API
  async getChannelUnreadsCount(url, name, after) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url=:url', {
        url,
      })
      .where('channel.name=:name', { name })
      .getOne();

    // count = COUNT(*)
    return this.channelChatsRepository.count({
      // More than => createdAt > '2020-02-06'
      where: { channelId: channel.id, createdAt: MoreThan(new Date(after)) },
    });
  }

  async postChat({ url, name, content, myId }) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url=:url', {
        url,
      })
      .where('channel.name=:name', { name })
      .getOne();

    if (!channel) {
      throw new NotFoundException('채널이 존재하지 않습니다.');
    }

    const chats = new ChannelChats();
    chats.ChannelId = channel.id;
    chats.UserId = myId;
    chats.content = content;
    const saveChats = await this.channelChatsRepository.save(chats);

    const chatWithUser = await this.channelChatsRepository.findOne({
      where: { id: saveChats.id },
      relations: ['User', 'Channel'],
    });

    console.log('asd');
    return chatWithUser;
  }
}
