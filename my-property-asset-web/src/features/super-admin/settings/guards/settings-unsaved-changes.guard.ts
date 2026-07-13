import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

import { SettingsSectionStateService } from '../services/settings-section-state.service';

export const settingsUnsavedChangesGuard: CanDeactivateFn<unknown> = () => {
  const state = inject(SettingsSectionStateService, { optional: true });
  if (!state?.dirty()) return true;
  return window.confirm('You have unsaved settings changes. Leave without saving?');
};
