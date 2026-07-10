import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-filter-panel',
  template: `
    <section class="ui-filter-panel" [attr.aria-label]="ariaLabel()">
      <ng-content />
    </section>
  `,
  styles: `
    .ui-filter-panel {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-md);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-surface-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent {
  readonly ariaLabel = input('Filters');
}
