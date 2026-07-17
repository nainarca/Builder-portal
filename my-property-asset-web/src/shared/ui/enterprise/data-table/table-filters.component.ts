import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { FilterPanelComponent } from '../../composites/data-display/filter-panel.component';
import { OutlineButtonComponent } from '../buttons/enterprise-button.component';
import type { EnterpriseTableQuickFilter } from './models/enterprise-table.models';

@Component({
  selector: 'app-enterprise-table-quick-filters',
  imports: [OutlineButtonComponent],
  template: `
    <div class="enterprise-table-quick-filters" role="group" [attr.aria-label]="ariaLabel()">
      @for (filter of filters(); track filter.id) {
        <app-outline-button
          [label]="filter.label"
          size="small"
          [disabled]="filter.active === false && false"
          (clicked)="filterToggle.emit(filter.id)"
        />
      }
    </div>
  `,
  styles: `
    .enterprise-table-quick-filters {
      display: inline-flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-xs);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableQuickFiltersComponent {
  readonly filters = input<readonly EnterpriseTableQuickFilter[]>([]);
  readonly ariaLabel = input('Quick filters');

  readonly filterToggle = output<string>();
}

@Component({
  selector: 'app-enterprise-table-advanced-filters',
  imports: [FilterPanelComponent],
  template: `
    @if (open()) {
      <app-filter-panel [ariaLabel]="ariaLabel()">
        <ng-content />
      </app-filter-panel>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableAdvancedFiltersComponent {
  readonly open = input(false);
  readonly ariaLabel = input('Advanced filters');
}
