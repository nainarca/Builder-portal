import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Standalone helper / contextual guidance text for forms (UI-IMP-05). */
@Component({
  selector: 'app-enterprise-helper-text',
  template: `
    <p
      class="enterprise-helper-text"
      [class.enterprise-helper-text--muted]="tone() === 'muted'"
      [class.enterprise-helper-text--info]="tone() === 'info'"
      [class.enterprise-helper-text--warning]="tone() === 'warning'"
      [attr.role]="tone() === 'warning' ? 'status' : null"
    >
      @if (icon()) {
        <i [class]="icon()" aria-hidden="true"></i>
      }
      <span>{{ text() }}</span>
      <ng-content />
    </p>
  `,
  styles: `
    .enterprise-helper-text {
      display: flex;
      align-items: flex-start;
      gap: var(--mpa-spacing-xs);
      margin: 0;
      font-size: var(--mpa-font-size-sm);
      line-height: var(--mpa-line-height-normal);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-helper-text i {
      margin-top: 0.15rem;
      flex-shrink: 0;
    }
    .enterprise-helper-text--info {
      color: var(--mpa-color-info);
    }
    .enterprise-helper-text--warning {
      color: var(--mpa-color-warning);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseHelperTextComponent {
  readonly text = input.required<string>();
  readonly icon = input<string | undefined>(undefined);
  readonly tone = input<'muted' | 'info' | 'warning'>('muted');
}
