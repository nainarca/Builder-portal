import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { BuilderProjectRepository } from '../repositories/builder-project.repository';
import { InMemoryBuilderProjectRepository } from '../repositories/in-memory-builder-project.repository';
import { ProjectService } from '../services/project.service';
import { ProjectStoreService } from '../services/project-store.service';

/** P8 — provide Builder Project repository + services at application root. */
export function provideBuilderProjects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: BuilderProjectRepository, useExisting: InMemoryBuilderProjectRepository },
  ]);
}

/** Re-export for discoverability — services use providedIn: 'root'. */
export const BUILDER_PROJECT_PROVIDERS = [ProjectService, ProjectStoreService] as const;
