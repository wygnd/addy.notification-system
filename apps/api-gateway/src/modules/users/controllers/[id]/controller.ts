import {
  UserDisconnectQueryRequestDTO,
  UserGetByIdResponseDTO,
} from '@modules/users/dtos';
import { UserService } from '@modules/users/services/service';
import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  ApiBadResponse,
  ApiErrorResponseExample,
  ApiSuccessResponse,
} from '@shared/decorators';
import { ApiUserNotFoundDTO } from '@shared/dto';

@ApiTags('Пользователи')
@ApiBadResponse(
  ApiUserNotFoundDTO,
  HttpStatus.NOT_FOUND,
  'Пользователь не найден',
)
@ApiErrorResponseExample()
@ApiParam({
  name: 'user_id',
  type: Number,
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
  @ApiSuccessResponse(UserGetByIdResponseDTO, HttpStatus.OK, 'Успешный ответ')
  @Get()
  public async getUserById(
    @Param('user_id', new ParseIntPipe()) userId: number,
  ) {
    return this.userService.getUserByID(userId);
  }

  @ApiOperation({ summary: 'Отключить пользователя от площадки' })
  @Delete()
  public async disconnectUser(
    @Param('user_id', new ParseIntPipe()) userId: number,
    @Query() query: UserDisconnectQueryRequestDTO,
  ) {
    return this.userService.disconnectUser(userId, query);
  }
}
