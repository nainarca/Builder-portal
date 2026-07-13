import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-sa-dashboard-footer',
  template: `
    <footer class="sa-dashboard-footer">
      <span>{{ leftText() }}</span>
      @if (lastRefreshed()) {
        <span>Last refreshed: {{ lastRefreshed() }}</span>
      }
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardFooterComponent {
  readonly leftText = input('MyPropertyAsset Super Admin');
  readonly lastRefreshed = input<string | undefined>(undefined);
}
