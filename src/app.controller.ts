import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  indexRoute(): string {
    return 'App is running...';
  }
}
