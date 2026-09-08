import { HealthService } from '@modules/health/services';
import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Get('health')
  public async health() {
    return this.service.health();
  }
}
