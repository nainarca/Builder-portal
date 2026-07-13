import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';

import { LegalSection, TocItem } from '../../../models/support.model';
import { TableOfContentsComponent } from '../table-of-contents/table-of-contents.component';
import { ReadingProgressBarComponent } from '../reading-progress-bar/reading-progress-bar.component';
import { BackToTopButtonComponent } from '../back-to-top-button/back-to-top-button.component';

@Component({
  selector: 'app-legal-document-layout',
  imports: [TableOfContentsComponent, ReadingProgressBarComponent, BackToTopButtonComponent],
  templateUrl: './legal-document-layout.component.html',
  styleUrl: './legal-document-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalDocumentLayoutComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly lastUpdated = input.required<string>();
  readonly sections = input.required<readonly LegalSection[]>();

  readonly activeSectionId = signal<string | undefined>(undefined);

  readonly tocItems = computed<readonly TocItem[]>(() =>
    this.sections().map((section) => ({
      id: section.id,
      label: section.heading,
      level: section.level,
    })),
  );

  constructor() {
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

          if (visible.length > 0) {
            this.activeSectionId.set(visible[0].target.id);
          }
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
      );

      this.sections().forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.observe(element);
        }
      });

      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
