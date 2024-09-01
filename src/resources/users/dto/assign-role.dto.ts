import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({
    example: '05e6b5fc-c9a5-47c0-8de5-6f4017e11d71',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: '792a7b1a-dab8-4b42-b27a-5a30c1f01733',
  })
  @IsNotEmpty()
  @IsString()
  roleId: string;
}
