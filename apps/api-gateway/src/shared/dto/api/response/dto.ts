import { ApiProperty } from '@nestjs/swagger';

export class ApiOkResponseDTO<T = unknown> {
  @ApiProperty({
    type: Boolean,
    description: 'Статус ответа',
    example: true,
  })
  ok: true;

  @ApiProperty({
    type: Object,
    description: 'Возвращаемые данные',
  })
  data: T;

  @ApiProperty({
    type: String,
    description: 'Время запроса',
    example: new Date().toISOString(),
  })
  timestamp: string;
}
