import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { NavigationContextType } from '../models';
import { NavigationService } from '../services';

export interface NavigationResolverData {
  navigationContext: NavigationContextType;
}

export const navigationResolver: ResolveFn<NavigationResolverData> = (route) => {
  const navigationContext =
    (route.data['navigationContext'] as NavigationContextType | undefined) ?? 'public-website';

  inject(NavigationService).setContext(navigationContext);

  return { navigationContext };
};
