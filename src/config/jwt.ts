import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      global: true,
      secret: configService.get<string>('auth.jwtSecret'),
      signOptions: { expiresIn: '3h' },
    };
  },
};
