import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guards/publicRoutes';
import { CatEntity } from '../../database/entities/cat.entity';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Public()
@Controller('cats')
@ApiTags('Cats Endpoint')
@ApiResponse({ status: 500, description: 'Internal server error' })
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiOperation({ summary: 'Add New Cat' })
  @ApiResponse({ status: 201, description: 'Success', type: CatEntity })
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all cats',
    type: CatEntity,
    isArray: true,
  })
  findAll() {
    return this.catsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one cat' })
  @ApiResponse({
    status: 200,
    description: 'Returns details of a cat',
    type: CatEntity,
  })
  @ApiResponse({ status: 404, description: 'Cat not found' })
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one cat' })
  @ApiResponse({ status: 200, description: 'Returns updated details of a cat' })
  @ApiResponse({ status: 404, description: 'Cat not found' })
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(id, updateCatDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove one cat' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Cat not found' })
  remove(@Param('id') id: string) {
    return this.catsService.remove(id);
  }
}
