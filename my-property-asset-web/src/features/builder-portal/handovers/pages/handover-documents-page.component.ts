import { BuilderPortalPageComponent } from '../../components/layout';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { ButtonComponent, EmptyNoDataComponent, UiToastService } from '@shared/ui';

import { HandoverDocumentService } from '../services/handover-document.service';
import { HandoverStoreService } from '../services/handover-store.service';

@Component({
  selector: 'app-handover-documents-page',
  imports: [ BuilderPortalPageComponent, ButtonComponent, EmptyNoDataComponent, RouterLink],
  template: `
    <app-bp-page>
      @if (handover(); as h) {
        <div class="handover-page handover-page--detail">
          <header class="handover-header">
            <div class="handover-header__main">
              <div>
                <span class="mpa-eyebrow">{{ h.projectName }} · {{ h.unitNumber }}</span>
                <h1 class="ui-page-title">Handover documents</h1>
                <p class="ui-page-subtitle">Upload and verify the unit's digital handover package.</p>
              </div>
            </div>
            <div class="handover-header__actions">
              <app-button label="Upload document" icon="pi pi-upload" (clicked)="goToUpload(h.projectId, h.unitId)" />
              <a class="handover-grid__view-link" [routerLink]="['/builder-portal/handovers', h.id]">Back to handover</a>
            </div>
          </header>

          <div class="handover-overview__grid">
            @for (bucket of buckets(); track bucket.type.id) {
              <section class="handover-info-panel">
                <h3 class="handover-info-panel__title">{{ bucket.type.label }}</h3>
                <p class="mpa-body-sm m-0">
                  {{ bucket.documents.length }} document{{ bucket.documents.length === 1 ? '' : 's' }}
                  · {{ bucket.verified ? 'Verified' : (bucket.type.required ? 'Pending verification' : 'Optional') }}
                </p>
                @if (bucket.documents.length) {
                  <ul class="mt-3">
                    @for (doc of bucket.documents; track doc.id) {
                      <li class="mpa-body-sm mb-2">
                        {{ doc.name }}
                        @if (!isVerified(h.id, doc.id)) {
                          <app-button
                            label="Verify"
                            icon="pi pi-check"
                            [text]="true"
                            (clicked)="verify(h.id, doc.id, doc.name)"
                          />
                        } @else {
                          <span class="ml-2">Verified</span>
                        }
                      </li>
                    }
                  </ul>
                } @else {
                  <p class="mpa-body-sm mt-3 mb-0">No matching documents uploaded yet.</p>
                }
              </section>
            }
          </div>
        </div>
      } @else {
        <app-empty-no-data
          title="Handover not found"
          description="The requested handover does not exist."
        />
      }
    </app-bp-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush })
export class HandoverDocumentsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(HandoverStoreService);
  private readonly documents = inject(HandoverDocumentService);
  private readonly toast = inject(UiToastService);

  private readonly handoverId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '' });

  readonly handover = computed(() => this.store.getById(this.handoverId()));
  readonly buckets = computed(() => this.documents.getBuckets(this.handoverId()));

  goToUpload(projectId: string, unitId: string): void {
    void this.router.navigate(['/builder-portal/documents/upload'], {
      queryParams: { projectId, unitId } });
  }

  verify(handoverId: string, documentId: string, name: string): void {
    this.documents.verifyDocument(handoverId, documentId);
    this.toast.success('Document verified', `${name} is now marked ready for handover.`);
  }

  isVerified(handoverId: string, documentId: string): boolean {
    return this.documents.isVerified(handoverId, documentId);
  }
}
