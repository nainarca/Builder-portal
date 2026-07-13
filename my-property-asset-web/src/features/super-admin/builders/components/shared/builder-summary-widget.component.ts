import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BuilderAdminRecord } from '../../models/builder-admin.model';
import { BuilderAvatarComponent } from './builder-avatar.component';
import { BuilderStatusBadgeComponent } from './builder-status-badge.component';

@Component({
  selector: 'app-bldr-summary-widget',
  imports: [RouterLink, BuilderAvatarComponent, BuilderStatusBadgeComponent],
  template: `
    <article class="bldr-summary-widget">
      <app-bldr-avatar [name]="builder().companyName" [logoUrl]="builder().logoUrl"
        [primaryColor]="builder().primaryColor ?? '#1B4D89'" />
      <div class="bldr-summary-widget__content">
        <h3 class="bldr-summary-widget__name">
          <a [routerLink]="['/super-admin/builders', builder().id]">{{ builder().companyName }}</a>
        </h3>
        <p class="bldr-summary-widget__meta">{{ builder().projectCount }} projects</p>
        <app-bldr-status-badge [status]="builder().status" />
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderSummaryWidgetComponent {
  readonly builder = input.required<BuilderAdminRecord>();
}
