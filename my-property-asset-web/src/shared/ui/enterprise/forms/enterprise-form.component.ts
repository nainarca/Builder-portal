import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EnterpriseFormShellComponent } from './form-shell.component';
import type {
  EnterpriseFormLifecycleState,
  EnterpriseFormMode,
  ValidationIssue,
} from './models/enterprise-form.models';

/**
 * Enterprise Form — deliverable alias of the form shell (UI-IMP-05).
 * Prefer `app-enterprise-form-shell` or this selector interchangeably.
 */
@Component({
  selector: 'app-enterprise-form',
  imports: [EnterpriseFormShellComponent],
  template: `
    <app-enterprise-form-shell
      [title]="title()"
      [subtitle]="description() ?? subtitle()"
      [mode]="mode()"
      [state]="state()"
      [width]="width()"
      [statusLabel]="statusLabel()"
      [statusSeverity]="statusSeverity()"
      [validationIssues]="validationIssues()"
      [errorMessage]="errorMessage()"
      [showActions]="showActions()"
      [showSave]="showSave()"
      [showSaveAndContinue]="showSaveAndContinue()"
      [showSaveDraft]="showSaveDraft()"
      [showCancel]="showCancel()"
      [showDelete]="showDelete()"
      [showArchive]="showArchive()"
      [showReset]="showReset()"
      (save)="save.emit($event)"
      (saveAndContinue)="saveAndContinue.emit($event)"
      (saveDraft)="saveDraft.emit($event)"
      (cancel)="cancel.emit($event)"
      (delete)="delete.emit($event)"
      (archive)="archive.emit($event)"
      (reset)="reset.emit($event)"
    >
      <ng-content select="[formBreadcrumb]" formBreadcrumb />
      <ng-content select="[formHeaderActions]" formHeaderActions />
      <ng-content />
    </app-enterprise-form-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseFormComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
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
  readonly showReset = input(false);

  readonly save = output<MouseEvent>();
  readonly saveAndContinue = output<MouseEvent>();
  readonly saveDraft = output<MouseEvent>();
  readonly cancel = output<MouseEvent>();
  readonly delete = output<MouseEvent>();
  readonly archive = output<MouseEvent>();
  readonly reset = output<MouseEvent>();
}
