import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/database/entities/role.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UsersService } from './users.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const data = this.rolesRepository.create(createRoleDto);
    return await this.rolesRepository.save(data);
  }

  async findAllRoles(): Promise<RoleEntity[]> {
    return await this.rolesRepository.find();
  }

  async findOneRole(id: string): Promise<RoleEntity> {
    const data = await this.rolesRepository.findOneBy({ id });
    if (!data) throw new NotFoundException();
    return data;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.findOneRole(id);
    const updatedData = await this.rolesRepository.save({
      id,
      ...updateRoleDto,
    });
    return updatedData;
  }

  async remove(id: string) {
    await this.findOneRole(id);
    await this.rolesRepository.delete(id);
    return `Entry with id #${id} removed!`;
  }

  async assignRole(assignRoleDto: AssignRoleDto) {
    const targetRole = await this.findOneRole(assignRoleDto.roleId);
    const targetUser = await this.usersRepository.findOne({
      where: { id: assignRoleDto.userId },
      relations: ['roles'],
    });
    if (targetUser.roles.find((role) => role.id === targetRole.id)) {
      throw new ConflictException('This role is already assigned!');
    }
    targetUser.roles = [...targetUser.roles, targetRole];
    await this.usersRepository.save(targetUser);
    return { status: 'ok' };
  }

  async revokeRole(revokeRoleDto: AssignRoleDto) {
    const targetRole = await this.findOneRole(revokeRoleDto.roleId);
    const targetUser = await this.usersRepository.findOne({
      where: { id: revokeRoleDto.userId },
      relations: ['roles'],
    });
    const hasRole = targetUser.roles.some((role) => role.id === targetRole.id);
    if (!hasRole) {
      throw new NotFoundException('This user does not have this role');
    }
    targetUser.roles = targetUser.roles.filter(
      (role) => role.id !== targetRole.id,
    );
    await this.usersRepository.save(targetUser);
    return { status: 'ok' };
  }
}
