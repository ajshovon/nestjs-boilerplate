import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'email@example.com',
    description: 'Sign in Email Address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'secret',
    description: 'User Password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
