import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocumentRecord } from '../../models/document.model';
import { fileTypeIcon } from '../../utils/file-type.util';
import { ApprovalBadgeComponent } from './approval-badge.component';

@Component({
  selector: 'app-document-tile',
  imports: [RouterLink, ApprovalBadgeComponent],
  template: `
    <a class="doc-tile" [routerLink]="['/builder-portal/documents', document().id]">
      <span class="doc-icon doc-icon--sm"><i [class]="icon()" aria-hidden="true"></i></span>
      <div class="doc-tile__title-group">
        <p class="doc-tile__name">{{ document().name }}</p>
        <p class="doc-tile__meta">{{ document().projectName }}{{ document().unitNumber ? ' · ' + document().unitNumber : '' }}</p>
      </div>
      <app-approval-badge [status]="document().approvalStatus" />
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTileComponent {
  readonly document = input.required<DocumentRecord>();

  readonly icon = computed(() => fileTypeIcon(this.document().fileType));
}
