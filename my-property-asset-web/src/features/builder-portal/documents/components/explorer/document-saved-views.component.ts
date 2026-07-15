import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { SelectComponent, SelectOption } from '@shared/ui';

import { DocumentSavedView } from '../../models/document.model';

@Component({
  selector: 'app-document-saved-views',
  imports: [SelectComponent],
  template: `
    <div class="doc-saved-views">
      <span class="doc-saved-views__label">Saved view</span>
      <app-select [options]="options()" [value]="selectedId()" ariaLabel="Saved view" (valueChange)="viewChange.emit($event)" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentSavedViewsComponent {
  readonly views = input.required<readonly DocumentSavedView[]>();
  readonly selectedId = input('all');

  readonly viewChange = output<string>();

  readonly options = computed<readonly SelectOption[]>(() =>
    this.views().map((view) => ({ label: view.name, value: view.id })),
  );
}
