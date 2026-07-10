import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MetaTagService {
  private readonly structuredDataIds = new Set<string>();

  setMeta(name: string, content: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    let element = document.querySelector(`meta[name="${name}"]`);

    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('name', name);
      document.head.appendChild(element);
    }

    element.setAttribute('content', content);
  }

  setProperty(property: string, content: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    let element = document.querySelector(`meta[property="${property}"]`);

    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('property', property);
      document.head.appendChild(element);
    }

    element.setAttribute('content', content);
  }

  setLink(rel: string, href: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    let element = document.querySelector(`link[rel="${rel}"]`);

    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }

    element.setAttribute('href', href);
  }

  setStructuredData(id: string, data: Record<string, unknown>): void {
    if (typeof document === 'undefined') {
      return;
    }

    const scriptId = `mpa-structured-data-${id}`;
    let element = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!element) {
      element = document.createElement('script');
      element.id = scriptId;
      element.type = 'application/ld+json';
      document.head.appendChild(element);
      this.structuredDataIds.add(scriptId);
    }

    element.textContent = JSON.stringify(data);
  }

  removeStructuredData(): void {
    if (typeof document === 'undefined') {
      return;
    }

    this.structuredDataIds.forEach((id) => {
      document.getElementById(id)?.remove();
    });
    this.structuredDataIds.clear();
  }

  setThemeColor(color: string): void {
    this.setMeta('theme-color', color);
  }
}
