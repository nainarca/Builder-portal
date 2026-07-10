import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-tag',
  imports: [Tag],
  template: `<p-tag [value]="value()" [severity]="severity()" [icon]="icon()" [rounded]="rounded()" />`,
  styleUrl: './tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  readonly value = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly rounded = input(false);
  readonly severity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>(
    'secondary',
  );
}
