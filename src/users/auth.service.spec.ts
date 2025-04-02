import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //Create a fake copy of the users service
    // fakeUsersService = {
    //   find: () => Promise.resolve([]),
    //   create: (email: string, password: string) =>
    //     Promise.resolve({ id: 1, email, password } as User),
    // };

    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@gmail.com', 'asasasa');
    expect(user.password).not.toEqual('asasasa');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'test@gmail.com' } as User]);
    await expect(service.signup('test@gmail.com', 'asasasa')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if signin is called with an unused email', async () => {
    fakeUsersService.find = () => Promise.resolve([]);
    await expect(service.signin('test@gmail.com', 'asasasa')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws an error if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'test@gmail.com', password: 'asasasa' } as User,
      ]);
    await expect(service.signin('test@gmail.com', 'asasasa')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          email: 'test@gmail.com',
          password:
            'f0618339e409b8e0.6e869359b73566026a0940d76b708f43c879dddcaf05eca12a1254befadb224a',
        } as User,
      ]);
    const user = await service.signin('test@gmail.com', 'asasasa');
    expect(user).toBeDefined();
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('test@gmail.com', 'asasasa');
    const user = await service.signin('test@gmail.com', 'asasasa');
    expect(user).toBeDefined();
  });
});
