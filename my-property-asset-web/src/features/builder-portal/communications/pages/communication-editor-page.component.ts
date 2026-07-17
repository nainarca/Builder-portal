import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { JsonPipe } from '@angular/common';

import { AuthorizedButtonComponent } from '@core/rbac';
import { EnterpriseFormShellComponent, UiToastService } from '@shared/ui';

import { BuilderPortalPageComponent } from '../../components/layout';
import { OwnerStoreService } from '../../owners/services/owner-store.service';
import { ProjectStoreService } from '../../projects/services/project-store.service';
import { InMemoryBuilderBuildingRepository } from '../../projects/buildings/repositories/in-memory-builder-building.repository';
import { UnitStoreService } from '../../projects/units/services/unit-store.service';
import {
  COMMUNICATION_AUDIENCE_OPTIONS,
  COMMUNICATION_PRIORITY_OPTIONS,
  COMMUNICATION_TYPE_OPTIONS,
  DEFAULT_COMMUNICATION_FORM,
} from '../config/communications.config';
import { CommunicationFormModel } from '../models/communication.model';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-communication-editor-page',
  imports: [
    BuilderPortalPageComponent,
    JsonPipe,
    ReactiveFormsModule,
    EnterpriseFormShellComponent,
    AuthorizedButtonComponent,
  ],
  template: `
    <app-bp-page>
      <app-enterprise-form-shell
        [title]="isEdit() ? 'Edit communication' : 'Create communication'"
        subtitle="Compose message content, choose audience, preview recipients, and publish."
        [mode]="isEdit() ? 'edit' : 'create'"
        [showActions]="false"
      >
        <app-authorized-button
          formHeaderActions
          label="Save draft"
          icon="pi pi-save"
          permission="id-11-notification:contribute"
          (clicked)="saveDraft()"
        />
        <app-authorized-button
          formHeaderActions
          label="Publish now"
          icon="pi pi-send"
          permission="id-11-notification:operate"
          (clicked)="publishNow()"
        />

        <div class="comm-editor">
          <div class="comm-editor__layout">
            <form class="comm-editor__form" [formGroup]="form">
              <section>
                <h3>Message</h3>
                <label><span>Type</span>
                  <select formControlName="communicationType">
                    @for (option of typeOptions; track option.value) {
                      <option [value]="option.value">{{ option.label }}</option>
                    }
                  </select>
                </label>
                <label><span>Title</span><input type="text" formControlName="title" /></label>
                <label><span>Short description</span><input type="text" formControlName="shortDescription" /></label>
                <label><span>Detailed content</span><textarea rows="6" formControlName="detailedContent"></textarea></label>
                <label><span>Banner image URL</span><input type="url" formControlName="bannerImageUrl" /></label>
                <label><span>Attachment URL</span><input type="url" formControlName="attachmentUrl" /></label>
              </section>

              <section>
                <h3>Audience</h3>
                <label><span>Audience</span>
                  <select formControlName="audienceType" (change)="onAudienceTypeChange()">
                    @for (option of audienceOptions; track option.value) {
                      <option [value]="option.value">{{ option.label }}</option>
                    }
                  </select>
                </label>
                @if (form.controls['audienceType'].value === 'by_project') {
                  <label><span>Project</span>
                    <select [value]="audienceProjectId()" (change)="setAudienceProject($event)">
                      <option value="">Select project</option>
                      @for (project of projects(); track project.id) {
                        <option [value]="project.id">{{ project.name }}</option>
                      }
                    </select>
                  </label>
                }
                @if (form.controls['audienceType'].value === 'by_building') {
                  <label><span>Building</span>
                    <select [value]="audienceBuildingId()" (change)="setAudienceBuilding($event)">
                      <option value="">Select building</option>
                      @for (building of buildings(); track building.id) {
                        <option [value]="building.id">{{ building.name }}</option>
                      }
                    </select>
                  </label>
                }
                @if (form.controls['audienceType'].value === 'by_unit') {
                  <label><span>Unit</span>
                    <select [value]="audienceUnitId()" (change)="setAudienceUnit($event)">
                      <option value="">Select unit</option>
                      @for (unit of units(); track unit.id) {
                        <option [value]="unit.id">{{ unit.unitNumber }} — {{ unit.towerName }}</option>
                      }
                    </select>
                  </label>
                }
                @if (form.controls['audienceType'].value === 'selected_owners') {
                  <label><span>Owners</span>
                    <select multiple [value]="audienceOwnerIds()" (change)="setAudienceOwners($event)">
                      @for (owner of owners(); track owner.id) {
                        <option [value]="owner.id">{{ owner.firstName }} {{ owner.lastName }}</option>
                      }
                    </select>
                  </label>
                }
                @if (form.controls['audienceType'].value === 'by_property_type') {
                  <label><span>Property type</span>
                    <select [value]="audiencePropertyType()" (change)="setAudiencePropertyType($event)">
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </label>
                }
              </section>

              <section>
                <h3>Delivery</h3>
                <label><span>Priority</span>
                  <select formControlName="priority">
                    @for (option of priorityOptions; track option.value) {
                      <option [value]="option.value">{{ option.label }}</option>
                    }
                  </select>
                </label>
                <label><span>CTA label</span><input type="text" formControlName="ctaLabel" /></label>
                <label><span>External URL</span><input type="url" formControlName="ctaExternalUrl" /></label>
                <label><span>Internal route</span><input type="text" formControlName="ctaInternalRoute" /></label>
                <label><span>Schedule publish</span><input type="datetime-local" formControlName="publishAt" /></label>
                <label><span>Start date</span><input type="datetime-local" formControlName="startAt" /></label>
                <label><span>Expiry date</span><input type="datetime-local" formControlName="expiresAt" /></label>
              </section>
            </form>

            <aside class="comm-editor__preview">
              <section>
                <h3>Live preview</h3>
                <article class="comm-preview-card">
                  <span class="comm-preview-card__priority">{{ form.controls['priority'].value }}</span>
                  <h4>{{ form.controls['title'].value || 'Untitled communication' }}</h4>
                  <p>{{ form.controls['shortDescription'].value || 'Short description preview' }}</p>
                  <div [innerHTML]="form.controls['detailedContent'].value"></div>
                  @if (form.controls['ctaLabel'].value) {
                    <button type="button">{{ form.controls['ctaLabel'].value }}</button>
                  }
                </article>
              </section>
              <section>
                <h3>Recipient preview</h3>
                <p>{{ recipientPreview().length }} owners targeted</p>
                <ul>
                  @for (recipient of recipientPreview(); track recipient.ownerId) {
                    <li>{{ recipient.ownerName }}</li>
                  }
                </ul>
              </section>
              <section>
                <h3>Owner App contract</h3>
                <pre>{{ ownerContractPreview() | json }}</pre>
              </section>
            </aside>
          </div>
        </div>
      </app-enterprise-form-shell>
    </app-bp-page>
  `,
  styles: `
    .comm-editor { display: grid; gap: 1rem; }
    .comm-editor__layout { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr); gap: 1rem; }
    .comm-editor__form, .comm-editor__preview section {
      display: grid; gap: 0.85rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      padding: 1rem;
    }
    .comm-editor__form label { display: grid; gap: 0.35rem; font-size: 0.875rem; color: var(--mpa-color-text-muted); }
    .comm-editor__form input, .comm-editor__form select, .comm-editor__form textarea {
      width: 100%; padding: 0.65rem 0.75rem; border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem); font: inherit;
    }
    .comm-preview-card { display: grid; gap: 0.75rem; }
    .comm-preview-card__priority {
      justify-self: start; padding: 0.2rem 0.55rem; border-radius: 999px;
      background: color-mix(in srgb, var(--mpa-color-primary) 14%, transparent);
      text-transform: capitalize; font-size: 0.75rem;
    }
    pre { margin: 0; max-height: 240px; overflow: auto; font-size: 0.8rem; }
    @media (max-width: 1080px) { .comm-editor__layout { grid-template-columns: 1fr; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunicationEditorPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly communicationService = inject(CommunicationService);
  private readonly projectStore = inject(ProjectStoreService);
  private readonly buildingStore = inject(InMemoryBuilderBuildingRepository);
  private readonly unitStore = inject(UnitStoreService);
  private readonly ownerStore = inject(OwnerStoreService);
  private readonly toast = inject(UiToastService);

  private readonly communicationId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: null as string | null },
  );

  readonly typeOptions = COMMUNICATION_TYPE_OPTIONS;
  readonly audienceOptions = COMMUNICATION_AUDIENCE_OPTIONS;
  readonly priorityOptions = COMMUNICATION_PRIORITY_OPTIONS;
  readonly projects = computed(() => this.projectStore.projects());
  readonly buildings = computed(() => this.buildingStore.getAll());
  readonly units = computed(() => this.unitStore.units());
  readonly owners = computed(() => this.ownerStore.owners());

  readonly audienceProjectId = signal('');
  readonly audienceBuildingId = signal('');
  readonly audienceUnitId = signal('');
  readonly audienceOwnerIds = signal<string[]>([]);
  readonly audiencePropertyType = signal('apartment');

  readonly form = this.createForm();
  readonly isEdit = computed(() => !!this.communicationId() && this.communicationId() !== 'create');

  readonly recipientPreview = computed(() =>
    this.communicationService.previewRecipients(this.form.getRawValue() as CommunicationFormModel),
  );

  readonly ownerContractPreview = computed(() => {
    const model = this.form.getRawValue() as CommunicationFormModel;
    return {
      title: model.title,
      shortDescription: model.shortDescription,
      priority: model.priority,
      communicationType: model.communicationType,
      cta: {
        label: model.ctaLabel,
        externalUrl: model.ctaExternalUrl,
        internalRoute: model.ctaInternalRoute,
      },
      recipientCount: this.recipientPreview().length,
    };
  });

  constructor() {
    const id = this.communicationId();
    if (id && id !== 'create') {
      const communication = this.communicationService.getById(id);
      if (communication) {
        this.form.patchValue(this.communicationService.toFormModel(communication));
        this.audienceProjectId.set(communication.audienceConfig.projectId ?? '');
        this.audienceBuildingId.set(communication.audienceConfig.buildingId ?? '');
        this.audienceUnitId.set(communication.audienceConfig.unitIds?.[0] ?? '');
        this.audienceOwnerIds.set([...(communication.audienceConfig.ownerIds ?? [])]);
        this.audiencePropertyType.set(communication.audienceConfig.propertyType ?? 'apartment');
      }
    }
  }

  saveDraft(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const model = this.buildModel();
    const saved = this.communicationService.saveDraft(model, this.isEdit() ? this.communicationId()! : undefined);
    this.toast.success('Draft saved', 'Communication draft has been saved.');
    if (!this.isEdit()) {
      void this.router.navigate(['/builder-portal/communications', saved.id, 'edit']);
    }
  }

  publishNow(): void {
    const model = this.buildModel();
    const saved = this.communicationService.saveDraft(model, this.isEdit() ? this.communicationId()! : undefined);
    const published = this.communicationService.publishNow(saved.id);
    if (!published) {
      this.toast.error('Publish failed', 'Unable to publish this communication.');
      return;
    }
    this.toast.success('Published', `Delivered to ${published.recipientCount} owners.`);
    void this.router.navigate(['/builder-portal/communications', published.id]);
  }

  onAudienceTypeChange(): void {
    this.syncAudienceConfig();
  }

  setAudienceProject(event: Event): void {
    this.audienceProjectId.set((event.target as HTMLSelectElement).value);
    this.syncAudienceConfig();
  }

  setAudienceBuilding(event: Event): void {
    this.audienceBuildingId.set((event.target as HTMLSelectElement).value);
    this.syncAudienceConfig();
  }

  setAudienceUnit(event: Event): void {
    this.audienceUnitId.set((event.target as HTMLSelectElement).value);
    this.syncAudienceConfig();
  }

  setAudienceOwners(event: Event): void {
    const selected = Array.from((event.target as HTMLSelectElement).selectedOptions).map((option) => option.value);
    this.audienceOwnerIds.set(selected);
    this.syncAudienceConfig();
  }

  setAudiencePropertyType(event: Event): void {
    this.audiencePropertyType.set((event.target as HTMLSelectElement).value);
    this.syncAudienceConfig();
  }

  private buildModel(): CommunicationFormModel {
    this.syncAudienceConfig();
    return this.form.getRawValue() as CommunicationFormModel;
  }

  private syncAudienceConfig(): void {
    const audienceType = this.form.controls['audienceType'].value;
    const config =
      audienceType === 'by_project'
        ? { projectId: this.audienceProjectId() }
        : audienceType === 'by_building'
          ? { buildingId: this.audienceBuildingId() }
          : audienceType === 'by_unit'
            ? { unitIds: this.audienceUnitId() ? [this.audienceUnitId()] : [] }
            : audienceType === 'selected_owners'
              ? { ownerIds: this.audienceOwnerIds() }
              : audienceType === 'by_property_type'
                ? { propertyType: this.audiencePropertyType() }
                : {};
    this.form.patchValue({ audienceConfig: config });
  }

  private createForm(): FormGroup {
    return new FormGroup({
      communicationType: new FormControl(DEFAULT_COMMUNICATION_FORM.communicationType, { nonNullable: true }),
      title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      shortDescription: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      detailedContent: new FormControl('', { nonNullable: true }),
      bannerImageUrl: new FormControl('', { nonNullable: true }),
      attachmentUrl: new FormControl('', { nonNullable: true }),
      ctaLabel: new FormControl('', { nonNullable: true }),
      ctaExternalUrl: new FormControl('', { nonNullable: true }),
      ctaInternalRoute: new FormControl('', { nonNullable: true }),
      priority: new FormControl(DEFAULT_COMMUNICATION_FORM.priority, { nonNullable: true }),
      audienceType: new FormControl(DEFAULT_COMMUNICATION_FORM.audienceType, { nonNullable: true }),
      audienceConfig: new FormControl(DEFAULT_COMMUNICATION_FORM.audienceConfig, { nonNullable: true }),
      publishAt: new FormControl('', { nonNullable: true }),
      startAt: new FormControl('', { nonNullable: true }),
      expiresAt: new FormControl('', { nonNullable: true }),
    });
  }
}
