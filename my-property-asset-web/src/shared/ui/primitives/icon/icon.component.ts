import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-icon',
  template: `<i [class]="iconClass()" [attr.aria-hidden]="decorative() ? 'true' : null" [attr.aria-label]="decorative() ? null : label()"></i>`,
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-icon-host',
    '[class.ui-icon-host--sm]': "size() === 'sm'",
    '[class.ui-icon-host--md]': "size() === 'md'",
    '[class.ui-icon-host--lg]': "size() === 'lg'",
    '[class.ui-icon-host--xl]': "size() === 'xl'",
  },
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input<IconSize>('md');
  readonly decorative = input(true);
  readonly label = input<string | undefined>(undefined);

  readonly iconClass = computed(() => {
    const value = this.name();
    return value.includes(' ') ? value : `pi pi-${value}`;
  });
}
