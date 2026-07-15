import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { ProjectStatus } from '../../../models/dashboard.model';

@Component({
  selector: 'app-proj-status-badge',
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [label]="label()" [severity]="severity()" [icon]="icon()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectStatusBadgeComponent {
  readonly status = input.required<ProjectStatus>();

  readonly label = computed(() => {
    const map: Record<ProjectStatus, string> = {
      planning: 'Planning',
      'in-progress': 'In progress',
      handover: 'Handover',
      completed: 'Completed',
    };
    return map[this.status()];
  });

  readonly severity = computed(() => {
    const map: Record<ProjectStatus, 'success' | 'warn' | 'danger' | 'info' | 'secondary'> = {
      planning: 'secondary',
      'in-progress': 'info',
      handover: 'warn',
      completed: 'success',
    };
    return map[this.status()];
  });

  readonly icon = computed(() => {
    const map: Record<ProjectStatus, string> = {
      planning: 'pi pi-map',
      'in-progress': 'pi pi-hammer',
      handover: 'pi pi-key',
      completed: 'pi pi-check-circle',
    };
    return map[this.status()];
  });
}
