import { PlatformEnum } from '@addy/common';
import { UserConnectRequestDTO } from '@modules/users/dtos';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'hasVkId', async: false })
class HasVkIdConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean {
    const object = validationArguments?.object as UserConnectRequestDTO;

    if (object.platform === PlatformEnum.VK) {
      return (
        (typeof value === 'string' && value.length > 0) ||
        (typeof value === 'number' && value > 0)
      );
    }

    return value === undefined;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const object = validationArguments?.object as UserConnectRequestDTO;

    if (object.platform === PlatformEnum.VK) {
      return `${validationArguments?.property} is required for ${PlatformEnum.VK} platform`;
    }

    return `${validationArguments?.property} must not be present unless platform is ${PlatformEnum.VK}}`;
  }
}

export function HasVkId(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) =>
    registerDecorator({
      name: 'HasVkId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: HasVkIdConstraint,
    });
}
