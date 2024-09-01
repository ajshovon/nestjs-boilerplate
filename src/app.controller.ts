import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Hello')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Get Hello Message' })
  @ApiResponse({ status: 200, description: 'Returns a "Hello World!" message' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
