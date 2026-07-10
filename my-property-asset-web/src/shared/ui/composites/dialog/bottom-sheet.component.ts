import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '../../primitives/button/button.component';

@Component({
  selector: 'app-bottom-sheet',
  template: `
    @if (visible()) {
      <div
        class="ui-bottom-sheet-backdrop"
        role="presentation"
        (click)="dismissible() ? dismissRequested.emit() : null"
      ></div>
    }
    <section
      class="ui-bottom-sheet"
      [class.ui-bottom-sheet--open]="visible()"
      role="dialog"
      [attr.aria-modal]="true"
      [attr.aria-label]="title()"
    >
      <header class="ui-bottom-sheet__header">
        <h2 class="mpa-heading-sm m-0">{{ title() }}</h2>
        @if (dismissible()) {
          <app-button icon="pi pi-times" [text]="true" ariaLabel="Close" (clicked)="dismissRequested.emit()" />
        }
      </header>
      <div class="ui-bottom-sheet__content">
        <ng-content />
      </div>
    </section>
  `,
  imports: [ButtonComponent],
  styles: `
    .ui-bottom-sheet-backdrop {
      position: fixed;
      inset: 0;
      z-index: calc(var(--mpa-z-index-modal) - 1);
      background: rgb(15 23 42 / 40%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetComponent {
  readonly title = input.required<string>();
  readonly visible = input(false);
  readonly dismissible = input(true);

  readonly dismissRequested = output<void>();
}
