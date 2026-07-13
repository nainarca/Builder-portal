import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { BuilderSavedView } from '../../models/builder-admin.model';

@Component({
  selector: 'app-bldr-saved-views',
  template: `
    <label class="bldr-saved-views">
      <span class="bldr-saved-views__label">Saved view</span>
      <select [value]="selectedId()" (change)="onChange($event)">
        @for (v of views(); track v.id) { <option [value]="v.id">{{ v.name }}</option> }
      </select>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderSavedViewsComponent {
  readonly views = input.required<readonly BuilderSavedView[]>();
  readonly selectedId = input('all');
  readonly viewChange = output<string>();
  onChange(e: Event): void { this.viewChange.emit((e.target as HTMLSelectElement).value); }
}
