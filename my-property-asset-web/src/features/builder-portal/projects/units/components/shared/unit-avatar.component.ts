import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-unit-avatar',
  template: `
    <span
      class="unit-avatar"
      [class.unit-avatar--sm]="size() === 'sm'"
      [class.unit-avatar--lg]="size() === 'lg'"
      [attr.aria-label]="unitNumber()"
    >
      <i class="pi pi-home" aria-hidden="true"></i>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitAvatarComponent {
  readonly unitNumber = input.required<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
}
