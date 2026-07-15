import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BasePageComponent, PageHeaderComponent } from '@shared/ui';

import { CategoryGridComponent } from '../components/category';
import { DocumentStoreService } from '../services/document-store.service';

@Component({
  selector: 'app-document-categories-page',
  imports: [BasePageComponent, PageHeaderComponent, CategoryGridComponent],
  template: `
    <app-base-page>
      <div class="doc-page">
        <app-page-header
          eyebrow="Document management"
          title="Categories"
          description="Browse documents by category across every project and unit."
        />
        <app-category-grid [stats]="stats()" />
      </div>
    </app-base-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCategoriesPageComponent {
  private readonly store = inject(DocumentStoreService);

  readonly stats = computed(() => this.store.getCategoryStats());
}
