import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ApplicationConfigurationService } from '../../config';

@Injectable({ providedIn: 'root' })
export class DocumentTitleService {
  private readonly title = inject(Title);
  private readonly configuration = inject(ApplicationConfigurationService);

  setTitle(pageTitle?: string): void {
    const appTitle = this.configuration.appTitle();
    this.title.setTitle(pageTitle ? `${pageTitle} · ${appTitle}` : appTitle);
  }

  reset(): void {
    this.title.setTitle(this.configuration.appTitle());
  }
}
