import { ApiProperty } from '@nestjs/swagger';

export class UserDisconnectResponseDto {
  @ApiProperty({
    type: Number,
    description: 'ID пользователя',
  })
  user_id: number;

  @ApiProperty({
    type: String,
    description: 'Текст результата',
  })
  message: string;
}
