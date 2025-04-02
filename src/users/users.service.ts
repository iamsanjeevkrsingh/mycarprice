import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(email: string, password: string) {
    // create an instance of the user entity
    const user = this.userRepository.create({ email, password });
    // save the user to the database
    return this.userRepository.save(user);

    //if you call save, hooks will not trigger
    // return this.userRepository.save({ email, password });
    // return this.userRepository.insert({ email, password });
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    // return this.userRepository.findOne({ where: { id } });
    return this.userRepository.findOneBy({ id });
  }

  find(email: string) {
    return this.userRepository.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.userRepository.save(user);
    // return this.userRepository.update(id, attrs);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    console.log('ssss', user);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.userRepository.remove(user);
  }
}

// insert, update and delte will not trigger hooks
// save and remove will trigger hooks
