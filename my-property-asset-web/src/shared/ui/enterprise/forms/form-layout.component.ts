import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FormContainerComponent } from '../../composites/forms/form-container.component';

/**
 * DS-04 Form Layout — max-width, responsive grid, section spacing (P0.1 §5.3–5.4).
 */
@Component({
  selector: 'app-enterprise-form-layout',
  imports: [FormContainerComponent],
  template: `
    <div
      class="enterprise-form-layout"
      [class.enterprise-form-layout--narrow]="width() === 'narrow'"
      [class.enterprise-form-layout--wide]="width() === 'wide'"
      [class.enterprise-form-layout--fluid]="width() === 'fluid'"
      [class.enterprise-form-layout--readonly]="readonly()"
    >
      <app-form-container [layout]="layout()">
        <div class="enterprise-form-layout__stack">
          <ng-content />
        </div>
      </app-form-container>
    </div>
  `,
  styleUrl: './styles/form-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseFormLayoutComponent {
  readonly width = input<'default' | 'narrow' | 'wide' | 'fluid'>('default');
  readonly layout = input<'vertical' | 'horizontal' | 'inline'>('vertical');
  readonly readonly = input(false);
}
