import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { PaginatorComponent } from '../../primitives/paginator/paginator.component';

@Component({
  selector: 'app-pagination-wrapper',
  imports: [PaginatorComponent],
  template: `
    <app-paginator
      [rows]="rows()"
      [totalRecords]="totalRecords()"
      [first]="first()"
      [rowsPerPageOptions]="rowsPerPageOptions()"
      (pageChange)="pageChange.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationWrapperComponent {
  readonly rows = input(10);
  readonly totalRecords = input(0);
  readonly first = input(0);
  readonly rowsPerPageOptions = input<number[]>([10, 25, 50, 100]);

  readonly pageChange = output<unknown>();
}
