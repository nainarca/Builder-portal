import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DocumentVersion } from '../../models/document.model';
import { VersionBadgeComponent } from '../shared/version-badge.component';

@Component({
  selector: 'app-version-history-list',
  imports: [DatePipe, VersionBadgeComponent],
  template: `
    <div class="version-history-list">
      @for (version of versions(); track version.id) {
        <article class="version-history-item">
          <div>
            <app-version-badge [versionNumber]="version.versionNumber" />
            <p class="version-history-item__meta">{{ version.fileName }} · {{ version.fileSizeLabel }}</p>
            <p class="version-history-item__meta">Uploaded by {{ version.uploadedBy }} on {{ version.uploadedAt | date: 'medium' }}</p>
            @if (version.notes) {
              <p class="version-history-item__notes">{{ version.notes }}</p>
            }
          </div>
        </article>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionHistoryListComponent {
  readonly versions = input.required<readonly DocumentVersion[]>();
}
