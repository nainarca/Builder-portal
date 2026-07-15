import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CheckboxComponent, FilterPanelComponent, SelectComponent, SelectOption } from '@shared/ui';

import { OWNER_INVITATION_OPTIONS } from '../../config/owners.config';
import { InvitationStatus } from '../../models/owner.model';

interface ProjectOption {
  readonly id: string;
  readonly name: string;
}

@Component({
  selector: 'app-owner-advanced-filters',
  imports: [FilterPanelComponent, SelectComponent, CheckboxComponent],
  template: `
    <app-filter-panel ariaLabel="Advanced owner filters">
      <div class="owner-advanced-filters__field">
        <span>Project</span>
        <app-select [options]="projectOptions()" [value]="projectFilter()" ariaLabel="Project" (valueChange)="projectFilterChange.emit($event)" />
      </div>
      <div class="owner-advanced-filters__field">
        <span>Invitation</span>
        <app-select [options]="invitationOptions" [value]="invitationFilter()" ariaLabel="Invitation status" (valueChange)="onInvitationChange($event)" />
      </div>
      <app-checkbox
        label="Include archived"
        [checked]="includeArchived()"
        (checkedChange)="includeArchivedChange.emit($event)"
      />
      <button type="button" class="owner-advanced-filters__reset" (click)="filtersReset.emit()">Reset filters</button>
    </app-filter-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerAdvancedFiltersComponent {
  readonly invitationFilter = input<InvitationStatus | 'all'>('all');
  readonly projectFilter = input('');
  readonly includeArchived = input(false);
  readonly projects = input<readonly ProjectOption[]>([]);

  readonly invitationFilterChange = output<InvitationStatus | 'all'>();
  readonly projectFilterChange = output<string>();
  readonly includeArchivedChange = output<boolean>();
  readonly filtersReset = output<void>();

  readonly invitationOptions: readonly SelectOption[] = OWNER_INVITATION_OPTIONS;

  projectOptions(): readonly SelectOption[] {
    return [{ label: 'All projects', value: '' }, ...this.projects().map((p) => ({ label: p.name, value: p.id }))];
  }

  onInvitationChange(value: string): void {
    this.invitationFilterChange.emit(value as InvitationStatus | 'all');
  }
}
