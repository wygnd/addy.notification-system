import {
  IdentityAddCommandHandler,
  IdentityUpdateCommandHandler,
} from '@modules/identity/commands';
import { IDENTITY_REPOSITORY } from '@modules/identity/constants/constants';
import {
  IdentityExistsQueryHandler,
  IdentityExitsPlatformQueryHandler,
  IdentityGetClientByExternalIDQueryHandler,
  IdentityGetClientByExternalIDsQueryHandler,
  IdentityListQueryHandler,
} from '@modules/identity/queries';
import '@modules/identity/queries/exists/handler';
import '@modules/identity/queries/exists/platform/handler';
import { IdentityRepository } from '@modules/identity/repositories/repository';
import { IdentityService } from '@modules/identity/services/service';
import { IdentityProvider } from './provider';

export const identityProviders = [
  // Providers
  IdentityProvider,

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
  IdentityGetClientByExternalIDsQueryHandler,
  IdentityListQueryHandler,
];
