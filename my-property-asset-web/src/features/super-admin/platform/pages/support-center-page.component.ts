import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ButtonComponent, EnterpriseFormPageHeaderComponent, UiToastService } from '@shared/ui';

import { SuperAdminPageComponent } from '../../components/layout';
import { PLATFORM_SUPPORT_HEADER } from '../config/platform.config';
import { SupportTicketPriority, SupportTicketStatus } from '../models/platform.model';
import { SupportTicketService } from '../services/support-ticket.service';

@Component({
  selector: 'app-support-center-page',
  imports: [SuperAdminPageComponent, EnterpriseFormPageHeaderComponent, ButtonComponent],
  template: `
    <app-sa-page>
      <div class="support-page">
        <app-enterprise-form-page-header
          [eyebrow]="header.eyebrow"
          [title]="header.title"
          [subtitle]="header.description"
          mode="view"
        >
          <app-button formHeaderActions label="New ticket" icon="pi pi-plus" (clicked)="createDemo()" />
        </app-enterprise-form-page-header>

        <section class="support-page__stats">
          <article><strong>{{ tickets().length }}</strong><span>Total tickets</span></article>
          <article><strong>{{ openCount() }}</strong><span>Open queue</span></article>
        </section>

        <table>
          <thead>
            <tr>
              <th>Builder</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (ticket of tickets(); track ticket.id) {
              <tr>
                <td>{{ ticket.builderCompanyName }}</td>
                <td>
                  <div>{{ ticket.subject }}</div>
                  <small>{{ ticket.internalNotes || 'No internal notes' }}</small>
                </td>
                <td>{{ ticket.priority }}</td>
                <td>{{ ticket.status }}</td>
                <td>{{ ticket.contactEmail || '—' }}</td>
                <td class="support-page__actions">
                  <app-button label="Assign me" size="small" [outlined]="true" (clicked)="assign(ticket.id)" />
                  <app-button label="In progress" size="small" [outlined]="true" (clicked)="setStatus(ticket.id, 'in_progress')" />
                  <app-button label="Resolve" size="small" severity="success" [outlined]="true" (clicked)="setStatus(ticket.id, 'resolved')" />
                  <app-button label="Note" size="small" [text]="true" (clicked)="addNote(ticket.id)" />
                </td>
              </tr>
            } @empty {
              <tr><td colspan="6">No support tickets.</td></tr>
            }
          </tbody>
        </table>

        <p class="support-page__hint">
          Future integrations: Zendesk / Freshdesk / Intercom connectors (placeholder only).
        </p>
      </div>
    </app-sa-page>
  `,
  styles: `
    .support-page { display: grid; gap: 1rem; }
    .support-page__stats {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }
    .support-page__stats article {
      display: grid;
      gap: 0.25rem;
      padding: 1rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      background: var(--mpa-color-surface);
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem; border-bottom: 1px solid var(--mpa-color-border); text-align: left; vertical-align: top; }
    small { color: var(--mpa-color-text-muted); }
    .support-page__actions { display: flex; flex-wrap: wrap; gap: 0.35rem; }
    .support-page__hint { margin: 0; color: var(--mpa-color-text-muted); font-size: 0.875rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportCenterPageComponent {
  private readonly support = inject(SupportTicketService);
  private readonly toast = inject(UiToastService);

  readonly header = PLATFORM_SUPPORT_HEADER;
  readonly tickets = this.support.tickets;
  readonly openCount = this.support.openCount;
  readonly noteSeed = signal(1);

  createDemo(): void {
    this.support.create({
      builderCompanyName: 'New Builder Co',
      subject: 'General onboarding help',
      description: 'Need assistance configuring projects.',
      priority: 'normal' as SupportTicketPriority,
      contactEmail: 'hello@newbuilder.test',
    });
    this.toast.success('Ticket created');
  }

  assign(id: string): void {
    this.support.assign(id, 'Super Admin');
    this.toast.info('Assigned', 'Ticket assigned to Super Admin.');
  }

  setStatus(id: string, status: SupportTicketStatus): void {
    this.support.updateStatus(id, status);
    this.toast.success('Status updated', status);
  }

  addNote(id: string): void {
    const n = this.noteSeed();
    this.support.updateNotes(id, `Internal note #${n} — contacted builder.`);
    this.noteSeed.set(n + 1);
    this.toast.success('Internal note saved');
  }
}
