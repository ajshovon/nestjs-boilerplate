import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { PermissionsList } from 'src/constants/permissions';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Maintainer',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  [PermissionsList.GET_ALL_USERS]: boolean;

  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  [PermissionsList.GET_USER]: boolean;

  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  [PermissionsList.EDIT_USER]: boolean;

  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  [PermissionsList.DELETE_USER]: boolean;

  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  [PermissionsList.UPDATE_USER]: boolean;
}
