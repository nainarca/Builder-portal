import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { BuilderBuildingRepository } from '../repositories/builder-building.repository';
import { InMemoryBuilderBuildingRepository } from '../repositories/in-memory-builder-building.repository';

/** P9 — bind Building repository at application root. */
export function provideBuilderBuildings(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: BuilderBuildingRepository, useExisting: InMemoryBuilderBuildingRepository },
  ]);
}
