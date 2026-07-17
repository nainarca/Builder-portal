import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PageTitleComponent } from '../../composites/page/page-title.component';
import { PageSubtitleComponent } from '../../composites/page/page-subtitle.component';
import { PageToolbarComponent } from '../../composites/page/page-toolbar.component';
import { SectionHeaderComponent } from '../../composites/page/section-header.component';

@Component({
  selector: 'app-enterprise-section-header',
  imports: [SectionHeaderComponent],
  template: `
    <app-section-header [title]="title()" [description]="description()">
      <ng-content />
    </app-section-header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseSectionHeaderComponent {
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-section-divider',
  template: `<hr class="enterprise-section-divider" [attr.aria-hidden]="decorative() ? 'true' : null" />`,
  styles: `
    .enterprise-section-divider {
      margin: var(--mpa-spacing-lg) 0;
      border: 0;
      border-top: 1px solid var(--mpa-color-border);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionDividerComponent {
  readonly decorative = input(true);
}

@Component({
  selector: 'app-sticky-action-bar',
  template: `
    <div class="enterprise-sticky-action-bar" role="region" [attr.aria-label]="ariaLabel()">
      <div class="enterprise-sticky-action-bar__leading">
        <ng-content select="[stickyLeading]" />
      </div>
      <div class="enterprise-sticky-action-bar__actions">
        <ng-content select="[stickyActions]" />
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .enterprise-sticky-action-bar {
      position: sticky;
      bottom: 0;
      z-index: var(--mpa-z-index-sticky, 100);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-md);
      background: var(--mpa-color-surface-elevated, var(--mpa-color-surface));
      border-top: 1px solid var(--mpa-color-border);
      box-shadow: 0 -4px 16px rgb(15 23 42 / 6%);
    }
    .enterprise-sticky-action-bar__leading,
    .enterprise-sticky-action-bar__actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--mpa-spacing-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StickyActionBarComponent {
  readonly ariaLabel = input('Page actions');
}

@Component({
  selector: 'app-enterprise-page-title',
  imports: [PageTitleComponent],
  template: `<app-page-title [text]="text()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterprisePageTitleComponent {
  readonly text = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-enterprise-page-description',
  imports: [PageSubtitleComponent],
  template: `<app-page-subtitle [text]="text()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterprisePageDescriptionComponent {
  readonly text = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-enterprise-toolbar',
  imports: [PageToolbarComponent],
  template: `
    <app-page-toolbar>
      <ng-content />
    </app-page-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseToolbarComponent {}
