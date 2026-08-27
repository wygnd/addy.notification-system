import {
  UserConnectRequestDTO,
  UserConnectResponseDTO,
} from '@modules/users/dtos';
import { UserMapper } from '@modules/users/mappers';
import { UserService } from '@modules/users/services/service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Пользователи')
@Controller({
  version: '1',
  path: 'users',
})
export class UserControllerV1 {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Подключение пользователя' })
  @ApiOkResponse({
    type: UserConnectResponseDTO,
    description: 'Успешный ответ',
  })
  @Post('connect')
  public async connectUser(@Body() body: UserConnectRequestDTO) {
    return this.userService.connectUser(UserMapper.toDomainModel(body));
  }
}
