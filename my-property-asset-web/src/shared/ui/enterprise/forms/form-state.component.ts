import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { SkeletonFormComponent } from '../loading/enterprise-loading.component';
import { EnterpriseLoadingOverlayComponent } from '../loading/enterprise-loading.component';
import { EmptyPermissionDeniedComponent } from '../empty-states/enterprise-empty-states.component';
import { ErrorAlertComponent, InformationAlertComponent } from '../alerts/enterprise-alerts.component';
import { EnterpriseFormLifecycleState } from './models/enterprise-form.models';

/**
 * DS-04 Form state host — loading / skeleton / saving / readonly / draft / archived / error / permission.
 */
@Component({
  selector: 'app-enterprise-form-state',
  imports: [
    SkeletonFormComponent,
    EnterpriseLoadingOverlayComponent,
    EmptyPermissionDeniedComponent,
    ErrorAlertComponent,
    InformationAlertComponent,
  ],
  template: `
    @switch (state()) {
      @case ('loading') {
        <app-skeleton-form [fieldCount]="skeletonFields()" />
      }
      @case ('permission-denied') {
        <app-empty-permission-denied
          [title]="permissionTitle()"
          [description]="permissionDescription()"
          [actionLabel]="permissionActionLabel()"
          (action)="permissionAction.emit($event)"
        />
      }
      @case ('error') {
        <app-error-alert [message]="errorMessage() || 'Unable to load this form.'" [closable]="false" />
        <ng-content />
      }
      @default {
        <div
          class="enterprise-form-state"
          [class.enterprise-form-state--readonly]="state() === 'readonly'"
          [class.enterprise-form-state--archived]="state() === 'archived'"
          [class.enterprise-form-state--draft]="state() === 'draft'"
          [class.enterprise-form-state--saving]="state() === 'saving'"
        >
          @if (state() === 'draft') {
            <app-information-alert message="Draft — changes are not published yet." />
          }
          @if (state() === 'archived') {
            <app-information-alert message="Archived — this record is read-only." />
          }
          @if (state() === 'saving') {
            <app-enterprise-loading-overlay [visible]="true" label="Saving…" />
          }
          <ng-content />
        </div>
      }
    }
  `,
  styles: `
    .enterprise-form-state {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md);
    }
    .enterprise-form-state--readonly,
    .enterprise-form-state--archived {
      opacity: 0.98;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseFormStateComponent {
  readonly state = input<EnterpriseFormLifecycleState>('idle');
  readonly skeletonFields = input(4);
  readonly errorMessage = input<string | undefined>(undefined);
  readonly permissionTitle = input('Permission denied');
  readonly permissionDescription = input<string | undefined>(undefined);
  readonly permissionActionLabel = input<string | undefined>(undefined);
  readonly permissionAction = output<MouseEvent>();
}
