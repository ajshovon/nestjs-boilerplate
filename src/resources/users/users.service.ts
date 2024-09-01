import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { RoleEntity } from 'src/database/entities/role.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateCatDto } from '../cats/dto/update-cat.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // https://docs.nestjs.com/fundamentals/lifecycle-events
    console.log('Environment:', this.configService.get('env'));
    const count = await this.usersRepository.count();
    if (!count) {
      console.log('Initializing Default User');
      const hashRounds = this.configService.get('auth.hashRounds');
      const hash = await bcrypt.hash(
        this.configService.get('defaultUser.password'),
        hashRounds,
      );

      console.log('Setting Default User As Owner');
      const ownerRole = {
        name: 'Owner',
        getUser: true,
        editUser: true,
        deleteUser: true,
      };
      const ownerRoleData = this.rolesRepository.create(ownerRole);
      await this.rolesRepository.save(ownerRoleData);
      const defaultUser = {
        email: this.configService.get('defaultUser.email'),
        hash: hash,
        isActive: true,
        roles: [ownerRoleData],
      };
      const userData = this.usersRepository.create(defaultUser);
      await this.usersRepository.save(userData);
    }
    console.log('Checking Default User Role...');
    const checkUserRole = await this.rolesRepository.findOneBy({
      name: 'User',
    });
    if (!checkUserRole) {
      const userRole = {
        name: 'User',
        getUser: false,
        editUser: false,
        deleteUser: false,
      };
      const userRoleData = this.rolesRepository.create(userRole);
      await this.rolesRepository.save(userRoleData);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userData = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(userData);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    const userData = await this.usersRepository.findOneBy({ id });
    if (!userData) throw new NotFoundException();
    return userData;
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const userData = await this.usersRepository.findOneBy({ email });
    return userData;
  }

  async update(id: string, updateCatDto: UpdateCatDto) {
    await this.findOne(id);
    const updatedData = await this.usersRepository.save({
      id,
      ...updateCatDto,
    });
    return updatedData;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.usersRepository.delete(id);
    return `Entry with id #${id} removed!`;
  }
}
