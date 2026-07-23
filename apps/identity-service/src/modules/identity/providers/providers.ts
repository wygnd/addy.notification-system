import { IDENTITY_REPOSITORY } from '@modules/identity/constants/constants';
import { IdentityRepository } from '@modules/identity/repositories/repository';

export const identityProviders = [
  {
    provide: IDENTITY_REPOSITORY,
    useClass: IdentityRepository,
  },

  // todo
];
