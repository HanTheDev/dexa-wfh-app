import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return {
      service: 'auth-service',
      status: 'running',
      port: process.env.PORT || 4001,
    };
  }
}