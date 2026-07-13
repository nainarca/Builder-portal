import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';

import { FormActionsComponent, FormContainerComponent, FormSectionComponent, InputTextComponent, MessageComponent } from '@shared/ui';

import { PlatformRole } from '@core/rbac/models/permission.model';
import { ROLE_REGISTRY } from '@core/rbac/registry/permission-matrix.registry';
import { UserFormModel } from '../../../models/user-admin.model';
import { UserFormStateService } from '../../../services/user-form-state.service';

@Component({
  selector: 'app-iam-user-form',
  imports: [FormContainerComponent, FormSectionComponent, FormActionsComponent, InputTextComponent, MessageComponent],
  providers: [UserFormStateService],
  template: `
    @if (formState.model(); as model) {
      <app-form-container>
        @if (formState.lastAutosavedAt()) { <app-message severity="info" text="Draft autosaved" /> }
        <app-form-section title="Profile" description="User identity information">
          <div class="iam-form__field"><span class="iam-form__label">Email *</span>
            <app-input-text type="email" [value]="model.email" [invalid]="!!formState.errors()['email']" (valueChange)="formState.setField('email', $event)" />
            @if (formState.errors()['email']) { <small class="iam-form__error">{{ formState.errors()['email'] }}</small> }
          </div>
          <div class="iam-form__field"><span class="iam-form__label">First name</span>
            <app-input-text [value]="model.firstName" (valueChange)="formState.setField('firstName', $event)" />
          </div>
          <div class="iam-form__field"><span class="iam-form__label">Last name</span>
            <app-input-text [value]="model.lastName" (valueChange)="formState.setField('lastName', $event)" />
          </div>
          <div class="iam-form__field"><span class="iam-form__label">Display name</span>
            <app-input-text [value]="model.displayName" [invalid]="!!formState.errors()['displayName']" (valueChange)="formState.setField('displayName', $event)" />
          </div>
          <div class="iam-form__field"><span class="iam-form__label">Status</span>
            <select [value]="model.status" (change)="onSelect('status', $event)">
              <option value="pending">Pending</option><option value="active">Active</option>
              <option value="inactive">Inactive</option><option value="suspended">Suspended</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </app-form-section>
        <app-form-section title="Role & access">
          <div class="iam-form__field"><span class="iam-form__label">Primary role</span>
            <select [value]="model.primaryRole" (change)="onSelect('primaryRole', $event)">
              @for (r of roles; track r) { <option [value]="r">{{ roleLabel(r) }}</option> }
            </select>
          </div>
          <div class="iam-form__field"><span class="iam-form__label">Organization ID</span>
            <app-input-text [value]="model.organizationId" (valueChange)="formState.setField('organizationId', $event)" />
          </div>
          <div class="iam-form__field"><span class="iam-form__label">Builder ID</span>
            <app-input-text [value]="model.builderId" (valueChange)="formState.setField('builderId', $event)" />
          </div>
          <label class="iam-form__field iam-form__field--checkbox">
            <input type="checkbox" [checked]="model.mfaEnabled" (change)="onCheck($event)" /> Require MFA
          </label>
        </app-form-section>
        <app-form-actions><ng-content select="[formActions]" /></app-form-actions>
      </app-form-container>
    }
  `,
  styles: `
    .iam-form__label { font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
    .iam-form__error { color: var(--mpa-color-danger); font-size: var(--mpa-font-size-xs); }
    .iam-form__field { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: var(--mpa-spacing-md); font-size: var(--mpa-font-size-sm); }
    .iam-form__field select { padding: 0.55rem 0.75rem; border: 1px solid var(--mpa-color-border); border-radius: var(--mpa-radius-md); background: var(--mpa-color-surface); }
    .iam-form__field--checkbox { flex-direction: row; align-items: center; gap: var(--mpa-spacing-sm); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserFormComponent implements OnInit, OnDestroy {
  readonly formState = inject(UserFormStateService);
  readonly initialModel = input.required<UserFormModel>();
  readonly submitted = output<UserFormModel>();

  readonly roles = (Object.keys(ROLE_REGISTRY) as PlatformRole[]).filter((r) => r !== 'public-visitor');

  ngOnInit(): void { this.formState.initialize(this.initialModel()); }
  ngOnDestroy(): void { this.formState.destroy(); }

  submit(): boolean {
    if (!this.formState.validate()) return false;
    const model = this.formState.model();
    if (model) { this.submitted.emit(model); this.formState.markPristine(); }
    return true;
  }

  roleLabel(r: PlatformRole): string { return ROLE_REGISTRY[r]?.label ?? r; }
  onSelect(field: 'status' | 'primaryRole', e: Event): void {
    this.formState.setField(field, (e.target as HTMLSelectElement).value as UserFormModel[typeof field]);
  }
  onCheck(e: Event): void { this.formState.setField('mfaEnabled', (e.target as HTMLInputElement).checked); }
}
