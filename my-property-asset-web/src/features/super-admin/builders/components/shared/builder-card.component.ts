import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BuilderAdminRecord } from '../../models/builder-admin.model';
import { BuilderAvatarComponent } from './builder-avatar.component';
import { BuilderStatusBadgeComponent } from './builder-status-badge.component';

@Component({
  selector: 'app-bldr-card',
  imports: [RouterLink, BuilderAvatarComponent, BuilderStatusBadgeComponent],
  template: `
    <article class="bldr-card">
      <a class="bldr-card__link" [routerLink]="['/super-admin/builders', builder().id]">
        <app-bldr-avatar [name]="builder().companyName" [logoUrl]="builder().logoUrl"
          [primaryColor]="builder().primaryColor ?? '#1B4D89'" size="lg" />
        <div class="bldr-card__content">
          <h3 class="bldr-card__name">{{ builder().companyName }}</h3>
          <p class="bldr-card__meta">{{ builder().region }} · {{ builder().projectCount }} projects</p>
        </div>
        <app-bldr-status-badge [status]="builder().status" />
      </a>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderCardComponent {
  readonly builder = input.required<BuilderAdminRecord>();
}
