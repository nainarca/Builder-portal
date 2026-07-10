import { Injectable } from '@angular/core';

import { createUuid } from '../uuid.utils';

@Injectable({ providedIn: 'root' })
export class IdGeneratorService {
  uuid(): string {
    return createUuid();
  }

  shortId(prefix = 'mpa'): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
