import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiErrorResponseDTO, ApiOkResponseDTO } from '@shared/dto';

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

export const ApiErrorResponseExample = (
  status: HttpStatus = HttpStatus.BAD_REQUEST,
  apiDescription: string = 'Пример ошибки',
) => {
  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDTO),
    ApiResponse({
      status: status,
      description: apiDescription,
      schema: {
        allOf: [{ $ref: getSchemaPath(ApiErrorResponseDTO) }],
      },
    }),
  );
};

export const ApiBadResponse = <T extends Type<unknown>>(
  model: T,
  status: HttpStatus,
  description?: string,
) => {
  return applyDecorators(
    ApiResponse({
      status: status,
      description: description,
      schema: {
        allOf: [{ $ref: getSchemaPath(model) }],
      },
    }),
  );
};
