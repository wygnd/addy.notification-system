import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class HealthController {
  constructor() {}

  @Get('health')
  public async health() {
    return true;
  }
}
