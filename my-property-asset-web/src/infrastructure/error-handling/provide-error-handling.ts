import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ErrorHandler } from '@angular/core';

import { GlobalErrorHandler } from './handlers/global-error.handler';

export function provideErrorHandling(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ]);
}
