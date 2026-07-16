import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PROJECT_TYPE_LABELS } from '../../config/projects.config';
import { Project } from '../../models/project.model';
import { ProjectAvatarComponent } from './project-avatar.component';
import { ProjectStatusBadgeComponent } from './project-status-badge.component';
import { ProjectTypeBadgeComponent } from './project-type-badge.component';

@Component({
  selector: 'app-proj-card',
  imports: [
    RouterLink,
    ProjectAvatarComponent,
    ProjectStatusBadgeComponent,
    ProjectTypeBadgeComponent,
  ],
  template: `
    <article class="proj-card">
      <a class="proj-card__link" [routerLink]="['/builder-portal/projects', project().id]">
        <div class="proj-card__header">
          <app-proj-avatar [name]="project().name" [thumbnailUrl]="project().logoUrl ?? project().thumbnailUrl" />
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
          <app-proj-type-badge [projectType]="project().projectType" />
        </div>

        <div class="proj-card__footer">
          <span>{{ typeLabel }}</span>
          <span>{{ project().expectedCompletionDate || 'TBD' }}</span>
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

  get typeLabel(): string {
    return PROJECT_TYPE_LABELS[this.project().projectType] ?? this.project().projectType;
  }

  onFavoriteClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteToggle.emit();
  }
}
