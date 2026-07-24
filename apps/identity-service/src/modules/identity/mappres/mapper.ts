import { IdentityDTO } from '@modules/identity/dtos';
import { IdentityModel } from '@modules/identity/models';
import { plainToClass } from 'class-transformer';

export class IdentityMapper {
  public static toDomain(model: IdentityModel): IdentityDTO {
    return plainToClass(IdentityDTO, model, {
      excludeExtraneousValues: true,
    });
  }
}
