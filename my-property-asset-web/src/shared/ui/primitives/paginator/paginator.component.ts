import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-paginator',
  imports: [Paginator],
  template: `
    <p-paginator
      [rows]="rows()"
      [totalRecords]="totalRecords()"
      [first]="first()"
      [rowsPerPageOptions]="rowsPerPageOptions()"
      (onPageChange)="pageChange.emit($event)"
    />
  `,
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  readonly rows = input(10);
  readonly totalRecords = input(0);
  readonly first = input(0);
  readonly rowsPerPageOptions = input<number[]>([10, 25, 50, 100]);

  readonly pageChange = output<unknown>();
}
