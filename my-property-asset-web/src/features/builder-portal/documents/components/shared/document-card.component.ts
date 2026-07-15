import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocumentRecord } from '../../models/document.model';
import { categoryLabel, fileTypeIcon } from '../../utils/file-type.util';
import { ApprovalBadgeComponent } from './approval-badge.component';
import { DocumentBadgeComponent } from './document-badge.component';
import { VersionBadgeComponent } from './version-badge.component';

@Component({
  selector: 'app-document-card',
  imports: [RouterLink, DatePipe, DocumentBadgeComponent, ApprovalBadgeComponent, VersionBadgeComponent],
  template: `
    <article class="doc-card">
      <a class="doc-card__link" [routerLink]="['/builder-portal/documents', document().id]">
        <div class="doc-card__header">
          <span class="doc-icon"><i [class]="icon()" aria-hidden="true"></i></span>
          <div class="doc-card__title-group">
            <p class="doc-card__name" [attr.title]="document().name">{{ document().name }}</p>
            <p class="doc-card__meta">{{ document().projectName }}{{ document().unitNumber ? ' · ' + document().unitNumber : '' }}</p>
          </div>
        </div>

        <div class="doc-card__badges">
          <app-document-badge [label]="category()" />
          <app-approval-badge [status]="document().approvalStatus" />
          <app-version-badge [versionNumber]="currentVersionNumber()" />
        </div>

        <div class="doc-card__footer">
          <span class="visibility-chip" [class]="'visibility-chip--' + document().visibility">
            {{ document().visibility === 'owner-visible' ? 'Owner visible' : 'Internal' }}
          </span>
          <span>{{ document().updatedAt | date: 'mediumDate' }}</span>
        </div>
      </a>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCardComponent {
  readonly document = input.required<DocumentRecord>();

  readonly icon = computed(() => fileTypeIcon(this.document().fileType));
  readonly category = computed(() => categoryLabel(this.document().category, this.document().customCategoryLabel));
  readonly currentVersionNumber = computed(() => this.document().versions[0]?.versionNumber ?? 1);
}
