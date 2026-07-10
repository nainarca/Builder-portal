import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TagComponent } from '../../primitives/tag/tag.component';

@Component({
  selector: 'app-status-badge',
  imports: [TagComponent],
  template: `<app-tag [value]="label()" [severity]="severity()" [rounded]="true" [icon]="icon()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadgeComponent {
  readonly label = input.required<string>();
  readonly severity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>(
    'secondary',
  );
  readonly icon = input<string | undefined>(undefined);
}
