import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCatDto {
  @ApiProperty({ example: 'Tom', description: 'Cats name' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;

  @ApiProperty({ example: '2', description: "Cat's age (in year)" })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  // @ApiPropertyOptional()
  @ApiProperty({
    required: false,
    example: '/uploads/tom.png',
    description: 'Cats picture path',
  })
  picture: string;
}
