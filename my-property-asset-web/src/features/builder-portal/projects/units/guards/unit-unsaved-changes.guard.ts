import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

import { UiDialogService } from '@shared/ui';

import { UnitFormStateService } from '../services/unit-form-state.service';

export const unitUnsavedChangesGuard: CanDeactivateFn<unknown> = async () => {
  const formState = inject(UnitFormStateService, { optional: true });
  const dialog = inject(UiDialogService);

  if (!formState?.hasUnsavedChanges()) {
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
