import { Injectable } from '@angular/core';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  touchEnabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class DeviceDetectionService {
  detect(): DeviceInfo {
    if (typeof window === 'undefined') {
      return { isMobile: false, isTablet: false, isDesktop: true, touchEnabled: false };
    }

    const width = window.innerWidth;
    const touchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return {
      isMobile: width < 640,
      isTablet: width >= 640 && width < 1024,
      isDesktop: width >= 1024,
      touchEnabled,
    };
  }
}
