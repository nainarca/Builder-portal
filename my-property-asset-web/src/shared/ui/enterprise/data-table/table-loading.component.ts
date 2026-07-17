import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SkeletonTableComponent, EnterpriseLoadingOverlayComponent, EnterpriseSpinnerComponent } from '../loading/enterprise-loading.component';

@Component({
  selector: 'app-enterprise-table-loading',
  imports: [SkeletonTableComponent, EnterpriseLoadingOverlayComponent, EnterpriseSpinnerComponent],
  template: `
    @if (mode() === 'skeleton') {
      <app-skeleton-table [rowCount]="skeletonRows()" />
    } @else if (mode() === 'overlay') {
      <app-enterprise-loading-overlay [visible]="true" [label]="label()" />
    } @else {
      <div class="enterprise-table-loading__progress" role="status" [attr.aria-label]="label()">
        <app-enterprise-spinner [ariaLabel]="label()" />
        <span>{{ label() }}</span>
      </div>
    }
  `,
  styles: `
    .enterprise-table-loading__progress {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-xl);
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableLoadingComponent {
  readonly mode = input<'skeleton' | 'overlay' | 'progress'>('skeleton');
  readonly skeletonRows = input(5);
  readonly label = input('Loading table…');
}
