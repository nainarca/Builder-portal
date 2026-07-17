import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EnterpriseFormPageHeaderComponent } from './form-page-header.component';
import { EnterpriseFormLayoutComponent } from './form-layout.component';
import {
  EnterpriseFormActionsComponent,
  EnterpriseValidationSummaryComponent,
} from './form-actions.component';
import { EnterpriseFormStateComponent } from './form-state.component';
import {
  EnterpriseFormLifecycleState,
  EnterpriseFormMode,
  ValidationIssue,
} from './models/enterprise-form.models';

/**
 * DS-04 Form Shell — composes header + layout + validation + sticky actions + state.
 * Presentation framework only; modules supply fields via content projection.
 */
@Component({
  selector: 'app-enterprise-form-shell',
  imports: [
    EnterpriseFormPageHeaderComponent,
    EnterpriseFormLayoutComponent,
    EnterpriseFormActionsComponent,
    EnterpriseFormStateComponent,
    EnterpriseValidationSummaryComponent,
  ],
  template: `
    <div class="enterprise-form-shell">
      <app-enterprise-form-page-header
        [title]="title()"
        [subtitle]="subtitle()"
        [mode]="mode()"
        [statusLabel]="statusLabel()"
        [statusSeverity]="statusSeverity()"
      >
        <div formBreadcrumb>
          <ng-content select="[formBreadcrumb]" />
        </div>
        <div formHeaderActions>
          <ng-content select="[formHeaderActions]" />
        </div>
      </app-enterprise-form-page-header>

      <app-enterprise-form-state [state]="state()" [errorMessage]="errorMessage()">
        <app-enterprise-validation-summary [issues]="validationIssues()" />

        <app-enterprise-form-layout
          [width]="width()"
          [readonly]="state() === 'readonly' || state() === 'archived' || mode() === 'view'"
        >
          <ng-content />
        </app-enterprise-form-layout>

        @if (
          showActions() &&
          mode() !== 'view' &&
          state() !== 'permission-denied' &&
          state() !== 'loading'
        ) {
          <app-enterprise-form-actions
            [saving]="state() === 'saving'"
            [showSave]="showSave()"
            [showSaveAndContinue]="showSaveAndContinue()"
            [showSaveDraft]="showSaveDraft()"
            [showCancel]="showCancel()"
            [showDelete]="showDelete()"
            [showArchive]="showArchive()"
            (save)="save.emit($event)"
            (saveAndContinue)="saveAndContinue.emit($event)"
            (saveDraft)="saveDraft.emit($event)"
            (cancel)="cancel.emit($event)"
            (delete)="delete.emit($event)"
            (archive)="archive.emit($event)"
          />
        }
      </app-enterprise-form-state>
    </div>
  `,
  styles: `
    .enterprise-form-shell {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md);
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseFormShellComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | undefined>(undefined);
  readonly mode = input<EnterpriseFormMode>('edit');
  readonly state = input<EnterpriseFormLifecycleState>('idle');
  readonly width = input<'default' | 'narrow' | 'wide' | 'fluid'>('default');
  readonly statusLabel = input<string | undefined>(undefined);
  readonly statusSeverity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>(
    'secondary',
  );
  readonly validationIssues = input<ValidationIssue[]>([]);
  readonly errorMessage = input<string | undefined>(undefined);

  readonly showActions = input(true);
  readonly showSave = input(true);
  readonly showSaveAndContinue = input(false);
  readonly showSaveDraft = input(false);
  readonly showCancel = input(true);
  readonly showDelete = input(false);
  readonly showArchive = input(false);

  readonly save = output<MouseEvent>();
  readonly saveAndContinue = output<MouseEvent>();
  readonly saveDraft = output<MouseEvent>();
  readonly cancel = output<MouseEvent>();
  readonly delete = output<MouseEvent>();
  readonly archive = output<MouseEvent>();
}
