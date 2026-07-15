import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DocumentVersion } from '../../models/document.model';
import { VersionBadgeComponent } from '../shared/version-badge.component';

@Component({
  selector: 'app-current-version-card',
  imports: [DatePipe, VersionBadgeComponent],
  template: `
    <div class="version-current-card">
      <div>
        <app-version-badge [versionNumber]="version().versionNumber" />
        <p class="version-current-card__name">{{ version().fileName }}</p>
        <p class="mpa-body-md m-0">{{ version().fileSizeLabel }} · Uploaded by {{ version().uploadedBy }} on {{ version().uploadedAt | date: 'mediumDate' }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentVersionCardComponent {
  readonly version = input.required<DocumentVersion>();
}
