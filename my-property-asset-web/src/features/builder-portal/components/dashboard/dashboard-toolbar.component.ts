import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-bp-dashboard-toolbar',
  template: `
    <div class="bp-dashboard-toolbar" role="toolbar" aria-label="Dashboard toolbar">
      <div class="bp-dashboard-toolbar__start">
        <ng-content select="[toolbarStart]" />
      </div>
      <div class="bp-dashboard-toolbar__end">
        <ng-content select="[toolbarEnd]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardToolbarComponent {}
