import { BuilderPortalPageComponent } from '../../components/layout';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';
import { map } from 'rxjs';

import { AuthorizedButtonComponent } from '@core/rbac';
import { ButtonComponent, EmptyNoDataComponent, EnterpriseFormPageHeaderComponent, UiToastService } from '@shared/ui';
import { CommunicationDeliveryService } from '../services/communication-delivery.service';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-communication-detail-page',
  imports: [ BuilderPortalPageComponent,
    JsonPipe,
    RouterLink,
    EmptyNoDataComponent,
    EnterpriseFormPageHeaderComponent, ButtonComponent,
    AuthorizedButtonComponent,
  ],
  template: `
    <app-bp-page>
      @if (communication(); as item) {
        <div class="comm-detail">
          <app-enterprise-form-page-header [title]="item.title" [subtitle]="item.shortDescription" mode="view">
            <app-button formHeaderActions label="Back" [outlined]="true" routerLink="/builder-portal/communications" />
            @if (item.status === 'draft' || item.status === 'scheduled') {
              <app-button
                formHeaderActions
                label="Edit"
                icon="pi pi-pencil"
                [outlined]="true"
                [routerLink]="['/builder-portal/communications', item.id, 'edit']"
              />
            }
            @if (item.status === 'draft' || item.status === 'scheduled') {
              <app-authorized-button
                formHeaderActions
                label="Publish now"
                icon="pi pi-send"
                permission="id-11-notification:operate"
                (clicked)="publish()"
              />
            }
            <app-authorized-button
              formHeaderActions
              label="Archive"
              icon="pi pi-inbox"
              [outlined]="true"
              permission="id-11-notification:operate"
              (clicked)="archive()"
            />
          </app-enterprise-form-page-header>

          <section class="comm-detail__grid">
            <article>
              <h3>Status</h3>
              <p><strong>Status:</strong> {{ item.status }}</p>
              <p><strong>Priority:</strong> {{ item.priority }}</p>
              <p><strong>Recipients:</strong> {{ item.recipientCount }}</p>
              <p><strong>Delivery:</strong> {{ item.deliveryStatus }}</p>
              <p><strong>Published:</strong> {{ item.publishedAt ? formatDate(item.publishedAt) : '—' }}</p>
            </article>
            <article>
              <h3>Audience</h3>
              <p><strong>Type:</strong> {{ item.audienceType }}</p>
              <pre>{{ item.audienceConfig | json }}</pre>
            </article>
            <article>
              <h3>Content</h3>
              <div [innerHTML]="item.detailedContent"></div>
            </article>
            <article>
              <h3>Audit trail</h3>
              <ul>
                @for (event of audit(); track event.id) {
                  <li>{{ formatDate(event.createdAt) }} — {{ event.action }} by {{ event.actorLabel }}</li>
                }
              </ul>
            </article>
            <article>
              <h3>Owner App contract</h3>
              <pre>{{ pushContracts() | json }}</pre>
            </article>
          </section>
        </div>
      } @else {
        <app-empty-no-data
          title="Communication not found"
          description="The requested communication does not exist or was removed."
        />
      }
    </app-bp-page>
  `,
  styles: `
    .comm-detail__grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }
    .comm-detail__grid article {
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      padding: 1rem;
    }
    pre { margin: 0; overflow: auto; font-size: 0.8rem; }
    @media (max-width: 900px) { .comm-detail__grid { grid-template-columns: 1fr; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush })
export class CommunicationDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly communicationService = inject(CommunicationService);
  private readonly deliveryService = inject(CommunicationDeliveryService);
  private readonly toast = inject(UiToastService);

  private readonly communicationId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' },
  );

  readonly communication = computed(() => {
    const id = this.communicationId();
    return id ? this.communicationService.getById(id) : undefined;
  });

  readonly audit = computed(() => {
    const id = this.communicationId();
    return id ? this.communicationService.listAudit(id) : [];
  });

  readonly pushContracts = computed(() => {
    const item = this.communication();
    return item ? this.deliveryService.toPushContracts(item) : [];
  });

  publish(): void {
    const item = this.communication();
    if (!item) return;
    const published = this.communicationService.publishNow(item.id);
    if (published) {
      this.toast.success('Published', `Delivered to ${published.recipientCount} owners.`);
    }
  }

  archive(): void {
    const item = this.communication();
    if (!item) return;
    this.communicationService.archive(item.id);
    this.toast.info('Archived', 'Communication moved to archive.');
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString();
  }
}
