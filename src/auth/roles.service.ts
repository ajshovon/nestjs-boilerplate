import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/database/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  // async createRole(
  //   name: string,
  //   permissionNames: string[],
  // ): Promise<RoleEntity> {
  //   const permissions = await this.permissionRepository.findOneBy({
  //     name: permissionNames,
  //   });

  //   const role = this.roleRepository.create({ name, permissions });
  //   return this.roleRepository.save(role);
  // }

  async getRole(name: string): Promise<RoleEntity> {
    return this.roleRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });
  }
}
