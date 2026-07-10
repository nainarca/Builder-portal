import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-button',
  imports: [Button],
  template: `
    <p-button
      [label]="label()"
      [icon]="icon()"
      [iconPos]="iconPos()"
      [severity]="severity()"
      [disabled]="disabled()"
      [loading]="loading()"
      [outlined]="outlined()"
      [text]="text()"
      [rounded]="rounded()"
      [size]="size()"
      [type]="type()"
      [attr.aria-label]="ariaLabel()"
      (onClick)="clicked.emit($event)"
    />
  `,
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly iconPos = input<'left' | 'right' | 'top' | 'bottom'>('left');
  readonly severity = input<
    'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast'
  >('primary');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly outlined = input(false);
  readonly text = input(false);
  readonly rounded = input(false);
  readonly size = input<'small' | 'large' | undefined>(undefined);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly clicked = output<MouseEvent>();
}
