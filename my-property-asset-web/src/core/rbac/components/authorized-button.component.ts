import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { ButtonComponent } from '@shared/ui';
import { PermissionService } from '../services/authorization.service';

@Component({
  selector: 'app-authorized-button',
  imports: [ButtonComponent],
  template: `
    @if (isAuthorized()) {
      <app-button
        [label]="label()"
        [icon]="icon()"
        [severity]="severity()"
        [disabled]="disabled()"
        [loading]="loading()"
        [outlined]="outlined()"
        [text]="text()"
        [type]="type()"
        [ariaLabel]="ariaLabel()"
        (clicked)="clicked.emit($event)"
      />
    } @else if (showWhenDenied()) {
      <span class="authorized-button__denied" [attr.title]="deniedTooltip()">
        <app-button
          [label]="label()"
          [icon]="icon()"
          [severity]="severity()"
          [disabled]="true"
          [outlined]="outlined()"
          [text]="text()"
          [type]="buttonType()"
          [ariaLabel]="ariaLabel() ?? label()"
        />
      </span>
    }
  `,
  styles: `
    .authorized-button__denied {
      display: inline-flex;
      cursor: not-allowed;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedButtonComponent {
  private readonly permissionService = inject(PermissionService);

  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly severity = input<
    'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast'
  >('primary');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly outlined = input(false);
  readonly text = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly permission = input<string | readonly string[] | undefined>(undefined);
  readonly permissionMode = input<'all' | 'any'>('all');
  readonly showWhenDenied = input(true);
  readonly deniedTooltip = input('You do not have access to perform this action.');

  readonly clicked = output<MouseEvent>();

  readonly buttonType = computed(() => this.type());
  readonly isAuthorized = computed(() => {
    const permission = this.permission();
    if (!permission) {
      return true;
    }

    const requirements = typeof permission === 'string' ? [permission] : [...permission];
    return this.permissionMode() === 'any'
      ? this.permissionService.hasAnyPermission(requirements)
      : this.permissionService.hasAllPermissions(requirements);
  });
}
