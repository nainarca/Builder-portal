import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DocumentVersion } from '../../models/document.model';

@Component({
  selector: 'app-version-timeline',
  imports: [DatePipe],
  template: `
    <section class="doc-timeline-section" aria-label="Version timeline">
      <h3 class="mpa-heading-sm">Version timeline</h3>
      <ul class="doc-timeline">
        @for (version of versions(); track version.id) {
          <li class="doc-timeline__item">
            <span class="doc-timeline__icon doc-timeline__icon--primary">
              <i class="pi pi-history" aria-hidden="true"></i>
            </span>
            <div>
              <p class="doc-timeline__title">Version {{ version.versionNumber }} uploaded</p>
              <p class="doc-timeline__description">{{ version.fileName }} by {{ version.uploadedBy }}</p>
              <span class="doc-timeline__time">{{ version.uploadedAt | date: 'medium' }}</span>
            </div>
          </li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionTimelineComponent {
  readonly versions = input.required<readonly DocumentVersion[]>();
}
