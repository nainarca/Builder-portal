import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Badge } from 'primeng/badge';

@Component({
  selector: 'app-badge',
  imports: [Badge],
  template: `<p-badge [value]="value()" [severity]="severity()" [size]="size()" />`,
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly value = input<string | number | undefined>(undefined);
  readonly severity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>(
    'secondary',
  );
  readonly size = input<'small' | 'large' | 'xlarge' | undefined>(undefined);
}
