import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiOkResponseDTO } from '@shared/dto';

export const ApiSuccessResponse = <T extends Type<unknown>>(
  model: T,
  status: HttpStatus = HttpStatus.OK,
  description?: string,
) => {
  return applyDecorators(
    ApiExtraModels(ApiOkResponseDTO, model),
    ApiResponse({
      status: status,
      description: description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiOkResponseDTO) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};
