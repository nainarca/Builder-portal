import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EnterpriseButtonComponent } from '../buttons/enterprise-button.component';
import { StickyActionBarComponent } from '../section/enterprise-section.component';
import { ValidationSummaryComponent } from '../../composites/forms/validation-summary.component';
import { ValidationIssue } from './models/enterprise-form.models';

/**
 * DS-04 Sticky form actions — Save / Save & Continue / Draft / Cancel / Delete / Archive.
 */
@Component({
  selector: 'app-enterprise-form-actions',
  imports: [StickyActionBarComponent, EnterpriseButtonComponent],
  template: `
    <app-sticky-action-bar [ariaLabel]="ariaLabel()">
      <div stickyLeading>
        <ng-content select="[formActionsLeading]" />
        @if (showDelete()) {
          <app-enterprise-button
            variant="danger"
            [label]="deleteLabel()"
            [disabled]="disabled() || saving()"
            (clicked)="delete.emit($event)"
          />
        }
        @if (showArchive()) {
          <app-enterprise-button
            variant="outline"
            [label]="archiveLabel()"
            [disabled]="disabled() || saving()"
            (clicked)="archive.emit($event)"
          />
        }
      </div>

      <div stickyActions class="enterprise-form-actions__primary">
        @if (showCancel()) {
          <app-enterprise-button
            variant="ghost"
            [label]="cancelLabel()"
            [disabled]="saving()"
            (clicked)="cancel.emit($event)"
          />
        }
        @if (showReset()) {
          <app-enterprise-button
            variant="ghost"
            [label]="resetLabel()"
            [disabled]="disabled() || saving()"
            (clicked)="reset.emit($event)"
          />
        }
        @if (showSaveDraft()) {
          <app-enterprise-button
            variant="outline"
            [label]="saveDraftLabel()"
            [loading]="savingDraft()"
            [disabled]="disabled() || saving()"
            (clicked)="saveDraft.emit($event)"
          />
        }
        @if (showSaveAndContinue()) {
          <app-enterprise-button
            variant="secondary"
            [label]="saveAndContinueLabel()"
            [loading]="saving()"
            [disabled]="disabled()"
            (clicked)="saveAndContinue.emit($event)"
          />
        }
        @if (showSave()) {
          <app-enterprise-button
            variant="primary"
            [label]="saveLabel()"
            [loading]="saving()"
            [disabled]="disabled()"
            (clicked)="save.emit($event)"
          />
        }
        <ng-content />
      </div>
    </app-sticky-action-bar>
  `,
  styles: `
    .enterprise-form-actions__primary {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--mpa-spacing-sm);
      justify-content: flex-end;
    }
    @media (max-width: 639px) {
      .enterprise-form-actions__primary {
        width: 100%;
      }
      .enterprise-form-actions__primary > :last-child {
        flex: 1 1 100%;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseFormActionsComponent {
  readonly ariaLabel = input('Form actions');
  readonly disabled = input(false);
  readonly saving = input(false);
  readonly savingDraft = input(false);

  readonly showSave = input(true);
  readonly showSaveAndContinue = input(false);
  readonly showSaveDraft = input(false);
  readonly showCancel = input(true);
  readonly showDelete = input(false);
  readonly showArchive = input(false);
  readonly showReset = input(false);

  readonly saveLabel = input('Save');
  readonly saveAndContinueLabel = input('Save & Continue');
  readonly saveDraftLabel = input('Save Draft');
  readonly cancelLabel = input('Cancel');
  readonly deleteLabel = input('Delete');
  readonly archiveLabel = input('Archive');
  readonly resetLabel = input('Reset');

  readonly save = output<MouseEvent>();
  readonly saveAndContinue = output<MouseEvent>();
  readonly saveDraft = output<MouseEvent>();
  readonly cancel = output<MouseEvent>();
  readonly delete = output<MouseEvent>();
  readonly archive = output<MouseEvent>();
  readonly reset = output<MouseEvent>();
}

@Component({
  selector: 'app-enterprise-validation-summary',
  imports: [ValidationSummaryComponent],
  template: `
    <app-validation-summary [title]="title()" [issues]="issues()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseValidationSummaryComponent {
  readonly title = input('Please correct the following:');
  readonly issues = input<ValidationIssue[]>([]);
}
