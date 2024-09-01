import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import config from 'src/config';

import { RoleEntity } from 'src/database/entities/role.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { CreateUserDto } from 'src/resources/users/dto/create-user.dto';
import { UsersService } from 'src/resources/users/users.service';
import { Payload } from 'src/types/payload';
import { Repository } from 'typeorm';

const EXPIRE_TIME = 3 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email is taken!');
    } else {
      const hashRounds = config().auth.hashRounds;
      const hash = await bcrypt.hash(createUserDto.password, hashRounds);

      const userRole = await this.rolesRepository.findOneBy({
        name: 'User',
      });
      const hashCreateUserDto = {
        ...createUserDto,
        hash: hash,
        roles: [userRole],
      };
      const userData = await this.usersRepository.create(hashCreateUserDto);
      this.usersRepository.save(userData);
      return { status: 'ok', message: 'New User Registered' };
    }
  }

  async login(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User Does Not Exist With This Email!');
    } else {
      const validPassword = await bcrypt.compare(pass, user.hash);
      if (!validPassword) {
        throw new UnauthorizedException('Password did not match!');
      }
      const payload = { sub: user.id, email: user.email };
      return {
        profile: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        tokens: {
          accessToken: this.jwtService.sign(payload),
          refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
          expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
        },
      };
    }
  }

  async refresh(user: Payload) {
    const payload = { sub: user.userId, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }
}
