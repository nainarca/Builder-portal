import { Injectable } from '@angular/core';

export interface BrowserInfo {
  userAgent: string;
  isChrome: boolean;
  isFirefox: boolean;
  isSafari: boolean;
  isEdge: boolean;
}

@Injectable({ providedIn: 'root' })
export class BrowserDetectionService {
  detect(): BrowserInfo {
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    return {
      userAgent,
      isChrome: /Chrome/i.test(userAgent) && !/Edg/i.test(userAgent),
      isFirefox: /Firefox/i.test(userAgent),
      isSafari: /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent),
      isEdge: /Edg/i.test(userAgent),
    };
  }
}
