import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.create(body.email, body.password);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    console.log(id);
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: CreateUserDto) {
    console.log(id, body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    console.log(id);
  }
}
