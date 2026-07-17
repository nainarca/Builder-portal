import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { EnterpriseAvatarKind } from '../models/enterprise.models';

@Component({
  selector: 'app-enterprise-avatar',
  template: `
    <span
      class="enterprise-avatar"
      [class.enterprise-avatar--sm]="size() === 'sm'"
      [class.enterprise-avatar--lg]="size() === 'lg'"
      [class.enterprise-avatar--user]="kind() === 'user'"
      [class.enterprise-avatar--builder]="kind() === 'builder'"
      [class.enterprise-avatar--organization]="kind() === 'organization'"
      [class.enterprise-avatar--project]="kind() === 'project'"
      [class.enterprise-avatar--group]="kind() === 'group'"
      [attr.aria-label]="ariaLabel() || name()"
      role="img"
    >
      @if (imageUrl()) {
        <img [src]="imageUrl()!" [alt]="name()" />
      } @else {
        <span aria-hidden="true">{{ initials() }}</span>
      }
    </span>
  `,
  styles: `
    .enterprise-avatar {
      display: inline-flex; align-items: center; justify-content: center;
      width: 2.25rem; height: 2.25rem; border-radius: var(--mpa-radius-md);
      background: var(--mpa-color-primary-subtle); color: var(--mpa-color-primary);
      font-size: var(--mpa-font-size-sm); font-weight: var(--mpa-font-weight-semibold);
      overflow: hidden; flex-shrink: 0; border: 1px solid var(--mpa-color-border);
    }
    .enterprise-avatar--sm { width: 1.75rem; height: 1.75rem; font-size: var(--mpa-font-size-xs); }
    .enterprise-avatar--lg { width: 3rem; height: 3rem; font-size: var(--mpa-font-size-md); }
    .enterprise-avatar--group { border-radius: var(--mpa-radius-full); }
    .enterprise-avatar--user { border-radius: var(--mpa-radius-full); }
    .enterprise-avatar--organization { border-radius: var(--mpa-radius-sm); }
    .enterprise-avatar--project { background: var(--mpa-color-surface-muted); color: var(--mpa-color-text); }
    .enterprise-avatar--builder { background: color-mix(in srgb, var(--mpa-color-info) 18%, transparent); color: var(--mpa-color-info); }
    .enterprise-avatar img { width: 100%; height: 100%; object-fit: cover; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseAvatarComponent {
  readonly name = input.required<string>();
  readonly imageUrl = input<string | null | undefined>(undefined);
  readonly kind = input<EnterpriseAvatarKind>('user');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly customInitials = input<string | undefined>(undefined);

  readonly initials = computed(() => {
    if (this.customInitials()) {
      return this.customInitials()!.slice(0, 2).toUpperCase();
    }
    const parts = this.name().trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  });
}

@Component({
  selector: 'app-user-avatar',
  imports: [EnterpriseAvatarComponent],
  template: `<app-enterprise-avatar kind="user" [name]="name()" [imageUrl]="imageUrl()" [size]="size()" [ariaLabel]="ariaLabel()" [customInitials]="customInitials()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent {
  readonly name = input.required<string>();
  readonly imageUrl = input<string | null | undefined>(undefined);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly customInitials = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-builder-avatar',
  imports: [EnterpriseAvatarComponent],
  template: `<app-enterprise-avatar kind="builder" [name]="name()" [imageUrl]="imageUrl()" [size]="size()" [ariaLabel]="ariaLabel()" [customInitials]="customInitials()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderAvatarComponent {
  readonly name = input.required<string>();
  readonly imageUrl = input<string | null | undefined>(undefined);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly customInitials = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-organization-avatar',
  imports: [EnterpriseAvatarComponent],
  template: `<app-enterprise-avatar kind="organization" [name]="name()" [imageUrl]="imageUrl()" [size]="size()" [ariaLabel]="ariaLabel()" [customInitials]="customInitials()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationAvatarComponent {
  readonly name = input.required<string>();
  readonly imageUrl = input<string | null | undefined>(undefined);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly customInitials = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-project-avatar',
  imports: [EnterpriseAvatarComponent],
  template: `<app-enterprise-avatar kind="project" [name]="name()" [imageUrl]="imageUrl()" [size]="size()" [ariaLabel]="ariaLabel()" [customInitials]="customInitials()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAvatarComponent {
  readonly name = input.required<string>();
  readonly imageUrl = input<string | null | undefined>(undefined);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly customInitials = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-group-avatar',
  imports: [EnterpriseAvatarComponent],
  template: `<app-enterprise-avatar kind="group" [name]="name()" [imageUrl]="imageUrl()" [size]="size()" [ariaLabel]="ariaLabel()" [customInitials]="customInitials()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupAvatarComponent {
  readonly name = input.required<string>();
  readonly imageUrl = input<string | null | undefined>(undefined);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly customInitials = input<string | undefined>(undefined);
}
