import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { UserSavedView } from '../../../models/user-admin.model';

@Component({
  selector: 'app-iam-user-saved-views',
  template: `
    <label class="iam-saved-views">
      <span class="iam-saved-views__label">Saved view</span>
      <select [value]="selectedId()" (change)="onChange($event)">
        @for (v of views(); track v.id) { <option [value]="v.id">{{ v.name }}</option> }
      </select>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserSavedViewsComponent {
  readonly views = input.required<readonly UserSavedView[]>();
  readonly selectedId = input('');
  readonly viewChange = output<string>();

  onChange(e: Event): void { this.viewChange.emit((e.target as HTMLSelectElement).value); }
}
