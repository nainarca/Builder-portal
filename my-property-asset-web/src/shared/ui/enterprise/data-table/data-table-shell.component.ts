import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EnterpriseTableToolbarComponent } from './table-toolbar.component';
import { EnterpriseTableBulkActionsComponent } from './table-bulk-actions.component';
import { EnterpriseTableFilterBarComponent } from './table-filter-bar.component';
import { EnterpriseTableAdvancedFiltersComponent } from './table-filters.component';
import { EnterpriseTableEmptyComponent } from './table-empty.component';
import { EnterpriseTableLoadingComponent } from './table-loading.component';
import { EnterpriseTablePaginationComponent } from './table-pagination.component';
import type {
  EnterpriseTableBulkAction,
  EnterpriseTableColumnDef,
  EnterpriseTableEmptyVariant,
  EnterpriseTableFilterChip,
  EnterpriseTableLifecycleState,
  EnterpriseTablePaginationState,
  EnterpriseTableQuickFilter,
  EnterpriseTableSavedSearch,
  EnterpriseTableSecondaryAction,
  EnterpriseTableViewMode,
  TableDensity,
} from './models/enterprise-table.models';
import type { SortOption } from '../../composites/data-display/sort-control.component';

/**
 * DS-05 Data Table Shell — composes toolbar, filters, bulk bar, table region, pagination.
 * Presentation framework only; modules supply data + column templates via projection.
 */
@Component({
  selector: 'app-enterprise-data-table-shell',
  imports: [
    EnterpriseTableToolbarComponent,
    EnterpriseTableBulkActionsComponent,
    EnterpriseTableFilterBarComponent,
    EnterpriseTableAdvancedFiltersComponent,
    EnterpriseTableEmptyComponent,
    EnterpriseTableLoadingComponent,
    EnterpriseTablePaginationComponent,
  ],
  template: `
    <div class="enterprise-data-table-shell">
      @if (selectedCount() > 0) {
        <app-enterprise-table-bulk-actions
          [selectedCount]="selectedCount()"
          [totalCount]="totalCount()"
          [actions]="bulkActions()"
          (actionClick)="bulkAction.emit($event)"
          (clearSelection)="clearSelection.emit()"
        />
      } @else {
        <app-enterprise-table-toolbar
          [searchValue]="searchValue()"
          [searchPlaceholder]="searchPlaceholder()"
          [searchDebounceMs]="searchDebounceMs()"
          [showSearch]="showSearch()"
          [quickFilters]="quickFilters()"
          [showSavedSearches]="showSavedSearches()"
          [savedSearches]="savedSearches()"
          [sortOptions]="sortOptions()"
          [sortValue]="sortValue()"
          [viewMode]="viewMode()"
          [showViewToggle]="showViewToggle()"
          [density]="density()"
          [showDensity]="showDensity()"
          [columns]="columns()"
          [showColumnSelector]="showColumnSelector()"
          [showExport]="showExport()"
          [exportLoading]="exportLoading()"
          [exportDisabled]="exportDisabled()"
          [secondaryActions]="secondaryActions()"
          (searchChange)="searchChange.emit($event)"
          (quickFilterToggle)="quickFilterToggle.emit($event)"
          (savedSearchSelect)="savedSearchSelect.emit($event)"
          (saveSearch)="saveSearch.emit()"
          (sortChange)="sortChange.emit($event)"
          (viewModeChange)="viewModeChange.emit($event)"
          (densityChange)="densityChange.emit($event)"
          (columnsChange)="columnsChange.emit($event)"
          (exportClick)="exportClick.emit($event)"
          (secondaryAction)="secondaryAction.emit($event)"
        >
          <ng-content select="[toolbarStart]" />
          <ng-content select="[toolbarEnd]" />
        </app-enterprise-table-toolbar>
      }

      <app-enterprise-table-filter-bar
        [chips]="filterChips()"
        [resultSummary]="resultSummary()"
        (chipRemove)="filterChipRemove.emit($event)"
        (clearAll)="clearFilters.emit()"
      />

      <app-enterprise-table-advanced-filters [open]="advancedFiltersOpen()">
        <ng-content select="[advancedFilters]" />
      </app-enterprise-table-advanced-filters>

      <div
        class="enterprise-data-table-shell__body"
        [class.enterprise-data-table-shell__body--compact]="density() === 'compact'"
        [class.enterprise-data-table-shell__body--card]="viewMode() === 'card'"
        role="region"
        [attr.aria-label]="tableAriaLabel()"
        [attr.aria-busy]="state() === 'loading' || state() === 'refreshing' ? 'true' : null"
      >
        @if (state() === 'loading') {
          <app-enterprise-table-loading mode="skeleton" [skeletonRows]="skeletonRows()" />
        } @else if (state() === 'permission-denied') {
          <app-enterprise-table-empty variant="permission-denied" (action)="emptyAction.emit($event)" />
        } @else if (state() === 'error') {
          <app-enterprise-table-empty
            variant="error"
            [errorMessage]="errorMessage()"
            (action)="emptyAction.emit($event)"
          />
        } @else if (showEmpty()) {
          <app-enterprise-table-empty
            [variant]="emptyVariant()"
            [title]="emptyTitle()"
            [description]="emptyDescription()"
            [actionLabel]="emptyActionLabel()"
            (action)="emptyAction.emit($event)"
          />
        } @else {
          <div class="enterprise-data-table-shell__table-region">
            <ng-content select="[tableBody]" />
            @if (state() === 'refreshing') {
              <app-enterprise-table-loading mode="overlay" [label]="refreshLabel()" />
            }
          </div>
        }

        <ng-content select="[cardView]" />
      </div>

      @if (showPagination() && state() !== 'loading' && !showEmpty()) {
        <app-enterprise-table-pagination
          [pagination]="pagination()"
          [rowsPerPageOptions]="rowsPerPageOptions()"
          (pageChange)="pageChange.emit($event)"
        />
      }
    </div>
  `,
  styles: `
    .enterprise-data-table-shell {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md);
      width: 100%;
    }
    .enterprise-data-table-shell__body {
      position: relative;
      min-height: 8rem;
      animation: enterprise-table-view-fade var(--mpa-animation-duration-normal)
        var(--mpa-animation-easing-standard);
    }
    .enterprise-data-table-shell__body--compact {
      font-size: var(--mpa-font-size-sm);
    }
    .enterprise-data-table-shell__table-region {
      position: relative;
    }
    @keyframes enterprise-table-view-fade {
      from {
        opacity: 0.65;
      }
      to {
        opacity: 1;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDataTableShellComponent {
  readonly state = input<EnterpriseTableLifecycleState>('idle');
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
  readonly filterChips = input<readonly EnterpriseTableFilterChip[]>([]);
  readonly resultSummary = input<string | undefined>(undefined);
  readonly advancedFiltersOpen = input(false);
  readonly selectedCount = input(0);
  readonly totalCount = input(0);
  readonly bulkActions = input<readonly EnterpriseTableBulkAction[]>([]);
  readonly showEmpty = input(false);
  readonly emptyVariant = input<EnterpriseTableEmptyVariant>('no-data');
  readonly emptyTitle = input<string | undefined>(undefined);
  readonly emptyDescription = input<string | undefined>(undefined);
  readonly emptyActionLabel = input<string | undefined>(undefined);
  readonly errorMessage = input<string | undefined>(undefined);
  readonly showPagination = input(true);
  readonly pagination = input<EnterpriseTablePaginationState>({
    page: 1,
    pageSize: 10,
    totalRecords: 0,
    first: 0,
  });
  readonly rowsPerPageOptions = input<number[]>([10, 25, 50, 100]);
  readonly skeletonRows = input(5);
  readonly refreshLabel = input('Refreshing…');
  readonly tableAriaLabel = input('Data table');

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
  readonly filterChipRemove = output<string>();
  readonly clearFilters = output<void>();
  readonly bulkAction = output<string>();
  readonly clearSelection = output<void>();
  readonly pageChange = output<unknown>();
  readonly emptyAction = output<MouseEvent>();
}
