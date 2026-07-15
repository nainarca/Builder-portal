import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-proj-avatar',
  template: `
    <span
      class="proj-avatar"
      [class.proj-avatar--lg]="size() === 'lg'"
      [class.proj-avatar--sm]="size() === 'sm'"
      [attr.aria-label]="name()"
    >
      @if (thumbnailUrl()) {
        <img [src]="thumbnailUrl()" [alt]="name()" class="proj-avatar__image" />
      } @else {
        <i class="pi pi-building" aria-hidden="true"></i>
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAvatarComponent {
  readonly name = input.required<string>();
  readonly thumbnailUrl = input<string | undefined>(undefined);
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  readonly initials = computed(() =>
    this.name()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join(''),
  );
}
