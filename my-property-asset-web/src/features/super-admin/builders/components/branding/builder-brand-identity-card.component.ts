import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { BuilderAdminRecord } from '../../models/builder-admin.model';
import { BuilderAvatarComponent } from '../shared/builder-avatar.component';
import { BuilderStatusBadgeComponent } from '../shared/builder-status-badge.component';

@Component({
  selector: 'app-bldr-brand-identity-card',
  imports: [BuilderAvatarComponent, BuilderStatusBadgeComponent],
  template: `
    <article class="bldr-identity-card">
      <app-bldr-avatar [name]="builder().companyName" [logoUrl]="builder().logoUrl" [primaryColor]="builder().primaryColor ?? '#1B4D89'" size="lg" />
      <div>
        <h3 class="bldr-identity-card__name">{{ builder().companyName }}</h3>
        <p class="bldr-identity-card__meta">{{ builder().plan }} · {{ builder().region }}</p>
        <app-bldr-status-badge [status]="builder().status" />
        <p class="bldr-identity-card__colors">Primary {{ builder().primaryColor }} · Secondary {{ builder().secondaryColor }}</p>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderBrandIdentityCardComponent {
  readonly builder = input.required<BuilderAdminRecord>();
}
