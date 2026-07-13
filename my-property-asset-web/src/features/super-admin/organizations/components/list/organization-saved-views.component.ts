import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { OrganizationSavedView } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-saved-views',
  template: `
    <label class="org-saved-views">
      <span class="org-saved-views__label">Saved view</span>
      <select [value]="selectedId()" (change)="onChange($event)">
        @for (view of views(); track view.id) {
          <option [value]="view.id">{{ view.name }}</option>
        }
      </select>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationSavedViewsComponent {
  readonly views = input.required<readonly OrganizationSavedView[]>();
  readonly selectedId = input('all');

  readonly viewChange = output<string>();

  onChange(event: Event): void {
    this.viewChange.emit((event.target as HTMLSelectElement).value);
  }
}
