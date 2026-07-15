import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocumentRecord } from '../../models/document.model';
import { categoryLabel } from '../../utils/file-type.util';

@Component({
  selector: 'app-document-overview',
  imports: [RouterLink],
  template: `
    <div class="doc-overview__grid">
      <div class="doc-info-panel">
        <h3 class="doc-info-panel__title">Document information</h3>
        <dl class="doc-info-panel__list">
          @for (item of infoItems(); track item.label) {
            <div class="doc-info-panel__row">
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          }
        </dl>
      </div>

      <div class="doc-info-panel">
        <h3 class="doc-info-panel__title">Project &amp; unit</h3>
        <dl class="doc-info-panel__list">
          <div class="doc-info-panel__row">
            <dt>Project</dt>
            <dd><a [routerLink]="['/builder-portal/projects', document().projectId]">{{ document().projectName }}</a></dd>
          </div>
          @if (document().unitId) {
            <div class="doc-info-panel__row">
              <dt>Unit</dt>
              <dd><a [routerLink]="['/builder-portal/projects', document().projectId, 'units', document().unitId]">{{ document().unitNumber }}</a></dd>
            </div>
          } @else {
            <div class="doc-info-panel__row"><dt>Unit</dt><dd>Project-level document</dd></div>
          }
          <div class="doc-info-panel__row"><dt>Visibility</dt><dd>{{ document().visibility === 'owner-visible' ? 'Owner visible' : 'Internal only' }}</dd></div>
        </dl>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentOverviewComponent {
  readonly document = input.required<DocumentRecord>();

  readonly infoItems = computed(() => {
    const d = this.document();
    const current = d.versions[0];
    return [
      { label: 'Category', value: categoryLabel(d.category, d.customCategoryLabel) },
      { label: 'Current file', value: current?.fileName ?? '—' },
      { label: 'File size', value: current?.fileSizeLabel ?? '—' },
      { label: 'Total versions', value: String(d.versions.length) },
    ];
  });
}
