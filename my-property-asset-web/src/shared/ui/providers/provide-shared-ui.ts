import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

export function provideSharedUi(): EnvironmentProviders {
  return makeEnvironmentProviders([MessageService, ConfirmationService]);
}
