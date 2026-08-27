import {
  UserConnectRequestDTO,
  UserConnectResponseDTO,
} from '@modules/users/dtos';
import { UserMapper } from '@modules/users/mappers';
import { UserService } from '@modules/users/services/service';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '@shared/decorators';

@ApiTags('Пользователи')
@Controller({
  version: '1',
  path: 'users',
})
export class UserControllerV1 {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Подключение пользователя' })
  @ApiSuccessResponse(
    UserConnectResponseDTO,
    HttpStatus.CREATED,
    'Успешный ответ',
  )
  @Post('connect')
  public async connectUser(@Body() body: UserConnectRequestDTO) {
    return this.userService.connectUser(UserMapper.toDomainModel(body));
  }
}
