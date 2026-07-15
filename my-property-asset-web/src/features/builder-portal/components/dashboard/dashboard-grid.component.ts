import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-bp-dashboard-grid',
  template: `<div class="bp-dashboard-grid" role="region" aria-label="Dashboard widgets"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardGridComponent {}
