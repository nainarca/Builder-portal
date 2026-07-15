import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ContentCardComponent, ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

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

  readonly stats = computed(() => [
    { label: 'Progress', value: `${this.project().progress}%`, icon: 'pi pi-gauge' },
    { label: 'Units sold', value: `${this.project().summary.unitsSold}/${this.project().summary.unitsTotal}`, icon: 'pi pi-building' },
    { label: 'Open snags', value: String(this.project().summary.openSnags), icon: 'pi pi-exclamation-triangle' },
    { label: 'Pending handovers', value: String(this.project().summary.pendingHandovers), icon: 'pi pi-key' },
  ]);

  readonly profileItems = computed(() => {
    const project = this.project();
    return [
      { label: 'Description', value: project.description ?? '—' },
      { label: 'Start date', value: project.startDate },
      { label: 'Target completion', value: project.targetCompletionDate },
      { label: 'Actual completion', value: project.actualCompletionDate ?? '—' },
    ];
  });
}
