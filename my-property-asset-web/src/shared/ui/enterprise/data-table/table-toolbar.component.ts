import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { TableToolbarComponent } from '../../composites/data-display/table-toolbar.component';
import { ExportButtonComponent } from '../../composites/data-display/export-button.component';
import { SortControlComponent } from '../../composites/data-display/sort-control.component';
import { EnterpriseTableSearchComponent } from './table-search.component';
import { EnterpriseTableQuickFiltersComponent } from './table-filters.component';
import { EnterpriseTableDensityControlComponent } from './table-density-control.component';
import { EnterpriseTableColumnSelectorComponent } from './table-column-selector.component';
import { EnterpriseTableViewToggleComponent } from './table-view-toggle.component';
import { EnterpriseTableSavedSearchesComponent } from './table-saved-searches.component';
import { EnterpriseTableOverflowMenuComponent } from './table-overflow-menu.component';
import type {
  EnterpriseTableColumnDef,
  EnterpriseTableQuickFilter,
  EnterpriseTableSavedSearch,
  EnterpriseTableSecondaryAction,
  EnterpriseTableViewMode,
  TableDensity,
} from './models/enterprise-table.models';
import type { SortOption } from '../../composites/data-display/sort-control.component';

/**
 * DS-05 Table Toolbar — P0.1 §6.1 search leading, filters adjacent, density/columns trailing.
 * Secondary actions live in overflow (UI-REBIRTH §6 — one primary action on the page header).
 */
@Component({
  selector: 'app-enterprise-table-toolbar',
  imports: [
    TableToolbarComponent,
    EnterpriseTableSearchComponent,
    EnterpriseTableQuickFiltersComponent,
    EnterpriseTableDensityControlComponent,
    EnterpriseTableColumnSelectorComponent,
    EnterpriseTableViewToggleComponent,
    EnterpriseTableSavedSearchesComponent,
    EnterpriseTableOverflowMenuComponent,
    ExportButtonComponent,
    SortControlComponent,
  ],
  template: `
    <app-table-toolbar>
      <div toolbarStart class="enterprise-table-toolbar__start">
        @if (showSearch()) {
          <app-enterprise-table-search
            [value]="searchValue()"
            [placeholder]="searchPlaceholder()"
            [debounceMs]="searchDebounceMs()"
            (searchChange)="searchChange.emit($event)"
          />
        }
        @if (quickFilters().length > 0) {
          <app-enterprise-table-quick-filters
            [filters]="quickFilters()"
            (filterToggle)="quickFilterToggle.emit($event)"
          />
        }
        @if (showSavedSearches()) {
          <app-enterprise-table-saved-searches
            [searches]="savedSearches()"
            (searchSelect)="savedSearchSelect.emit($event)"
            (saveSearch)="saveSearch.emit()"
          />
        }
        <ng-content select="[toolbarStart]" />
      </div>
      <div toolbarEnd class="enterprise-table-toolbar__end">
        @if (sortOptions().length > 0) {
          <app-sort-control
            [options]="sortOptions()"
            [value]="sortValue()"
            (sortChange)="sortChange.emit($event)"
          />
        }
        @if (showViewToggle()) {
          <app-enterprise-table-view-toggle
            [mode]="viewMode()"
            (modeChange)="viewModeChange.emit($event)"
          />
        }
        @if (showDensity()) {
          <app-enterprise-table-density-control
            [density]="density()"
            (densityChange)="densityChange.emit($event)"
          />
        }
        @if (showColumnSelector()) {
          <app-enterprise-table-column-selector
            [columns]="columns()"
            (columnsChange)="columnsChange.emit($event)"
          />
        }
        @if (showExport()) {
          <app-export-button
            [loading]="exportLoading()"
            [disabled]="exportDisabled()"
            (exportClick)="exportClick.emit($event)"
          />
        }
        @if (secondaryActions().length > 0) {
          <app-enterprise-table-overflow-menu
            [actions]="secondaryActions()"
            (actionClick)="secondaryAction.emit($event)"
          />
        }
        <ng-content select="[toolbarEnd]" />
      </div>
    </app-table-toolbar>
  `,
  styles: `
    .enterprise-table-toolbar__start,
    .enterprise-table-toolbar__end {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--mpa-spacing-sm);
    }
    @media (max-width: 640px) {
      .enterprise-table-toolbar__start,
      .enterprise-table-toolbar__end {
        width: 100%;
      }
      .enterprise-table-toolbar__end {
        justify-content: flex-end;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableToolbarComponent {
  readonly searchValue = input('');
  readonly searchPlaceholder = input('Search');
  readonly searchDebounceMs = input(300);
  readonly showSearch = input(true);
  readonly quickFilters = input<readonly EnterpriseTableQuickFilter[]>([]);
  readonly showSavedSearches = input(false);
  readonly savedSearches = input<readonly EnterpriseTableSavedSearch[]>([]);
  readonly sortOptions = input<readonly SortOption[]>([]);
  readonly sortValue = input<string | null>(null);
  readonly viewMode = input<EnterpriseTableViewMode>('table');
  readonly showViewToggle = input(false);
  readonly density = input<TableDensity>('comfortable');
  readonly showDensity = input(true);
  readonly columns = input<readonly EnterpriseTableColumnDef[]>([]);
  readonly showColumnSelector = input(true);
  readonly showExport = input(true);
  readonly exportLoading = input(false);
  readonly exportDisabled = input(false);
  readonly secondaryActions = input<readonly EnterpriseTableSecondaryAction[]>([]);

  readonly searchChange = output<string>();
  readonly quickFilterToggle = output<string>();
  readonly savedSearchSelect = output<string>();
  readonly saveSearch = output<void>();
  readonly sortChange = output<string>();
  readonly viewModeChange = output<EnterpriseTableViewMode>();
  readonly densityChange = output<TableDensity>();
  readonly columnsChange = output<readonly EnterpriseTableColumnDef[]>();
  readonly exportClick = output<MouseEvent>();
  readonly secondaryAction = output<string>();
}
