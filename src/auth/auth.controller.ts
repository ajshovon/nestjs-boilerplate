import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';

import { CreateUserDto } from 'src/resources/users/dto/create-user.dto';
import { Payload } from 'src/types/payload';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtRtAuthGuard } from './guards/jwt-rt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './guards/publicRoutes';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  login(@Body() signInDto: SignInDto) {
    return this.authService.login(signInDto.email, signInDto.password);
  }

  @Public()
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@User() user: Payload) {
    return user;
  }

  @Public()
  @ApiBearerAuth()
  @UseGuards(JwtRtAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refresh(req.user);
  }
}
