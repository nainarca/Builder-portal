import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import {
  BasePageComponent,
  ButtonComponent,
  ModalShellComponent,
  SelectComponent,
  SelectOption,
  UiDialogService,
  UiToastService,
} from '@shared/ui';

import { ProjectStoreService } from '../../projects/services/project-store.service';
import {
  CustomerTimelineComponent,
  InvitationCenterComponent,
  OwnerDocumentPlaceholderComponent,
  OwnerHandoverPlaceholderComponent,
  OwnerOverviewComponent,
} from '../components/detail';
import { CustomerHeaderComponent } from '../components/shared';
import { OwnerStoreService } from '../services/owner-store.service';

@Component({
  selector: 'app-owner-detail-page',
  imports: [
    BasePageComponent,
    ButtonComponent,
    ModalShellComponent,
    SelectComponent,
    CustomerHeaderComponent,
    OwnerOverviewComponent,
    CustomerTimelineComponent,
    InvitationCenterComponent,
    OwnerDocumentPlaceholderComponent,
    OwnerHandoverPlaceholderComponent,
  ],
  templateUrl: './owner-detail-page.component.html',
  styleUrl: './owner-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(OwnerStoreService);
  private readonly projectStore = inject(ProjectStoreService);
  private readonly dialog = inject(UiDialogService);
  private readonly toast = inject(UiToastService);

  private readonly ownerId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly owner = computed(() => this.store.getById(this.ownerId()));
  readonly assignment = computed(() => this.store.getActiveAssignment(this.ownerId()));

  readonly reassignVisible = signal(false);
  readonly reassignProjectId = signal('');
  readonly reassignUnitId = signal('');

  readonly projectOptions = computed<readonly SelectOption[]>(() =>
    this.projectStore.projects().map((p) => ({ label: p.name, value: p.id })),
  );

  readonly reassignUnitOptions = computed<readonly SelectOption[]>(() =>
    this.store
      .getAvailableUnits()
      .filter((u) => !this.reassignProjectId() || u.projectId === this.reassignProjectId())
      .map((u) => ({ label: `${u.unitNumber} · ${u.towerName}`, value: u.id })),
  );

  async onArchive(): Promise<void> {
    const owner = this.owner();
    if (!owner) {
      return;
    }
    const confirmed = await this.dialog.confirm({
      title: 'Archive owner',
      message: `Archive "${owner.firstName} ${owner.lastName}"? They will be hidden from the default list view until restored.`,
      acceptLabel: 'Archive',
      acceptSeverity: 'danger',
    });
    if (!confirmed) {
      return;
    }
    this.store.archive(owner.id);
    this.toast.success('Owner archived', `${owner.firstName} ${owner.lastName} has been archived.`);
  }

  async onRestore(): Promise<void> {
    const owner = this.owner();
    if (!owner) {
      return;
    }
    const confirmed = await this.dialog.confirm({
      title: 'Restore owner',
      message: `Restore "${owner.firstName} ${owner.lastName}" to the active list?`,
      acceptLabel: 'Restore',
    });
    if (!confirmed) {
      return;
    }
    this.store.restore(owner.id);
    this.toast.success('Owner restored', `${owner.firstName} ${owner.lastName} is active again.`);
  }

  openReassign(): void {
    this.reassignProjectId.set(this.assignment()?.projectId ?? '');
    this.reassignUnitId.set('');
    this.reassignVisible.set(true);
  }

  closeReassign(): void {
    this.reassignVisible.set(false);
  }

  onReassignProjectChange(value: string): void {
    this.reassignProjectId.set(value);
    this.reassignUnitId.set('');
  }

  confirmReassign(): void {
    const owner = this.owner();
    if (!owner || !this.reassignProjectId() || !this.reassignUnitId()) {
      return;
    }
    const assignment = this.store.reassign(owner.id, this.reassignProjectId(), this.reassignUnitId());
    this.reassignVisible.set(false);
    if (assignment) {
      this.toast.success('Owner reassigned', `${owner.firstName} ${owner.lastName} is now assigned to ${assignment.unitNumber}.`);
    }
  }

  async onRemoveAssignment(): Promise<void> {
    const assignment = this.assignment();
    const owner = this.owner();
    if (!assignment || !owner) {
      return;
    }
    const confirmed = await this.dialog.confirm({
      title: 'Remove assignment',
      message: `Remove ${owner.firstName} ${owner.lastName}'s assignment to ${assignment.unitNumber}?`,
      acceptLabel: 'Remove',
      acceptSeverity: 'danger',
    });
    if (!confirmed) {
      return;
    }
    this.store.removeAssignment(assignment.id);
    this.toast.success('Assignment removed', `${owner.firstName} ${owner.lastName}'s assignment has been removed.`);
  }

  onResendInvitation(): void {
    const assignment = this.assignment();
    if (!assignment) {
      return;
    }
    this.store.resendInvitation(assignment.id);
    this.toast.success('Invitation resent', `A new invitation was sent to ${assignment.ownerName}.`);
  }

  onSendReminder(): void {
    const assignment = this.assignment();
    if (!assignment) {
      return;
    }
    this.store.sendReminder(assignment.id);
    this.toast.success('Reminder sent', `A follow-up reminder was sent to ${assignment.ownerName}.`);
  }

  onCancelInvitation(): void {
    const assignment = this.assignment();
    if (!assignment) {
      return;
    }
    this.store.cancelInvitation(assignment.id);
    this.toast.info('Invitation cancelled', `The invitation for ${assignment.ownerName} was cancelled.`);
  }
}
