import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const createSwaggerConfig = (config: ConfigService) => {
  const swaggerProps = config.get('swagger');
  return new DocumentBuilder()
    .setTitle(swaggerProps.title)
    .setDescription(swaggerProps.description)
    .setVersion(swaggerProps.version)
    .addBearerAuth()
    .build();
};

const setupSwagger = (app: INestApplication, configService: ConfigService) => {
  const swaggerConfig = createSwaggerConfig(configService);
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(configService.get('swagger.path'), app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};

export { createSwaggerConfig, setupSwagger };
