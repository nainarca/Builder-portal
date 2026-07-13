import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-iam-role-quick-filters',
  template: `
    <div class="iam-quick-filters" role="group" aria-label="Role scope filters">
      @for (f of filters; track f.value) {
        <button type="button" class="iam-quick-filters__chip"
          [class.iam-quick-filters__chip--active]="selected() === f.value"
          (click)="selectedChange.emit(f.value)">{{ f.label }}</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamRoleQuickFiltersComponent {
  readonly selected = input<'all' | 'platform' | 'organization'>('all');
  readonly selectedChange = output<'all' | 'platform' | 'organization'>();

  readonly filters = [
    { label: 'All roles', value: 'all' as const },
    { label: 'Platform', value: 'platform' as const },
    { label: 'Organization', value: 'organization' as const },
  ];
}
