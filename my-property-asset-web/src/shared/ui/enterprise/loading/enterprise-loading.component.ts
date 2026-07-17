import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SkeletonComponent } from '../../primitives/skeleton/skeleton.component';
import { SpinnerComponent } from '../../primitives/spinner/spinner.component';
import { LoadingOverlayComponent } from '../../composites/feedback/loading-overlay.component';
import { CardComponent } from '../../composites/cards/card.component';

@Component({
  selector: 'app-skeleton-card',
  imports: [CardComponent, SkeletonComponent],
  template: `
    <app-card variant="flat">
      <div class="enterprise-skeleton-card">
        <app-skeleton width="40%" height="0.75rem" />
        <app-skeleton width="70%" height="1.75rem" />
        <app-skeleton width="55%" height="0.75rem" />
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-skeleton-card { display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonCardComponent {}

@Component({
  selector: 'app-skeleton-table',
  imports: [SkeletonComponent],
  template: `
    <div class="enterprise-skeleton-table" role="status" aria-label="Loading table">
      <app-skeleton width="100%" height="2.5rem" />
      @for (_ of rows; track $index) {
        <app-skeleton width="100%" height="2rem" />
      }
    </div>
  `,
  styles: `
    .enterprise-skeleton-table { display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonTableComponent {
  readonly rowCount = input(5);
  get rows(): number[] {
    return Array.from({ length: this.rowCount() }, (_, i) => i);
  }
}

@Component({
  selector: 'app-skeleton-form',
  imports: [SkeletonComponent],
  template: `
    <div class="enterprise-skeleton-form" role="status" aria-label="Loading form">
      @for (_ of fields; track $index) {
        <div class="enterprise-skeleton-form__field">
          <app-skeleton width="30%" height="0.75rem" />
          <app-skeleton width="100%" height="2.5rem" />
        </div>
      }
      <app-skeleton width="8rem" height="2.5rem" />
    </div>
  `,
  styles: `
    .enterprise-skeleton-form { display: flex; flex-direction: column; gap: var(--mpa-spacing-md); max-width: 36rem; }
    .enterprise-skeleton-form__field { display: flex; flex-direction: column; gap: var(--mpa-spacing-xs); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonFormComponent {
  readonly fieldCount = input(4);
  get fields(): number[] {
    return Array.from({ length: this.fieldCount() }, (_, i) => i);
  }
}

@Component({
  selector: 'app-skeleton-dashboard',
  imports: [SkeletonCardComponent, SkeletonComponent],
  template: `
    <div class="enterprise-skeleton-dashboard" role="status" aria-label="Loading dashboard">
      <app-skeleton width="40%" height="1.75rem" />
      <div class="enterprise-skeleton-dashboard__kpis">
        @for (_ of [0, 1, 2, 3]; track $index) {
          <app-skeleton-card />
        }
      </div>
      <div class="enterprise-skeleton-dashboard__panels">
        <app-skeleton width="100%" height="12rem" />
        <app-skeleton width="100%" height="12rem" />
      </div>
    </div>
  `,
  styles: `
    .enterprise-skeleton-dashboard { display: flex; flex-direction: column; gap: var(--mpa-spacing-lg); }
    .enterprise-skeleton-dashboard__kpis {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: var(--mpa-spacing-md);
    }
    .enterprise-skeleton-dashboard__panels {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: var(--mpa-spacing-md);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonDashboardComponent {}

@Component({
  selector: 'app-enterprise-loading-overlay',
  imports: [LoadingOverlayComponent],
  template: `<app-loading-overlay [visible]="visible()" [label]="label()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseLoadingOverlayComponent {
  readonly visible = input(true);
  readonly label = input('Loading…');
}

@Component({
  selector: 'app-enterprise-spinner',
  imports: [SpinnerComponent],
  template: `<app-spinner [diameter]="diameter()" [strokeWidth]="strokeWidth()" [overlay]="overlay()" [ariaLabel]="ariaLabel()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseSpinnerComponent {
  readonly diameter = input('2.5rem');
  readonly strokeWidth = input('3');
  readonly overlay = input(false);
  readonly ariaLabel = input('Loading');
}
