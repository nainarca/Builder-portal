import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CategoryStat } from '../../models/document.model';
import { CategoryCardComponent } from './category-card.component';

@Component({
  selector: 'app-category-grid',
  imports: [CategoryCardComponent],
  template: `
    <div class="category-grid">
      @for (stat of stats(); track stat.category) {
        <app-category-card [stat]="stat" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryGridComponent {
  readonly stats = input.required<readonly CategoryStat[]>();
}
