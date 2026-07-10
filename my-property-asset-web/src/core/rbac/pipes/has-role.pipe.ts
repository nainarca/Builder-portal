import { Pipe, PipeTransform, inject } from '@angular/core';

import { AuthorizationService } from '../services/authorization.service';

@Pipe({
  name: 'appHasRole',
  pure: false,
})
export class HasRolePipe implements PipeTransform {
  private readonly authorization = inject(AuthorizationService);

  transform(role: string | readonly string[] | null | undefined): boolean {
    if (!role) {
      return true;
    }

    const roles = typeof role === 'string' ? [role] : [...role];
    return this.authorization.hasRole(roles);
  }
}
