import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { ProjectStatus } from '../../models/project.model';
import { PROJECT_STATUS_LABELS } from '../../config/projects.config';

@Component({
  selector: 'app-proj-status-badge',
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [label]="label()" [severity]="severity()" [icon]="icon()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectStatusBadgeComponent {
  readonly status = input.required<ProjectStatus>();

  readonly label = computed(() => PROJECT_STATUS_LABELS[this.status()] ?? this.status());

  readonly severity = computed(() => {
    const map: Record<ProjectStatus, 'success' | 'warn' | 'danger' | 'info' | 'secondary'> = {
      upcoming: 'secondary',
      planning: 'info',
      construction: 'warn',
      completed: 'success',
      archived: 'danger',
    };
    return map[this.status()];
  });

  readonly icon = computed(() => {
    const map: Record<ProjectStatus, string> = {
      upcoming: 'pi pi-clock',
      planning: 'pi pi-map',
      construction: 'pi pi-hammer',
      completed: 'pi pi-check-circle',
      archived: 'pi pi-inbox',
    };
    return map[this.status()];
  });
}
