import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BasePageComponent, ContentCardComponent, PageHeaderComponent } from '@shared/ui';

@Component({
  selector: 'app-authentication-placeholder',
  imports: [BasePageComponent, ContentCardComponent, PageHeaderComponent],
  template: `
    <app-base-page class="auth-placeholder">
      <app-content-card icon="lock">
        <app-page-header
          eyebrow="Authentication"
          title="Sign in to continue"
          description="Secure access for platform administrators, builders, and partners."
        />
        <p class="mpa-body-md m-0">
          Authentication flows will be implemented here with polished form patterns and accessible states.
        </p>
      </app-content-card>
    </app-base-page>
  `,
  styles: `
    .auth-placeholder {
      display: flex;
      justify-content: center;
      padding-block: var(--mpa-spacing-3xl);
    }

    .auth-placeholder app-content-card {
      width: min(100%, 28rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationPlaceholder {}
