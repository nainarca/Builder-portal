import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PrintService {
  print(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
