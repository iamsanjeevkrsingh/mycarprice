import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user-dto';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'asdf' } as User]),
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'test@gmail.com',
          password: 'asdf',
        } as User),
      update: (id: number, attrs: Partial<User>) =>
        Promise.resolve({ id, email: 'test@gmail.com', ...attrs } as User),
      remove: (id: number) =>
        Promise.resolve({ id, email: 'test@gmail.com' } as User),
    };
    fakeAuthService = {
      signup: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('test@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@gmail.com');
  });

  it('find user throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it('should update user', async () => {
    const user = await controller.updateUser('1', {
      email: 'test2@gmail.com',
    } as UpdateUserDto);
    expect(user.email).toEqual('test2@gmail.com');
  });

  it('should delete user', async () => {
    const user = await controller.removeUser('1');
    expect(user.id).toEqual(1);
  });

  it('should signin a user', async () => {
    const session = {};
    const user = await controller.signin(
      { email: 'test@gmail.com', password: 'asdf' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session['userId']).toEqual(1);
  });

  it('should signout a user', () => {
    const session = {};
    controller.signout(session);
    expect(session['userId']).toBeNull();
  });

  it('should create a user', async () => {
    const session = {};
    const user = await controller.createUser(
      { email: 'test@gmail.com', password: 'asdf' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session['userId']).toEqual(1);
  });
});
