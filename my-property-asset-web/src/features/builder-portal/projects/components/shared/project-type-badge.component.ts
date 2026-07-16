import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { ProjectType } from '../../models/project.model';
import { PROJECT_TYPE_LABELS } from '../../config/projects.config';

@Component({
  selector: 'app-proj-type-badge',
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [label]="label()" severity="secondary" icon="pi pi-building" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectTypeBadgeComponent {
  readonly projectType = input.required<ProjectType>();

  readonly label = computed(() => PROJECT_TYPE_LABELS[this.projectType()] ?? this.projectType());
}
