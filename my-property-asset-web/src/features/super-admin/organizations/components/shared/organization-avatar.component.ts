import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-org-avatar',
  template: `
    <span
      class="org-avatar"
      [class.org-avatar--lg]="size() === 'lg'"
      [class.org-avatar--sm]="size() === 'sm'"
      [style.background]="background()"
      [attr.aria-label]="name()"
    >
      @if (logoUrl()) {
        <img [src]="logoUrl()" [alt]="name()" class="org-avatar__image" />
      } @else {
        <span class="org-avatar__initials" aria-hidden="true">{{ initials() }}</span>
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationAvatarComponent {
  readonly name = input.required<string>();
  readonly logoUrl = input<string | undefined>(undefined);
  readonly primaryColor = input<string>('#1B4D89');
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  readonly initials = computed(() =>
    this.name()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join(''),
  );

  readonly background = computed(() =>
    this.logoUrl() ? 'transparent' : `color-mix(in srgb, ${this.primaryColor()} 18%, var(--mpa-color-surface))`,
  );
}
