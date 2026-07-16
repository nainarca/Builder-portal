import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { BuilderBrandingRepository } from '../repositories/builder-branding.repository';
import { InMemoryBuilderBrandingRepository } from '../repositories/in-memory-builder-branding.repository';

export function provideBuilderBranding(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: BuilderBrandingRepository, useExisting: InMemoryBuilderBrandingRepository },
  ]);
}
