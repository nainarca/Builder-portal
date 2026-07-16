import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BasePageComponent, ButtonComponent, PageHeaderComponent, UiToastService } from '@shared/ui';

import { BuilderOrganizationService } from '../../../builder-portal/organization/services/builder-organization.service';
import { BuilderFormComponent } from '../components/form/builder-form.component';
import { BuilderFormModel } from '../models/builder-admin.model';
import { BuilderAdminStoreService } from '../services/builder-admin-store.service';

@Component({
  selector: 'app-builder-create-page',
  imports: [BasePageComponent, PageHeaderComponent, BuilderFormComponent, ButtonComponent],
  template: `
    <app-base-page>
      <div class="bldr-page">
        <app-page-header
          eyebrow="Builders"
          title="Create builder"
          description="Register a Builder Organization, company profile, and invite the Builder Owner."
        />
        <app-bldr-form [initialModel]="initialModel" (submitted)="onSubmit($event)" />
        @if (lastInviteToken()) {
          <p class="bldr-invite-token" role="status">
            Owner invitation token (share securely):
            <code>{{ lastInviteToken() }}</code>
          </p>
        }
        <div class="bldr-form-page-actions">
          <app-button
            label="Create builder"
            icon="pi pi-check"
            [loading]="saving"
            (clicked)="submit()"
          />
          <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
        </div>
      </div>
    </app-base-page>
  `,
  styles: `
    .bldr-form-page-actions {
      display: flex;
      gap: var(--mpa-spacing-sm);
      justify-content: flex-end;
      padding-top: var(--mpa-spacing-md);
      border-top: 1px solid var(--mpa-color-border);
    }
    .bldr-invite-token {
      margin: 1rem 0 0;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      background: color-mix(in srgb, #1b4d89 8%, transparent);
    }
    .bldr-invite-token code {
      font-weight: 600;
      word-break: break-all;
    }
  `,
  styleUrl: './builder-create-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderCreatePageComponent {
  private readonly router = inject(Router);
  private readonly store = inject(BuilderAdminStoreService);
  private readonly builderOrganizations = inject(BuilderOrganizationService);
  private readonly toast = inject(UiToastService);
  private readonly form = viewChild(BuilderFormComponent);

  readonly initialModel = this.store.emptyFormModel();
  readonly lastInviteToken = signal<string | null>(null);
  saving = false;

  submit(): void {
    this.form()?.submit();
  }

  onSubmit(model: BuilderFormModel): void {
    this.saving = true;

    const provisioned = this.builderOrganizations.createBuilderOrganization({
      legalName: model.companyName,
      tradingName: model.tradingName,
      primaryContactName: model.primaryContactName,
      primaryContactEmail: model.primaryContactEmail,
      primaryContactPhone: model.primaryContactPhone,
      region: model.region,
      planCode: model.plan,
      inviteOwner: true,
    });

    const created = this.store.create({
      ...model,
      organizationId: provisioned.organizationId,
      status: 'pending',
    });

    if (provisioned.invitationToken) {
      this.lastInviteToken.set(provisioned.invitationToken);
      this.store.inviteBuilderOwner(created.id);
      this.toast.success(
        'Builder created',
        'Owner invitation token generated. Share it via /auth/builder-invitation.',
      );
    }

    this.saving = false;
    void this.router.navigate(['/super-admin/builders', created.id], {
      queryParams: provisioned.invitationToken
        ? { inviteToken: provisioned.invitationToken }
        : undefined,
    });
  }

  cancel(): void {
    void this.router.navigate(['/super-admin/builders']);
  }
}
