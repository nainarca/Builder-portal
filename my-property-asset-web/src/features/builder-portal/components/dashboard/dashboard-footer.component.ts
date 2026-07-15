import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-bp-dashboard-footer',
  template: `
    <footer class="bp-dashboard-footer">
      <span>{{ leftText() }}</span>
      @if (lastRefreshed()) {
        <span>Last refreshed: {{ lastRefreshed() }}</span>
      }
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardFooterComponent {
  readonly leftText = input('MyPropertyAsset Builder Portal');
  readonly lastRefreshed = input<string | undefined>(undefined);
}
