import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-bp-welcome',
  template: `
    <section class="bp-welcome" aria-label="Welcome">
      <p class="bp-welcome__greeting">{{ greeting() }}, {{ name() }}</p>
      <p class="bp-welcome__subtitle">
        @if (organizationName()) {
          {{ organizationName() }} ·
        }
        {{ today() }}
      </p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderWelcomeComponent {
  readonly greeting = input.required<string>();
  readonly name = input.required<string>();
  readonly organizationName = input<string | null | undefined>(undefined);
  readonly today = input.required<string>();
}
