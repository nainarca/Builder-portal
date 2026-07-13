import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import { InputTextComponent } from '@shared/ui';

@Component({
  selector: 'app-support-search-bar',
  imports: [InputTextComponent],
  templateUrl: './support-search-bar.component.html',
  styleUrl: './support-search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportSearchBarComponent {
  readonly placeholder = input('Search articles, topics, and questions…');
  readonly ariaLabel = input('Search');
  readonly query = model('');
}
