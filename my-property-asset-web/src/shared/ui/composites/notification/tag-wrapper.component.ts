import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TagComponent } from '../../primitives/tag/tag.component';

@Component({
  selector: 'app-tag-wrapper',
  imports: [TagComponent],
  template: `<app-tag [value]="value()" [severity]="severity()" [icon]="icon()" [rounded]="rounded()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagWrapperComponent {
  readonly value = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly rounded = input(true);
  readonly severity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>(
    'secondary',
  );
}
