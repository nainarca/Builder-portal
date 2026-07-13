import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';

import { PlatformRole } from '@core/rbac/models/permission.model';
import { ROLE_REGISTRY } from '@core/rbac/registry/permission-matrix.registry';
import { ButtonComponent, InputTextComponent } from '@shared/ui';

import { InvitationFormModel } from '../../models/invitation-admin.model';
import { InvitationAdminStoreService } from '../../services/invitation-admin-store.service';

@Component({
  selector: 'app-iam-invite-user-form',
  imports: [ButtonComponent, InputTextComponent],
  template: `
    <div class="iam-invite-form" role="dialog" aria-label="Invite user">
      <div class="iam-invite-form__panel">
        <h2 class="mpa-heading-sm">Invite user</h2>
        <div class="iam-form__field"><span class="iam-form__label">Email *</span>
          <app-input-text type="email" [value]="model.email" (valueChange)="patch('email', $event)" />
        </div>
        <div class="iam-form__field"><span class="iam-form__label">Name</span>
          <app-input-text [value]="model.name" (valueChange)="patch('name', $event)" />
        </div>
        <div class="iam-form__field"><span class="iam-form__label">Role</span>
          <select [value]="model.role" (change)="onRole($event)">
            @for (r of roles; track r) { <option [value]="r">{{ roleLabel(r) }}</option> }
          </select>
        </div>
        <div class="iam-form__field"><span class="iam-form__label">Organization ID</span>
          <app-input-text [value]="model.organizationId" (valueChange)="patch('organizationId', $event)" />
        </div>
        <div class="iam-invite-form__actions">
          <app-button label="Send invitation" icon="pi pi-send" (clicked)="submit()" />
          <app-button label="Cancel" [outlined]="true" (clicked)="cancelled.emit()" />
        </div>
      </div>
    </div>
  `,
  styles: `
    .iam-invite-form { position: fixed; inset: 0; z-index: var(--mpa-z-index-modal); display: flex; align-items: center; justify-content: center; background: color-mix(in srgb, var(--mpa-color-background) 50%, transparent); backdrop-filter: blur(2px); }
    .iam-invite-form__panel { width: min(28rem, 92vw); padding: var(--mpa-spacing-xl); border-radius: var(--mpa-radius-xl); border: 1px solid var(--mpa-color-border); background: var(--mpa-color-surface); box-shadow: var(--mpa-shadow-xl); }
    .iam-invite-form__actions { display: flex; gap: var(--mpa-spacing-sm); justify-content: flex-end; margin-top: var(--mpa-spacing-md); }
    .iam-form__field { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: var(--mpa-spacing-md); font-size: var(--mpa-font-size-sm); }
    .iam-form__label { color: var(--mpa-color-text-muted); }
    select { padding: 0.55rem 0.75rem; border: 1px solid var(--mpa-color-border); border-radius: var(--mpa-radius-md); background: var(--mpa-color-surface); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamInviteUserFormComponent {
  private readonly store = inject(InvitationAdminStoreService);
  readonly invited = output<InvitationFormModel>();
  readonly cancelled = output<void>();

  model = this.store.emptyFormModel();
  readonly roles = (Object.keys(ROLE_REGISTRY) as PlatformRole[]).filter((r) => r !== 'public-visitor');

  roleLabel(r: PlatformRole): string { return ROLE_REGISTRY[r]?.label ?? r; }
  patch<K extends keyof InvitationFormModel>(k: K, v: InvitationFormModel[K]): void { this.model = { ...this.model, [k]: v }; }
  onRole(e: Event): void { this.patch('role', (e.target as HTMLSelectElement).value as PlatformRole); }
  submit(): void { if (this.model.email.trim()) this.invited.emit({ ...this.model }); }
}
