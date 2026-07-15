import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DocumentRecord } from '../../models/document.model';
import { DocumentCardComponent } from '../shared/document-card.component';
import { DocumentEmptyStateComponent } from '../shared/document-empty-state.component';

@Component({
  selector: 'app-document-grid',
  imports: [DocumentCardComponent, DocumentEmptyStateComponent],
  template: `
    @if (items().length === 0) {
      <app-document-empty-state
        title="No documents match your filters"
        description="Try adjusting your search or filters."
        [actionLabel]="undefined"
      />
    } @else {
      <div class="doc-card-grid">
        @for (doc of items(); track doc.id) {
          <app-document-card [document]="doc" />
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentGridComponent {
  readonly items = input.required<readonly DocumentRecord[]>();
}
