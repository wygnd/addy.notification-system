import { IdentityAddCommandHandler } from '@modules/identity/commands';
import { IdentityUpdateCommandHandler } from '@modules/identity/commands/update/handler';
import { IDENTITY_REPOSITORY } from '@modules/identity/constants/constants';
import {
  IdentityExistsQueryHandler,
  IdentityExitsPlatformQueryHandler,
  IdentityGetClientByExternalIDQueryHandler,
} from '@modules/identity/queries';
import '@modules/identity/queries/exists/handler';
import '@modules/identity/queries/exists/platform/handler';
import { IdentityRepository } from '@modules/identity/repositories/repository';
import { IdentityService } from '@modules/identity/services/service';

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
  IdentityUpdateCommandHandler,

  // QUERY HANDLERS
  IdentityExistsQueryHandler,
  IdentityExitsPlatformQueryHandler,
  IdentityGetClientByExternalIDQueryHandler,
];
