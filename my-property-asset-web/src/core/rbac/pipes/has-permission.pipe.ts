import { Pipe, PipeTransform, inject } from '@angular/core';

import { PermissionService } from '../services/authorization.service';

@Pipe({
  name: 'appHasPermission',
  pure: false,
})
export class HasPermissionPipe implements PipeTransform {
  private readonly permissionService = inject(PermissionService);

  transform(requirement: string | readonly string[] | null | undefined, mode: 'all' | 'any' = 'all'): boolean {
    if (!requirement) {
      return true;
    }

    const requirements = typeof requirement === 'string' ? [requirement] : [...requirement];
    return mode === 'any'
      ? this.permissionService.hasAnyPermission(requirements)
      : this.permissionService.hasAllPermissions(requirements);
  }
}
