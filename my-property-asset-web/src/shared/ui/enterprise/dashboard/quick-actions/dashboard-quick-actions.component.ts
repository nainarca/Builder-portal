import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { QuickActionCardComponent } from '../../cards/enterprise-cards.component';
import type { EnterpriseDashboardQuickAction } from '../models/enterprise-dashboard.models';

@Component({
  selector: 'app-enterprise-quick-actions-bar',
  imports: [QuickActionCardComponent],
  template: `
    <div class="enterprise-quick-actions-bar" role="region" [attr.aria-label]="ariaLabel()">
      @for (action of displayActions(); track action.id) {
        <app-quick-action-card
          [label]="action.label"
          [icon]="action.icon ?? 'pi pi-bolt'"
          (activated)="actionClick.emit(action.id)"
        />
      }
      <ng-content />
    </div>
  `,
  styles: `
    .enterprise-quick-actions-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
      gap: var(--mpa-spacing-md);
      max-width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseQuickActionsBarComponent {
  readonly actions = input<readonly EnterpriseDashboardQuickAction[]>([]);
  readonly ariaLabel = input('Quick actions');

  readonly actionClick = output<string>();

  readonly displayActions = computed(() =>
    this.actions().filter((action) => !action.disabled),
  );
}

@Component({
  selector: 'app-enterprise-pinned-actions',
  imports: [QuickActionCardComponent],
  template: `
    <div class="enterprise-pinned-actions" role="region" aria-label="Pinned actions">
      @for (action of pinnedActions(); track action.id) {
        <app-quick-action-card
          [label]="action.label"
          [icon]="action.icon ?? 'pi pi-bookmark'"
          (activated)="actionClick.emit(action.id)"
        />
      }
    </div>
  `,
  styles: `
    .enterprise-pinned-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
      gap: var(--mpa-spacing-md);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterprisePinnedActionsComponent {
  readonly actions = input<readonly EnterpriseDashboardQuickAction[]>([]);
  readonly actionClick = output<string>();

  readonly pinnedActions = computed(() => this.actions().filter((action) => action.pinned));
}

@Component({
  selector: 'app-enterprise-quick-action-create',
  imports: [QuickActionCardComponent],
  template: `<app-quick-action-card label="Create" icon="pi pi-plus" (activated)="activated.emit()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseQuickActionCreateComponent {
  readonly activated = output<void>();
}

@Component({
  selector: 'app-enterprise-quick-action-import',
  imports: [QuickActionCardComponent],
  template: `<app-quick-action-card label="Import" icon="pi pi-upload" (activated)="activated.emit()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseQuickActionImportComponent {
  readonly activated = output<void>();
}

@Component({
  selector: 'app-enterprise-quick-action-export',
  imports: [QuickActionCardComponent],
  template: `<app-quick-action-card label="Export" icon="pi pi-download" (activated)="activated.emit()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseQuickActionExportComponent {
  readonly activated = output<void>();
}

@Component({
  selector: 'app-enterprise-quick-action-invite',
  imports: [QuickActionCardComponent],
  template: `<app-quick-action-card label="Invite" icon="pi pi-user-plus" (activated)="activated.emit()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseQuickActionInviteComponent {
  readonly activated = output<void>();
}

@Component({
  selector: 'app-enterprise-quick-action-view-reports',
  imports: [QuickActionCardComponent],
  template: `<app-quick-action-card label="View reports" icon="pi pi-chart-bar" (activated)="activated.emit()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseQuickActionViewReportsComponent {
  readonly activated = output<void>();
}
