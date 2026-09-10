import { PlatformEnum } from '@addy/common';
import {
  UpdateUserRequestDTO,
  UserDisconnectQueryRequestDTO,
  UserGetByIdResponseDTO,
} from '@modules/users/dtos';
import { UserDisconnectResponseDto } from '@modules/users/dtos/[id]/disconnect/response/dto';
import { UserService } from '@modules/users/services/service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  ApiBadResponse,
  ApiErrorResponseExample,
  ApiSuccessResponse,
} from '@shared/decorators';
import { ApiUserNotFoundDTO } from '@shared/dto';
import { ParsePlatformPipe } from '@shared/pipes';

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

  @ApiOperation({ summary: 'Получить информацию о пользователе' })
  @ApiSuccessResponse(UserGetByIdResponseDTO, HttpStatus.OK, 'Успешный ответ')
  @Get()
  public async getUserById(
    @Param('user_id', new ParseIntPipe()) userId: number,
  ) {
    return this.userService.getUserBuId(userId);
  }

  @ApiOperation({ summary: 'Отключить пользователя от площадки' })
  @ApiSuccessResponse(
    UserDisconnectResponseDto,
    HttpStatus.OK,
    'Пользователь успешно отключен',
  )
  @Delete()
  public async disconnectUser(
    @Param('user_id', new ParseIntPipe()) userId: number,
    @Query() query: UserDisconnectQueryRequestDTO,
  ): Promise<UserDisconnectResponseDto> {
    return this.userService.disconnectUser(userId, query);
  }

  @ApiOperation({ summary: 'Обновить пользователя' })
  @Patch(':platform')
  public async updateUser(
    @Param('user_id', new ParseIntPipe()) userId: number,
    @Param('platform', new ParsePlatformPipe()) platform: PlatformEnum,
    @Body() body: UpdateUserRequestDTO,
  ) {
    return this.userService.updateUser({
      userId: userId,
      platform: platform,
      fields: body,
    });
  }
}
