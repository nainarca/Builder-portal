import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '../../primitives/button/button.component';

@Component({
  selector: 'app-export-button',
  imports: [ButtonComponent],
  template: `
    <app-button
      [label]="label()"
      icon="pi pi-download"
      [outlined]="outlined()"
      [loading]="loading()"
      [disabled]="disabled()"
      (clicked)="exportClick.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportButtonComponent {
  readonly label = input('Export');
  readonly outlined = input(true);
  readonly loading = input(false);
  readonly disabled = input(false);

  readonly exportClick = output<MouseEvent>();
}
