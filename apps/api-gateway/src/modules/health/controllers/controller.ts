import { HealthService } from '@modules/health/services';
import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from '@shared/decorators';

@ApiExcludeController()
@Controller()
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Public()
  @Get('health')
  public async health() {
    return this.service.health();
  }
}
