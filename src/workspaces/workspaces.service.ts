import { ChannelMembers } from './../entities/ChannelMembers';
import { WorkspaceMembers } from './../entities/WorkspaceMembers';
import { Workspaces } from './../entities/Workspaces';
import { Channels } from './../entities/Channels';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Users } from 'src/entities/Users';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private connection: Connection,
  ) {}

  async findById(id: number) {
    return this.workspacesRepository.findByIds([id]);
  }

  async getMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: {
        WorkspaceMembers: [{ UserId: myId }],
      },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const workspace = this.workspacesRepository.create({
        name,
        url,
        OwnerId: myId,
      });
      const returned = await queryRunner.manager
        .getRepository(Workspaces)
        .save(workspace);

      const workspaceMember = new WorkspaceMembers();
      workspaceMember.UserId = myId;
      workspaceMember.WorkspaceId = returned.id;

      const channel = new Channels();
      channel.WorkspaceId = returned.id;
      channel.name = '일반';

      const [, channelReturned] = await Promise.all([
        queryRunner.manager
          .getRepository(WorkspaceMembers)
          .save(workspaceMember),
        queryRunner.manager.getRepository(Channels).save(channel),
      ]);

      const channelMember = new ChannelMembers();
      channelMember.ChannelId = channelReturned.id;
      channelMember.UserId = myId;
      await queryRunner.manager
        .getRepository(ChannelMembers)
        .save(channelMember);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkspaceMembers(url: string) {
    this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'm')
      // 'w.url = :url', { url } => sql injection 방어
      .innerJoin('m.workspace', 'w', 'w.url = :url', { url })
      .getMany();
  }
}
