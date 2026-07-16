import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BasePageComponent, PageHeaderComponent } from '@shared/ui';
import { PLATFORM_ANALYTICS_HEADER } from '../config/platform.config';
import { PlatformAnalyticsService } from '../services/platform-analytics.service';
import { PlatformMetricsService } from '../services/platform-metrics.service';

@Component({
  selector: 'app-platform-analytics-page',
  imports: [BasePageComponent, PageHeaderComponent],
  template: `
    <app-base-page>
      <div class="analytics-page">
        <app-page-header
          [eyebrow]="header.eyebrow"
          [title]="header.title"
          [description]="header.description"
        />

        <section class="analytics-page__kpis">
          <article><strong>{{ metrics().totalBuilders }}</strong><span>Builders</span></article>
          <article><strong>{{ metrics().totalProjects }}</strong><span>Projects</span></article>
          <article><strong>{{ metrics().totalActiveOwners }}</strong><span>Owners</span></article>
          <article><strong>{{ model().storageUsageGb }} GB</strong><span>Storage</span></article>
          <article><strong>{{ model().communicationActivity }}</strong><span>Communications</span></article>
          <article><strong>{{ model().systemUsageScore }}</strong><span>System usage</span></article>
        </section>

        <div class="analytics-page__grid">
          <section class="analytics-card">
            <h3>Builder growth</h3>
            <ul>
              @for (point of model().builderGrowth; track point.label) {
                <li><span>{{ point.label }}</span><strong>{{ point.value }}</strong></li>
              }
            </ul>
          </section>
          <section class="analytics-card">
            <h3>Subscription revenue (placeholder)</h3>
            <ul>
              @for (point of model().subscriptionRevenuePlaceholder; track point.label) {
                <li><span>{{ point.label }}</span><strong>₹{{ point.value }}L</strong></li>
              }
            </ul>
          </section>
          <section class="analytics-card">
            <h3>Project growth</h3>
            <ul>
              @for (point of model().projectGrowth; track point.label) {
                <li><span>{{ point.label }}</span><strong>{{ point.value }}</strong></li>
              }
            </ul>
          </section>
          <section class="analytics-card">
            <h3>Digital handover trends</h3>
            <ul>
              @for (point of model().handoverTrends; track point.label) {
                <li><span>{{ point.label }}</span><strong>{{ point.value }}</strong></li>
              }
            </ul>
          </section>
        </div>
      </div>
    </app-base-page>
  `,
  styles: `
    .analytics-page { display: grid; gap: 1rem; }
    .analytics-page__kpis {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
      gap: 0.75rem;
    }
    .analytics-page__kpis article {
      display: grid;
      gap: 0.25rem;
      padding: 0.9rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      background: var(--mpa-color-surface);
    }
    .analytics-page__grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }
    .analytics-card {
      padding: 1rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      background: var(--mpa-color-surface);
    }
    .analytics-card h3 { margin: 0 0 0.75rem; }
    .analytics-card ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45rem; }
    .analytics-card li { display: flex; justify-content: space-between; }
    @media (max-width: 900px) {
      .analytics-page__grid { grid-template-columns: 1fr; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformAnalyticsPageComponent {
  private readonly analytics = inject(PlatformAnalyticsService);
  private readonly metricsService = inject(PlatformMetricsService);

  readonly header = PLATFORM_ANALYTICS_HEADER;
  readonly model = this.analytics.model;
  readonly metrics = this.metricsService.snapshot;
}
