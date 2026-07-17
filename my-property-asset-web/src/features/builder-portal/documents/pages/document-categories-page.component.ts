import { BuilderPortalPageComponent } from '../../components/layout';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { EnterpriseFormPageHeaderComponent } from '@shared/ui';

import { CategoryGridComponent } from '../components/category';
import { DocumentStoreService } from '../services/document-store.service';

@Component({
  selector: 'app-document-categories-page',
  imports: [ BuilderPortalPageComponent,EnterpriseFormPageHeaderComponent, CategoryGridComponent],
  template: `
    <app-bp-page>
      <div class="doc-page">
        <app-enterprise-form-page-header
          eyebrow="Document management"
          title="Categories"
          subtitle="Browse documents by category across every project and unit."
          mode="view"
        />
        <app-category-grid [stats]="stats()" />
      </div>
    </app-bp-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCategoriesPageComponent {
  private readonly store = inject(DocumentStoreService);

  readonly stats = computed(() => this.store.getCategoryStats());
}
