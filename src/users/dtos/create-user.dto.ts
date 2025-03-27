import {
  IsEmail,
  IsString,
  // Matches,
  // MaxLength,
  // MinLength,
} from 'class-validator';

export class CreateUserDto {
  // @IsString()
  @IsEmail()
  email: string;

  @IsString()
  // @MinLength(8)
  // @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message:
  //     'password must contain at least one uppercase letter, one lowercase letter, and one number or special character',
  // })
  password: string;
}
