import { UserService } from '@modules/users/services/service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Пользователи')
@ApiParam({
  name: 'user_id',
  type: String,
  description: 'ID пользователя',
  required: true,
  example: 1,
})
@Controller({
  version: '1',
  path: 'users/:user_id',
})
export class UserIDControllerV1 {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Проверка подключенного пользователя' })
  @Get()
  public async getUserById(@Param('user_id') userId: string) {
    return this.userService.getUserByID(userId);
  }
}
