import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { PreviewDevice } from '../../models/brand-admin.model';

interface DeviceOption {
  readonly id: PreviewDevice;
  readonly label: string;
  readonly icon: string;
}

@Component({
  selector: 'app-wl-device-preview',
  template: `
    <div class="wl-device-preview" role="group" aria-label="Preview device">
      @for (option of options; track option.id) {
        <button
          type="button"
          class="wl-device-preview__btn"
          [class.wl-device-preview__btn--active]="option.id === device()"
          [attr.aria-pressed]="option.id === device()"
          [attr.aria-label]="option.label"
          (click)="deviceChange.emit(option.id)"
        >
          <i [class]="option.icon" aria-hidden="true"></i>
          <span>{{ option.label }}</span>
        </button>
      }
    </div>
  `,
  styles: `
    .wl-device-preview {
      display: inline-flex;
      gap: 0.25rem;
      padding: 0.25rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
    .wl-device-preview__btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0.75rem;
      border: none;
      background: transparent;
      color: var(--mpa-color-text-muted);
      border-radius: var(--mpa-radius-sm, 0.375rem);
      cursor: pointer;
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
    .wl-device-preview__btn:hover {
      color: var(--mpa-color-text);
    }
    .wl-device-preview__btn--active {
      background: var(--mpa-color-primary);
      color: #fff;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlDevicePreviewComponent {
  readonly device = input<PreviewDevice>('desktop');
  readonly deviceChange = output<PreviewDevice>();

  readonly options: readonly DeviceOption[] = [
    { id: 'desktop', label: 'Desktop', icon: 'pi pi-desktop' },
    { id: 'tablet', label: 'Tablet', icon: 'pi pi-tablet' },
    { id: 'mobile', label: 'Mobile', icon: 'pi pi-mobile' },
  ];
}
