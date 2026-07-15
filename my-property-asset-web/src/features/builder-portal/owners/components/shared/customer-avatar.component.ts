import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-customer-avatar',
  template: `
    <span class="customer-avatar" [class.customer-avatar--sm]="size() === 'sm'" [class.customer-avatar--lg]="size() === 'lg'" [attr.aria-label]="name()">
      {{ initials() }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerAvatarComponent {
  readonly name = input.required<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  readonly initials = computed(() => {
    const parts = this.name().trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return `${first}${last}`.toUpperCase() || '?';
  });
}
