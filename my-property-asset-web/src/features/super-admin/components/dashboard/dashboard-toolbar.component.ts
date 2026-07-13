import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sa-dashboard-toolbar',
  template: `
    <div class="sa-dashboard-toolbar" role="toolbar" aria-label="Dashboard toolbar">
      <div class="sa-dashboard-toolbar__start">
        <ng-content select="[toolbarStart]" />
      </div>
      <div class="sa-dashboard-toolbar__end">
        <ng-content select="[toolbarEnd]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardToolbarComponent {}
