import { CanDeactivateFn } from '@angular/router';

export interface BuildingUnsavedChangesHost {
  hasUnsavedChanges(): boolean;
}

export const buildingUnsavedChangesGuard: CanDeactivateFn<BuildingUnsavedChangesHost> = (
  component,
) => {
  if (!component.hasUnsavedChanges()) {
    return true;
  }
  return window.confirm('You have unsaved building changes. Leave this page?');
};
