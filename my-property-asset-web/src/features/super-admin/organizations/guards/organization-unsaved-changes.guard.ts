import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

import { OrganizationFormStateService } from '../services/organization-form-state.service';
import { UiDialogService } from '@shared/ui';

export const organizationUnsavedChangesGuard: CanDeactivateFn<unknown> = async () => {
  const formState = inject(OrganizationFormStateService, { optional: true });
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
