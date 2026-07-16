import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BasePageComponent, ButtonComponent, PageHeaderComponent, UiToastService } from '@shared/ui';
import { CommunicationService } from '@features/builder-portal/communications/services/communication.service';

@Component({
  selector: 'app-ops-communications-page',
  imports: [BasePageComponent, PageHeaderComponent, ButtonComponent],
  template: `
    <app-base-page>
      <div class="ops-comm-page">
        <app-page-header
          eyebrow="Platform Operations"
          title="Builder communications"
          description="Moderate builder-to-owner communications, disable content, and review delivery statistics."
        />

        <section class="ops-comm-page__stats">
          <article><strong>{{ communications().length }}</strong><span>Total communications</span></article>
          <article><strong>{{ publishedCount() }}</strong><span>Published</span></article>
          <article><strong>{{ disabledCount() }}</strong><span>Disabled by platform</span></article>
          <article><strong>{{ totalRecipients() }}</strong><span>Total recipients</span></article>
        </section>

        <table class="ops-comm-table">
          <thead>
            <tr>
              <th>Organization</th>
              <th>Title</th>
              <th>Status</th>
              <th>Recipients</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (item of communications(); track item.id) {
              <tr>
                <td>{{ item.organizationId }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.status }}</td>
                <td>{{ item.recipientCount }}</td>
                <td>
                  <app-button
                    label="Disable"
                    [outlined]="true"
                    severity="danger"
                    [disabled]="item.disabledByPlatform"
                    (clicked)="disable(item.id)"
                  />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </app-base-page>
  `,
  styles: `
    .ops-comm-page { display: grid; gap: 1rem; }
    .ops-comm-page__stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
    }
    .ops-comm-page__stats article {
      display: grid;
      gap: 0.35rem;
      padding: 1rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      background: var(--mpa-color-surface);
    }
    .ops-comm-table { width: 100%; border-collapse: collapse; }
    .ops-comm-table th, .ops-comm-table td {
      padding: 0.75rem;
      border-bottom: 1px solid var(--mpa-color-border);
      text-align: left;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsCommunicationsPageComponent {
  private readonly communicationService = inject(CommunicationService);
  private readonly toast = inject(UiToastService);

  readonly communications = computed(() => this.communicationService.listAllForAdmin());
  readonly publishedCount = computed(() => this.communications().filter((item) => item.status === 'published').length);
  readonly disabledCount = computed(() => this.communications().filter((item) => item.disabledByPlatform).length);
  readonly totalRecipients = computed(() =>
    this.communications().reduce((sum, item) => sum + item.recipientCount, 0),
  );

  disable(id: string): void {
    const disabled = this.communicationService.disable(id);
    if (disabled) {
      this.toast.success('Communication disabled', 'Builder communication has been disabled.');
    }
  }
}
