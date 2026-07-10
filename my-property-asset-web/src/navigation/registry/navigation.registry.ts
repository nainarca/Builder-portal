import { Injectable } from '@angular/core';

import { NAVIGATION_CONFIGURATIONS } from '../config';
import { NavigationConfiguration, NavigationContextType, NavigationZone } from '../models';

@Injectable({ providedIn: 'root' })
export class NavigationRegistry {
  private readonly configurations = new Map<NavigationContextType, NavigationConfiguration>();

  constructor() {
    for (const configuration of NAVIGATION_CONFIGURATIONS) {
      this.configurations.set(configuration.context, configuration);
    }
  }

  register(configuration: NavigationConfiguration): void {
    this.configurations.set(configuration.context, configuration);
  }

  get(context: NavigationContextType): NavigationConfiguration | undefined {
    return this.configurations.get(context);
  }

  getSection(context: NavigationContextType, zone: NavigationZone) {
    const configuration = this.get(context);

    if (!configuration) {
      return undefined;
    }

    switch (zone) {
      case 'top':
        return configuration.topNav;
      case 'sidebar':
        return configuration.sidebarNav;
      case 'context':
        return configuration.contextNav;
      case 'secondary':
        return configuration.secondaryNav;
      case 'footer':
        return configuration.footerNav;
      case 'user':
        return configuration.userNav;
      case 'quickActions':
        return configuration.quickActions;
      case 'favorites':
        return configuration.favorites;
      case 'recentItems':
        return configuration.recentItems;
      default:
        return undefined;
    }
  }

  listContexts(): NavigationContextType[] {
    return [...this.configurations.keys()];
  }
}
