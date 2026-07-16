import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ContentCardComponent, ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { PROJECT_STATUS_LABELS, PROJECT_TYPE_LABELS } from '../../config/projects.config';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-proj-overview',
  imports: [ContentSectionComponent, SectionHeaderComponent, ContentCardComponent],
  template: `
    <div class="proj-overview">
      <div class="proj-stats">
        @for (stat of stats(); track stat.label) {
          <div class="proj-stats__card">
            <i class="proj-stats__icon" [class]="stat.icon" aria-hidden="true"></i>
            <p class="proj-stats__label">{{ stat.label }}</p>
            <p class="proj-stats__value">{{ stat.value }}</p>
          </div>
        }
      </div>

      <div class="proj-overview__grid">
        <div class="proj-info-panel">
          <h3 class="proj-info-panel__title">Project information</h3>
          <dl class="proj-info-panel__list">
            @for (item of profileItems(); track item.label) {
              <div class="proj-info-panel__row">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            }
          </dl>
        </div>
        <app-content-section>
          <app-section-header title="Builder information" description="Organization details for this project" />
          <app-content-card icon="building">
            <p class="proj-overview__org-name">{{ project().organizationName }}</p>
            <p class="mpa-body-md m-0">
              Full builder/organization profile is managed in Organization settings.
            </p>
          </app-content-card>
        </app-content-section>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewComponent {
  readonly project = input.required<Project>();

  readonly stats = computed(() => {
    const p = this.project();
    return [
      {
        label: 'Status',
        value: PROJECT_STATUS_LABELS[p.status] ?? p.status,
        icon: 'pi pi-flag',
      },
      {
        label: 'Type',
        value: PROJECT_TYPE_LABELS[p.projectType] ?? p.projectType,
        icon: 'pi pi-building',
      },
      {
        label: 'City',
        value: p.location.city || '—',
        icon: 'pi pi-map-marker',
      },
      {
        label: 'Expected completion',
        value: p.expectedCompletionDate || '—',
        icon: 'pi pi-calendar',
      },
    ];
  });

  readonly profileItems = computed(() => {
    const project = this.project();
    const coords =
      project.location.latitude != null && project.location.longitude != null
        ? `${project.location.latitude}, ${project.location.longitude}`
        : '—';
    return [
      { label: 'Description', value: project.description ?? '—' },
      { label: 'Launch date', value: project.launchDate ?? '—' },
      { label: 'Expected completion', value: project.expectedCompletionDate ?? '—' },
      { label: 'Address', value: project.location.addressLine || '—' },
      { label: 'Pincode', value: project.location.postalCode || '—' },
      { label: 'Coordinates', value: coords },
    ];
  });
}
