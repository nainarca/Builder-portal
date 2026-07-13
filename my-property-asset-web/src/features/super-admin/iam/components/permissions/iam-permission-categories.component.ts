import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { PermissionCategory } from '../../models/permission-admin.model';

@Component({
  selector: 'app-iam-permission-categories',
  template: `
    <div class="iam-perm-categories" role="tablist" aria-label="Permission categories">
      <button type="button" class="iam-perm-categories__chip"
        [class.iam-perm-categories__chip--active]="!selected()"
        (click)="selectedChange.emit('')">All</button>
      @for (c of categories(); track c.id) {
        <button type="button" class="iam-perm-categories__chip"
          [class.iam-perm-categories__chip--active]="selected() === c.id"
          (click)="selectedChange.emit(c.id)">{{ c.label }}</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamPermissionCategoriesComponent {
  readonly categories = input.required<readonly PermissionCategory[]>();
  readonly selected = input('');
  readonly selectedChange = output<string>();
}
