import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import {
  InMemoryPlatformAuditRepository,
  InMemorySupportTicketRepository,
} from '../repositories/in-memory-platform.repository';
import { PlatformAuditRepository, SupportTicketRepository } from '../repositories/platform.repository';

export function provideSuperAdminPlatform(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: PlatformAuditRepository, useExisting: InMemoryPlatformAuditRepository },
    { provide: SupportTicketRepository, useExisting: InMemorySupportTicketRepository },
  ]);
}
