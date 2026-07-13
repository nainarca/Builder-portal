import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { BuilderAdminStatus } from '../../models/builder-admin.model';

@Component({
  selector: 'app-bldr-status-badge',
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [label]="label()" [severity]="severity()" [icon]="icon()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderStatusBadgeComponent {
  readonly status = input.required<BuilderAdminStatus>();

  readonly label = computed(() => ({ active: 'Active', pending: 'Pending', inactive: 'Inactive', archived: 'Archived' })[this.status()]);
  readonly severity = computed(() => ({ active: 'success', pending: 'warn', inactive: 'secondary', archived: 'danger' } as const)[this.status()]);
  readonly icon = computed(() => ({ active: 'pi pi-check-circle', pending: 'pi pi-clock', inactive: 'pi pi-minus-circle', archived: 'pi pi-archive' })[this.status()]);
}
