import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@ApiExcludeController()
@Controller()
export class HealthController {
  constructor(
    @InjectPinoLogger(HealthController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Get('health')
  public async health() {
    this.logger.info({ user_id: 1 }, 'may check body');
    return true;
  }
}
