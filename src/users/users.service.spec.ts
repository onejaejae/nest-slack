import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { UsersService } from './users.service';

class MockUserRepository {
  // private 문법 = #
  #data = [{ id: 1, email: 'yoteamo7@naver.com' }];

  findOne({ where: { email } }) {
    const data = this.#data.find((v) => v.email === email);

    if (data) {
      return data;
    }
    return null;
  }
}
class MockChannelMembersRepository {}
class MockWorkspaceMembersRepository {}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // 실제 db를 쓰지 않아야 하므로
      // 레파지토리를 mocking 처리한다.
      // 아래와 같이 설정을 하면 usersRepository 의존성 주입 부분에
      // MockUserRepository가 들어간다.
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: MockUserRepository,
        },
        {
          provide: getRepositoryToken(WorkspaceMembers),
          useClass: MockWorkspaceMembersRepository,
        },
        {
          provide: getRepositoryToken(ChannelMembers),
          useClass: MockChannelMembersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // return 값이 promise인 함수를 테스트하므로 resolves를 붙혀 테스트를 진행
  it('findByEmail은 이메일을 통해 유저를 찾아야함.', () => {
    expect(service.findByEmail('yoteamo7@naver.com')).resolves.toStrictEqual({
      email: 'yoteamo7@naver.com',
      id: 1,
    });
  });

  it('findByEmail은 유저를 못 찾으면 null을 반환해야함', () => {
    expect(service.findByEmail('yoteamo7@naverr.com')).toStrictEqual(null);
  });
});
