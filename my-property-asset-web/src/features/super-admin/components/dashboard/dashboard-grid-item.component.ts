import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-sa-dashboard-grid-item',
  template: `<div [class]="gridClass()"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardGridItemComponent {
  readonly colspan = input<1 | 2 | 3 | 4>(1);
  readonly rowspan = input<1 | 2>(1);

  readonly gridClass = computed(() => {
    const classes = ['sa-dashboard-grid__item'];
    const col = this.colspan();
    if (col > 1) {
      classes.push(`sa-dashboard-grid__item--span-${col}`);
    }
    if (this.rowspan() === 2) {
      classes.push('sa-dashboard-grid__item--row-2');
    }
    return classes.join(' ');
  });
}
