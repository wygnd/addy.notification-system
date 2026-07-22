import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '@modules/users/services/service';
import { UserConnectRequestDTO } from '@modules/users/dtos';

@ApiTags('Users')
@Controller({
  version: '1',
  path: 'users',
})
export class UserControllerV1 {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Отправить запрос на подключение пользователя' })
  @Post('connect')
  public async connectUser(@Body() body: UserConnectRequestDTO) {
    // return this.userService.connectUser({
    //   userId: body.user_id,
    //   platform: body.platform,
    // });
  }
}
