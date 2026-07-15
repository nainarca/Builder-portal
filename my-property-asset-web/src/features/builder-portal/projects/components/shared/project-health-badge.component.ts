import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { ProjectHealth } from '../../models/project.model';

@Component({
  selector: 'app-proj-health-badge',
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [label]="label()" [severity]="severity()" [icon]="icon()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectHealthBadgeComponent {
  readonly health = input.required<ProjectHealth>();

  readonly label = computed(() => {
    const map: Record<ProjectHealth, string> = {
      'on-track': 'On track',
      'at-risk': 'At risk',
      delayed: 'Delayed',
    };
    return map[this.health()];
  });

  readonly severity = computed(() => {
    const map: Record<ProjectHealth, 'success' | 'warn' | 'danger'> = {
      'on-track': 'success',
      'at-risk': 'warn',
      delayed: 'danger',
    };
    return map[this.health()];
  });

  readonly icon = computed(() => {
    const map: Record<ProjectHealth, string> = {
      'on-track': 'pi pi-heart-fill',
      'at-risk': 'pi pi-exclamation-triangle',
      delayed: 'pi pi-clock',
    };
    return map[this.health()];
  });
}
