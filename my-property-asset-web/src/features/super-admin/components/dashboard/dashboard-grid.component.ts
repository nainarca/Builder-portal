import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sa-dashboard-grid',
  template: `<div class="sa-dashboard-grid" role="region" aria-label="Dashboard widgets"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardGridComponent {}
