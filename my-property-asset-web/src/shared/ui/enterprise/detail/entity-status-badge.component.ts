import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StatusBadgeComponent } from '../../composites/notification/status-badge.component';

/** Entity status badge — semantic status chip for detail heroes (never plain text). */
@Component({
  selector: 'app-entity-status-badge',
  imports: [StatusBadgeComponent],
  template: `
    <app-status-badge [label]="label()" [severity]="severity()" [icon]="icon()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityStatusBadgeComponent {
  readonly label = input.required<string>();
  readonly severity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>(
    'secondary',
  );
  readonly icon = input<string | undefined>(undefined);
}
