import { Injectable } from '@nestjs/common';
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

  findOne(id: string) {
    console.log(id);
  }

  find(email: string) {
    console.log(email);
    return this.userRepository.find();
  }

  update(id: string, email: string, password: string) {
    console.log(id, email, password);
  }

  remove(id: string) {
    console.log(id);
  }
}

// insert, update and delte will not trigger hooks
// save and remove will trigger hooks
