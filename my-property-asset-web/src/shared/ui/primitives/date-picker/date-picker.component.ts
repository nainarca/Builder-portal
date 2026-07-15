import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-date-picker',
  imports: [FormsModule, DatePicker],
  template: `
    <p-datepicker
      [ngModel]="dateValue()"
      (ngModelChange)="onDateChange($event)"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [dateFormat]="dateFormat()"
      [showIcon]="showIcon()"
      [attr.aria-label]="ariaLabel()"
    />
  `,
  styleUrl: './date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent {
  /** ISO date string, e.g. '2026-07-14'. */
  readonly value = input<string | null>(null);
  readonly placeholder = input<string | undefined>(undefined);
  readonly disabled = input(false);
  readonly dateFormat = input('yy-mm-dd');
  readonly showIcon = input(true);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly valueChange = output<string | null>();

  readonly dateValue = computed(() => {
    const raw = this.value();
    return raw ? new Date(raw) : null;
  });

  onDateChange(date: Date | null): void {
    this.valueChange.emit(date ? this.toIsoDate(date) : null);
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
