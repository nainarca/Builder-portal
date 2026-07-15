import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CheckboxComponent, FilterPanelComponent, SelectComponent, SelectOption } from '@shared/ui';

import { DOCUMENT_CATEGORY_OPTIONS, DOCUMENT_VISIBILITY_OPTIONS } from '../../config/documents.config';
import { DocumentCategory, DocumentVisibility } from '../../models/document.model';

interface ProjectOption {
  readonly id: string;
  readonly name: string;
}

@Component({
  selector: 'app-document-advanced-filters',
  imports: [FilterPanelComponent, SelectComponent, CheckboxComponent],
  template: `
    <app-filter-panel ariaLabel="Advanced document filters">
      <div class="doc-advanced-filters__field">
        <span>Project</span>
        <app-select [options]="projectOptions()" [value]="projectFilter()" ariaLabel="Project" (valueChange)="projectFilterChange.emit($event)" />
      </div>
      <div class="doc-advanced-filters__field">
        <span>Category</span>
        <app-select [options]="categoryOptions" [value]="categoryFilter()" ariaLabel="Category" (valueChange)="onCategoryChange($event)" />
      </div>
      <div class="doc-advanced-filters__field">
        <span>Visibility</span>
        <app-select [options]="visibilityOptions" [value]="visibilityFilter()" ariaLabel="Visibility" (valueChange)="onVisibilityChange($event)" />
      </div>
      <app-checkbox
        label="Include archived"
        [checked]="includeArchived()"
        (checkedChange)="includeArchivedChange.emit($event)"
      />
      <button type="button" class="doc-advanced-filters__reset" (click)="filtersReset.emit()">Reset filters</button>
    </app-filter-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentAdvancedFiltersComponent {
  readonly categoryFilter = input<DocumentCategory | 'all'>('all');
  readonly visibilityFilter = input<DocumentVisibility | 'all'>('all');
  readonly projectFilter = input('');
  readonly includeArchived = input(false);
  readonly projects = input<readonly ProjectOption[]>([]);

  readonly categoryFilterChange = output<DocumentCategory | 'all'>();
  readonly visibilityFilterChange = output<DocumentVisibility | 'all'>();
  readonly projectFilterChange = output<string>();
  readonly includeArchivedChange = output<boolean>();
  readonly filtersReset = output<void>();

  readonly categoryOptions: readonly SelectOption[] = DOCUMENT_CATEGORY_OPTIONS;
  readonly visibilityOptions: readonly SelectOption[] = DOCUMENT_VISIBILITY_OPTIONS;

  projectOptions(): readonly SelectOption[] {
    return [{ label: 'All projects', value: '' }, ...this.projects().map((p) => ({ label: p.name, value: p.id }))];
  }

  onCategoryChange(value: string): void {
    this.categoryFilterChange.emit(value as DocumentCategory | 'all');
  }

  onVisibilityChange(value: string): void {
    this.visibilityFilterChange.emit(value as DocumentVisibility | 'all');
  }
}
