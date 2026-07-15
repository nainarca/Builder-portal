import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Project } from '../../models/project.model';
import { ProjectAvatarComponent } from './project-avatar.component';
import { ProjectHealthBadgeComponent } from './project-health-badge.component';
import { ProjectStatusBadgeComponent } from './project-status-badge.component';

@Component({
  selector: 'app-proj-card',
  imports: [RouterLink, ProjectAvatarComponent, ProjectStatusBadgeComponent, ProjectHealthBadgeComponent],
  template: `
    <article class="proj-card">
      <a class="proj-card__link" [routerLink]="['/builder-portal/projects', project().id]">
        <div class="proj-card__header">
          <app-proj-avatar [name]="project().name" [thumbnailUrl]="project().thumbnailUrl" />
          <div class="proj-card__title-group">
            <p class="proj-card__name">{{ project().name }}</p>
            <p class="proj-card__meta">{{ project().code }} · {{ project().location.city }}</p>
          </div>
          <button
            type="button"
            class="proj-card__favorite"
            [class.proj-card__favorite--active]="favorite()"
            [attr.aria-label]="favorite() ? 'Remove from favorites' : 'Add to favorites'"
            (click)="onFavoriteClick($event)"
          >
            <i class="pi" [class.pi-star-fill]="favorite()" [class.pi-star]="!favorite()" aria-hidden="true"></i>
          </button>
        </div>

        <div class="proj-card__badges">
          <app-proj-status-badge [status]="project().status" />
          <app-proj-health-badge [health]="project().health" />
        </div>

        <div class="proj-card__bar" role="progressbar" [attr.aria-valuenow]="project().progress" aria-valuemin="0" aria-valuemax="100">
          <div class="proj-card__bar-fill" [style.width.%]="project().progress"></div>
        </div>

        <div class="proj-card__footer">
          <span>{{ project().progress }}% complete</span>
          <span>{{ project().summary.unitsSold }}/{{ project().summary.unitsTotal }} units</span>
        </div>
      </a>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();
  readonly favorite = input(false);

  readonly favoriteToggle = output<void>();

  onFavoriteClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteToggle.emit();
  }
}
