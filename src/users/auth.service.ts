import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    //see if email is in use
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('Sorry, email is already in use');
    }
    // Hash the users password
    // 1. Generate a salt
    const salt = randomBytes(8).toString('hex');
    // 2. Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // 3. Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    // Create a new user and save it
    const user = await this.userService.create(email, result);
    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    //find user with email
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //hash the incoming password
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }

    //if password is correct, then generate a jwt and return it
    // const payload = { id: user.id, email: user.email };
    return user;
  }
}
