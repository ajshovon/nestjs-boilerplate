import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatEntity } from '../../database/entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catsRepository: Repository<CatEntity>,
  ) {}
  async create(createCatDto: CreateCatDto): Promise<CatEntity> {
    const catData = this.catsRepository.create(createCatDto);
    return await this.catsRepository.save(catData);
  }

  async findAll(): Promise<CatEntity[]> {
    return await this.catsRepository.find();
  }

  async findOne(id: string): Promise<CatEntity> {
    const catData = await this.catsRepository.findOneBy({ id });
    if (!catData) throw new NotFoundException();
    return catData;
  }

  async update(id: string, updateCatDto: UpdateCatDto) {
    await this.findOne(id);
    const updatedCat = await this.catsRepository.save({
      id,
      ...updateCatDto,
    });
    return updatedCat;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.catsRepository.delete(id);
    return `Cat with id #${id} removed!`;
  }
}
