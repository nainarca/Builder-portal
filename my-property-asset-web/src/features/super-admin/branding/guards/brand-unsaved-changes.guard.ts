import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

import { UiDialogService } from '@shared/ui';

import { BrandStudioStateService } from '../services/brand-studio-state.service';

export const brandUnsavedChangesGuard: CanDeactivateFn<unknown> = async () => {
  const studio = inject(BrandStudioStateService, { optional: true });
  const dialog = inject(UiDialogService);
  if (!studio?.hasUnsavedChanges()) return true;
  return dialog.confirm({
    title: 'Unsaved brand changes',
    message: 'You have unsaved branding changes. Leave without saving?',
    acceptLabel: 'Leave',
    rejectLabel: 'Stay',
    acceptSeverity: 'danger',
  });
};
