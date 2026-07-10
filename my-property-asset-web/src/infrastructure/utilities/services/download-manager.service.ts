import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DownloadManagerService {
  downloadText(filename: string, content: string, mimeType = 'text/plain'): void {
    if (typeof document === 'undefined') {
      return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  downloadJson(filename: string, data: unknown): void {
    this.downloadText(filename, JSON.stringify(data, null, 2), 'application/json');
  }
}
