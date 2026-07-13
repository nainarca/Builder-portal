import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { SettingsNavigationStateService } from '../../services/settings-navigation-state.service';
import { SettingsNavItem } from '../../models/settings-admin.model';
import { CfgCategoryCardComponent } from './cfg-settings-card.component';

@Component({
  selector: 'app-cfg-category-grid',
  imports: [CfgCategoryCardComponent],
  template: `
    <section class="cfg-category-grid" aria-label="Settings categories">
      @for (category of categories; track category.id) {
        <app-cfg-category-card [item]="category" (activated)="openCategory($event)" />
      }
    </section>
  `,
  styles: `
    .cfg-category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgCategoryGridComponent {
  private readonly router = inject(Router);
  private readonly navState = inject(SettingsNavigationStateService);

  readonly categories = this.navState.categories;

  openCategory(category: SettingsNavItem): void {
    this.navState.setActiveCategory(category.id);
    void this.router.navigateByUrl(category.route);
  }
}
