import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

import { UiDialogService } from '@shared/ui';

import { OwnerAssignmentFormStateService } from '../services/owner-assignment-form-state.service';
import { OwnerFormStateService } from '../services/owner-form-state.service';

export const ownerUnsavedChangesGuard: CanDeactivateFn<unknown> = async () => {
  const profileForm = inject(OwnerFormStateService, { optional: true });
  const assignmentForm = inject(OwnerAssignmentFormStateService, { optional: true });
  const dialog = inject(UiDialogService);

  const hasUnsavedChanges = profileForm?.hasUnsavedChanges() || assignmentForm?.hasUnsavedChanges();
  if (!hasUnsavedChanges) {
    return true;
  }

  return dialog.confirm({
    title: 'Unsaved changes',
    message: 'You have unsaved changes. Leave without saving?',
    acceptLabel: 'Leave',
    rejectLabel: 'Stay',
    acceptSeverity: 'danger',
  });
};
