import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { CommunicationRepository } from '../repositories/communication.repository';
import { InMemoryCommunicationRepository } from '../repositories/in-memory-communication.repository';

export function provideBuilderCommunications(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: CommunicationRepository, useExisting: InMemoryCommunicationRepository },
  ]);
}
