import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

import { BillingViewStateService } from '../services/billing-view-state.service';

export const billingUnsavedChangesGuard: CanDeactivateFn<unknown> = () => {
  const state = inject(BillingViewStateService, { optional: true });
  if (!state?.dirtyAddress()) return true;
  return window.confirm('You have unsaved billing address changes. Leave without saving?');
};
