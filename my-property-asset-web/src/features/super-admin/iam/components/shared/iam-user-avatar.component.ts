import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-iam-user-avatar',
  template: `
    <span class="iam-avatar" [class.iam-avatar--lg]="size() === 'lg'" [class.iam-avatar--sm]="size() === 'sm'"
      [style.background]="avatarUrl() ? undefined : backgroundColor()">
      @if (avatarUrl()) {
        <img [src]="avatarUrl()" [alt]="name()" class="iam-avatar__image" />
      } @else {
        <span class="iam-avatar__initials" aria-hidden="true">{{ initials() }}</span>
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserAvatarComponent {
  readonly name = input.required<string>();
  readonly avatarUrl = input<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  readonly initials = computed(() =>
    this.name().split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join(''),
  );
  readonly backgroundColor = computed(() => 'var(--mpa-color-primary-subtle)');
}
