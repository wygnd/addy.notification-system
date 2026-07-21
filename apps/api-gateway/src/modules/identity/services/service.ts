import { Injectable } from '@nestjs/common';
import { IdentityProvider } from '@modules/identity/providers/provider';

@Injectable()
export class IdentityService {
  constructor(private readonly identityProvider: IdentityProvider) {}
}
