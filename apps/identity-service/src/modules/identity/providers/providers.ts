import { IDENTITY_REPOSITORY } from '@modules/identity/constants/constants';
import { IdentityRepository } from '@modules/identity/repositories/repository';
import { IdentityAddCommandHandler } from '@modules/identity/commands';
import { IdentityService } from '@modules/identity/services/service';
import { IdentityExistsQueryHandler } from '@modules/identity/queries/exists/handler';

export const identityProviders = [
  // SERVICES
  IdentityService,

  // REPOSITORIES
  {
    provide: IDENTITY_REPOSITORY,
    useClass: IdentityRepository,
  },

  // COMMAND HANDLERS
  IdentityAddCommandHandler,

  // QUERY HANDLERS
  IdentityExistsQueryHandler,
];
