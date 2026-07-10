import { Injectable } from '@angular/core';

import { FeatureFlagDefinition } from '../models/feature-flag.model';

@Injectable({ providedIn: 'root' })
export class FeatureFlagRegistry {
  private readonly flags = new Map<string, FeatureFlagDefinition>();

  register(definition: FeatureFlagDefinition): void {
    this.flags.set(definition.key, definition);
  }

  registerMany(definitions: FeatureFlagDefinition[]): void {
    definitions.forEach((definition) => this.register(definition));
  }

  get(key: string): FeatureFlagDefinition | undefined {
    return this.flags.get(key);
  }

  list(): FeatureFlagDefinition[] {
    return [...this.flags.values()];
  }
}
