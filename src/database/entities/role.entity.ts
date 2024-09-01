import { PermissionsList } from 'src/constants/permissions';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  [PermissionsList.GET_ALL_USERS]: boolean;

  @Column()
  [PermissionsList.GET_USER]: boolean;

  @Column()
  [PermissionsList.EDIT_USER]: boolean;

  @Column()
  [PermissionsList.UPDATE_USER]: boolean;

  @Column()
  [PermissionsList.DELETE_USER]: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];
}
