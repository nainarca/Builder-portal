import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Project } from '../../models/project.model';
import { ProjectCardComponent } from '../shared/project-card.component';
import { ProjectEmptyStateComponent } from '../shared/project-empty-state.component';

@Component({
  selector: 'app-proj-card-grid',
  imports: [ProjectCardComponent, ProjectEmptyStateComponent],
  template: `
    @if (items().length === 0) {
      <app-proj-empty-state
        title="No projects match your filters"
        subtitle="Try adjusting your search or filters."
        [actionLabel]="undefined"
      />
    } @else {
      <div class="proj-card-grid">
        @for (project of items(); track project.id) {
          <app-proj-card
            [project]="project"
            [favorite]="isFavorite(project.id)"
            (favoriteToggle)="favoriteToggle.emit(project.id)"
          />
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardGridComponent {
  readonly items = input.required<readonly Project[]>();
  readonly favoriteIds = input<readonly string[]>([]);

  readonly favoriteToggle = output<string>();

  isFavorite(id: string): boolean {
    return this.favoriteIds().includes(id);
  }
}
