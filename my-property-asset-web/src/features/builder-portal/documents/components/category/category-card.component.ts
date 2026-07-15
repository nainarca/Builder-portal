import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CategoryStat } from '../../models/document.model';

@Component({
  selector: 'app-category-card',
  imports: [RouterLink],
  template: `
    <a class="category-card" [routerLink]="['/builder-portal/documents']" [queryParams]="{ category: stat().category }">
      <span class="category-card__icon"><i [class]="stat().icon" aria-hidden="true"></i></span>
      <p class="category-card__count">{{ stat().count }}</p>
      <p class="category-card__label">{{ stat().label }}</p>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCardComponent {
  readonly stat = input.required<CategoryStat>();
}
