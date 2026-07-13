import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TocItem } from '../../../models/support.model';

@Component({
  selector: 'app-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrl: './table-of-contents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableOfContentsComponent {
  readonly items = input.required<readonly TocItem[]>();
  readonly title = input('On this page');
  readonly activeId = input<string | undefined>(undefined);
}
