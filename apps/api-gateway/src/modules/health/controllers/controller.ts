import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController(){
  "ok": true,
  "data": true,
  "timestamp": 1784554468484
}
@Controller()
export class HealthController {
  @Get('health')
  public async health() {
    return true;
  }
}
