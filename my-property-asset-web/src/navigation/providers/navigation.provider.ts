import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs';

import { NavigationEnd } from '@angular/router';

import { NavigationService } from '../services';

export function provideNavigation(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      const navigationService = inject(NavigationService);
      const router = inject(Router);

      router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        const root = router.routerState.snapshot.root;
        let route = root;

        while (route.firstChild) {
          route = route.firstChild;
        }

        const context = route.data['navigationContext'];

        if (context) {
          navigationService.setContext(context);
        }
      });
    }),
  ]);
}
