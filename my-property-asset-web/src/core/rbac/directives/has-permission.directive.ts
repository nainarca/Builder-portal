import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
} from '@angular/core';

import { PermissionService } from '../services/authorization.service';

@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly permissionService = inject(PermissionService);

  readonly appHasPermission = input.required<string | readonly string[]>();
  readonly appHasPermissionMode = input<'all' | 'any'>('all');

  constructor() {
    effect(() => {
      const requirements = this.normalizeRequirements(this.appHasPermission());
      const granted =
        this.appHasPermissionMode() === 'any'
          ? this.permissionService.hasAnyPermission(requirements)
          : this.permissionService.hasAllPermissions(requirements);

      this.viewContainer.clear();
      if (granted) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }

  private normalizeRequirements(value: string | readonly string[]): string[] {
    return typeof value === 'string' ? [value] : [...value];
  }
}
