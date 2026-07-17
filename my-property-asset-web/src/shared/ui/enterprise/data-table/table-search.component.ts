import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { SearchFieldComponent } from '../../composites/data-display/search-field.component';
import { splitSearchHighlight } from './utils/enterprise-table-search.util';

@Component({
  selector: 'app-enterprise-table-search',
  imports: [SearchFieldComponent],
  template: `
    <app-search-field
      [value]="value()"
      [placeholder]="placeholder()"
      [ariaLabel]="ariaLabel()"
      (valueChange)="onValueChange($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableSearchComponent {
  readonly value = input('');
  readonly placeholder = input('Search');
  readonly ariaLabel = input('Search table');
  readonly debounceMs = input(300);

  readonly searchChange = output<string>();

  private debounceHandle: ReturnType<typeof setTimeout> | null = null;

  onValueChange(value: string): void {
    if (this.debounceHandle) {
      clearTimeout(this.debounceHandle);
    }
    this.debounceHandle = setTimeout(() => {
      this.searchChange.emit(value);
      this.debounceHandle = null;
    }, this.debounceMs());
  }
}

@Component({
  selector: 'app-enterprise-search-highlight',
  template: `
    @for (segment of segments(); track $index) {
      @if (segment.match) {
        <mark class="enterprise-search-highlight__mark">{{ segment.text }}</mark>
      } @else {
        <span>{{ segment.text }}</span>
      }
    }
  `,
  styles: `
    .enterprise-search-highlight__mark {
      padding: 0;
      background: color-mix(in srgb, var(--mpa-color-brand, #1b4d89) 18%, transparent);
      color: inherit;
      border-radius: var(--mpa-radius-sm, 2px);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseSearchHighlightComponent {
  readonly text = input.required<string>();
  readonly query = input('');

  segments() {
    return splitSearchHighlight(this.text(), this.query());
  }
}
