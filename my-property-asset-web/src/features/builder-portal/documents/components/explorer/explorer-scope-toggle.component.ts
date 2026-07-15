import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DocumentExplorerScope } from '../../models/document.model';

@Component({
  selector: 'app-explorer-scope-toggle',
  template: `
    <div class="explorer-toolbar__scope" role="group" aria-label="Browse by">
      @for (option of options; track option.value) {
        <button
          type="button"
          class="explorer-toolbar__scope-btn"
          [class.explorer-toolbar__scope-btn--active]="scope() === option.value"
          [attr.aria-pressed]="scope() === option.value"
          (click)="scopeChange.emit(option.value)"
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerScopeToggleComponent {
  readonly scope = input.required<DocumentExplorerScope>();

  readonly scopeChange = output<DocumentExplorerScope>();

  readonly options: readonly { label: string; value: DocumentExplorerScope }[] = [
    { label: 'All', value: 'all' },
    { label: 'By project', value: 'project' },
    { label: 'By unit', value: 'unit' },
    { label: 'By category', value: 'category' },
  ];
}
