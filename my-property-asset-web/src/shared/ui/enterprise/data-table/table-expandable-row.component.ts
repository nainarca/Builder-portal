import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { GhostButtonComponent } from '../buttons/enterprise-button.component';

/** P0.1 §6.5 — inline row expansion with disclosure control. */
@Component({
  selector: 'app-enterprise-table-expandable-row',
  imports: [GhostButtonComponent],
  template: `
    <div class="enterprise-table-expandable-row">
      <div class="enterprise-table-expandable-row__main">
        <app-ghost-button
          [label]="expanded() ? 'Collapse row' : 'Expand row'"
          [icon]="expanded() ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
          size="small"
          [ariaLabel]="expanded() ? 'Collapse row details' : 'Expand row details'"
          (clicked)="toggle()"
        />
        <ng-content select="[rowMain]" />
      </div>
      @if (expanded()) {
        <div
          class="enterprise-table-expandable-row__detail"
          [id]="detailId()"
          role="region"
          [attr.aria-label]="detailLabel()"
        >
          <ng-content select="[rowDetail]" />
        </div>
      }
    </div>
  `,
  styles: `
    .enterprise-table-expandable-row__main {
      display: flex;
      align-items: center;
      gap: var(--mpa-spacing-sm);
    }
    .enterprise-table-expandable-row__detail {
      margin-top: var(--mpa-spacing-sm);
      padding: var(--mpa-spacing-md);
      border-left: 3px solid var(--mpa-color-brand, #1b4d89);
      background: var(--mpa-color-surface-muted);
      border-radius: var(--mpa-radius-md);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableExpandableRowComponent {
  readonly expanded = input(false);
  readonly detailId = input('row-detail');
  readonly detailLabel = input('Expanded row details');

  readonly expandedChange = output<boolean>();

  toggle(): void {
    this.expandedChange.emit(!this.expanded());
  }
}
