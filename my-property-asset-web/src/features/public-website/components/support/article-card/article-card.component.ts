import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HelpArticle } from '../../../models/support.model';

@Component({
  selector: 'app-article-card',
  imports: [RouterLink],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleCardComponent {
  readonly article = input.required<HelpArticle>();
  readonly compact = input(false);
}
