import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
} from '@angular/core';

import { AuthorizationService } from '../services/authorization.service';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authorization = inject(AuthorizationService);

  readonly appHasRole = input.required<string | readonly string[]>();

  constructor() {
    effect(() => {
      const roles = typeof this.appHasRole() === 'string' ? [this.appHasRole() as string] : [...this.appHasRole()];
      const granted = this.authorization.hasRole(roles);

      this.viewContainer.clear();
      if (granted) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
