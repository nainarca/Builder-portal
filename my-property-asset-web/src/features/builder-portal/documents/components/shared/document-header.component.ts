import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonComponent } from '@shared/ui';

import { DocumentRecord } from '../../models/document.model';
import { categoryLabel, fileTypeIcon } from '../../utils/file-type.util';
import { ApprovalBadgeComponent } from './approval-badge.component';
import { DocumentBadgeComponent } from './document-badge.component';
import { VersionBadgeComponent } from './version-badge.component';

@Component({
  selector: 'app-document-header',
  imports: [ButtonComponent, DocumentBadgeComponent, ApprovalBadgeComponent, VersionBadgeComponent],
  template: `
    <header class="doc-header">
      <div class="doc-header__main">
        <span class="doc-icon doc-icon--lg"><i [class]="icon()" aria-hidden="true"></i></span>
        <div>
          <span class="mpa-eyebrow">{{ document().projectName }}{{ document().unitNumber ? ' · ' + document().unitNumber : '' }}</span>
          <h1 class="ui-page-title">{{ document().name }}</h1>
          <p class="ui-page-subtitle">{{ document().versions[0]?.fileName }} · {{ document().versions[0]?.fileSizeLabel }}</p>
          <div class="doc-header__badges">
            <app-document-badge [label]="category()" />
            <app-approval-badge [status]="document().approvalStatus" />
            <app-version-badge [versionNumber]="currentVersionNumber()" />
          </div>
        </div>
      </div>
      <div class="doc-header__actions">
        <app-button label="Back to documents" icon="pi pi-arrow-left" [outlined]="true" (clicked)="goToList()" />
        <app-button label="Version history" icon="pi pi-history" [outlined]="true" (clicked)="goToHistory()" />
        <ng-content />
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHeaderComponent {
  private readonly router = inject(Router);

  readonly document = input.required<DocumentRecord>();

  readonly icon = computed(() => fileTypeIcon(this.document().fileType));
  readonly category = computed(() => categoryLabel(this.document().category, this.document().customCategoryLabel));
  readonly currentVersionNumber = computed(() => this.document().versions[0]?.versionNumber ?? 1);

  goToList(): void {
    void this.router.navigate(['/builder-portal/documents']);
  }

  goToHistory(): void {
    void this.router.navigate(['/builder-portal/documents', this.document().id, 'history']);
  }
}
