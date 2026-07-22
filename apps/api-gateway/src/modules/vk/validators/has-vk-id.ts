import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { UserConnectRequestDTO } from '@modules/users/dtos';
import { PlatformEnum } from '@shared/interfaces';

export function HasVkId(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) =>
    registerDecorator({
      name: 'HasVkId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value, { object }: ValidationArguments) {
          if (
            object instanceof UserConnectRequestDTO &&
            object.platform === PlatformEnum.VK
          ) {
            if (
              !value ||
              typeof value !== 'string'
            ) {
              return false;
            }
          }

          return true;
        },
        defaultMessage: (validationArguments?: ValidationArguments): string =>
          `${validationArguments?.property} should not be an empty for ${PlatformEnum.VK} platform`,
      },
    });
}
