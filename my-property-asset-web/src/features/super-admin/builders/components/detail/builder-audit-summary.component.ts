import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { BuilderAuditRecord } from '../../models/builder-admin.model';

@Component({
  selector: 'app-bldr-audit-summary',
  imports: [DatePipe, ContentSectionComponent, SectionHeaderComponent],
  template: `
    <app-content-section>
      <app-section-header title="Audit summary" description="Administrative actions (framework)" />
      <ul class="bldr-audit-list">
        @for (item of items(); track item.id) {
          <li class="bldr-audit-list__item">
            <div><strong>{{ item.action }}</strong><p>{{ item.detail }}</p></div>
            <div class="bldr-audit-list__meta"><span>{{ item.actor }}</span><time>{{ item.timestamp | date: 'short' }}</time></div>
          </li>
        } @empty { <li>No audit entries.</li> }
      </ul>
    </app-content-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderAuditSummaryComponent {
  readonly items = input.required<readonly BuilderAuditRecord[]>();
}
