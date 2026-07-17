import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { GhostButtonComponent, OutlineButtonComponent } from '../buttons/enterprise-button.component';
import type {
  EnterpriseTableExportFormat,
  EnterpriseTableExportOption,
} from './models/enterprise-table.models';

@Component({
  selector: 'app-enterprise-table-export',
  imports: [OutlineButtonComponent, GhostButtonComponent],
  template: `
    <div class="enterprise-table-export">
      <app-outline-button
        [label]="primaryLabel()"
        icon="pi pi-download"
        size="small"
        [loading]="loading()"
        [disabled]="disabled()"
        (clicked)="onPrimaryExport()"
      />
      @if (showMenu()) {
        <app-ghost-button
          label="More export formats"
          icon="pi pi-chevron-down"
          size="small"
          (clicked)="toggleMenu()"
        />
        @if (menuOpen()) {
          <div class="enterprise-table-export__menu" role="menu">
            @for (option of enabledOptions(); track option.format) {
              <button
                type="button"
                class="enterprise-table-export__menu-item"
                role="menuitem"
                (click)="onExport(option.format)"
              >
                {{ option.label }}
              </button>
            }
          </div>
        }
      }
    </div>
  `,
  styles: `
    .enterprise-table-export {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: var(--mpa-spacing-xs);
    }
    .enterprise-table-export__menu {
      position: absolute;
      top: 100%;
      right: 0;
      z-index: var(--mpa-z-index-dropdown, 200);
      min-width: 10rem;
      margin-top: var(--mpa-spacing-xs);
      padding: var(--mpa-spacing-xs);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md);
      background: var(--mpa-color-surface-elevated, var(--mpa-color-surface));
      box-shadow: var(--mpa-shadow-md, 0 4px 12px rgb(15 23 42 / 12%));
    }
    .enterprise-table-export__menu-item {
      display: block;
      width: 100%;
      padding: var(--mpa-spacing-sm);
      border: 0;
      border-radius: var(--mpa-radius-sm);
      background: transparent;
      color: var(--mpa-color-text);
      font-size: var(--mpa-font-size-sm);
      text-align: left;
      cursor: pointer;
    }
    .enterprise-table-export__menu-item:hover {
      background: var(--mpa-color-surface-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableExportComponent {
  readonly options = input<readonly EnterpriseTableExportOption[]>([
    { format: 'csv', label: 'Export CSV', enabled: true },
    { format: 'excel', label: 'Export Excel', enabled: false },
    { format: 'pdf', label: 'Export PDF', enabled: false },
    { format: 'print', label: 'Print', enabled: false },
  ]);
  readonly primaryFormat = input<EnterpriseTableExportFormat>('csv');
  readonly loading = input(false);
  readonly disabled = input(false);

  readonly export = output<EnterpriseTableExportFormat>();

  readonly menuOpen = signal(false);

  primaryLabel(): string {
    return this.enabledOptions().find((option) => option.format === this.primaryFormat())?.label ?? 'Export';
  }

  showMenu(): boolean {
    return this.enabledOptions().length > 1;
  }

  enabledOptions(): EnterpriseTableExportOption[] {
    return this.options().filter((option) => option.enabled !== false);
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  onPrimaryExport(): void {
    this.export.emit(this.primaryFormat());
  }

  onExport(format: EnterpriseTableExportFormat): void {
    this.export.emit(format);
    this.menuOpen.set(false);
  }
}
