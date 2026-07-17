import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { HasPermissionDirective } from '@core/rbac';
import {
  EnterpriseAttachmentPanelComponent,
  EnterpriseDetailAction,
  EnterpriseDetailActionPanelComponent,
  EnterpriseDetailEmptyComponent,
  EnterpriseDetailShellComponent,
  EnterpriseDetailTab,
  EnterpriseEntityHeroComponent,
  EnterpriseRelatedRecordsComponent,
  PrimaryButtonComponent,
  UiDialogService,
  UiToastService,
} from '@shared/ui';

import { BuilderPortalPageComponent } from '../../components/layout';
import { BuildingService } from '../buildings/services/building.service';
import {
  buildingsAreRequired,
  buildingsAreSupported,
} from '../buildings/utils/project-building-compatibility';
import {
  ProjectGalleryPlaceholderComponent,
  ProjectLocationCardComponent,
  ProjectMapPlaceholderComponent,
  ProjectOverviewComponent,
  ProjectSummaryRowComponent,
} from '../components/detail';
import {
  ProjectAvatarComponent,
  ProjectTypeBadgeComponent,
} from '../components/shared';
import { PROJECT_STATUS_LABELS } from '../config/projects.config';
import { ProjectStatus } from '../models/project.model';
import { ProjectStoreService } from '../services/project-store.service';

@Component({
  selector: 'app-project-detail-page',
  imports: [
    BuilderPortalPageComponent,
    HasPermissionDirective,
    PrimaryButtonComponent,
    EnterpriseDetailShellComponent,
    EnterpriseEntityHeroComponent,
    EnterpriseRelatedRecordsComponent,
    EnterpriseAttachmentPanelComponent,
    EnterpriseDetailEmptyComponent,
    EnterpriseDetailActionPanelComponent,
    ProjectAvatarComponent,
    ProjectTypeBadgeComponent,
    ProjectOverviewComponent,
    ProjectLocationCardComponent,
    ProjectSummaryRowComponent,
    ProjectMapPlaceholderComponent,
    ProjectGalleryPlaceholderComponent,
  ],
  templateUrl: './project-detail-page.component.html',
  styleUrl: './project-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(ProjectStoreService);
  private readonly buildings = inject(BuildingService);
  private readonly dialog = inject(UiDialogService);
  private readonly toast = inject(UiToastService);

  private readonly projectId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly activeTab = signal('overview');

  readonly project = computed(() => this.store.getById(this.projectId()));
  readonly buildingStats = computed(() => this.buildings.dashboardStats(this.projectId()));
  readonly showBuildings = computed(() => {
    const p = this.project();
    return p ? buildingsAreSupported(p) : false;
  });
  readonly buildingsRequired = computed(() => {
    const p = this.project();
    return p ? buildingsAreRequired(p) : false;
  });

  readonly detailTabs = computed<readonly EnterpriseDetailTab[]>(() => {
    const buildingsSupported = this.showBuildings();
    return [
      { id: 'overview', label: 'Overview', icon: 'pi pi-home' },
      {
        id: 'buildings',
        label: 'Buildings',
        icon: 'pi pi-building',
        disabled: !buildingsSupported,
      },
      { id: 'units', label: 'Units', icon: 'pi pi-th-large' },
      { id: 'documents', label: 'Documents', icon: 'pi pi-folder' },
      { id: 'owners', label: 'Owners', icon: 'pi pi-users' },
    ];
  });

  readonly statusLabel = computed(() => {
    const status = this.project()?.status;
    return status ? (PROJECT_STATUS_LABELS[status] ?? status) : undefined;
  });

  readonly statusSeverity = computed(() => {
    const status = this.project()?.status;
    const map: Record<ProjectStatus, 'success' | 'warn' | 'danger' | 'info' | 'secondary'> = {
      upcoming: 'secondary',
      planning: 'info',
      construction: 'warn',
      completed: 'success',
      archived: 'danger',
    };
    return status ? map[status] : 'secondary';
  });

  readonly statusIcon = computed(() => {
    const status = this.project()?.status;
    const map: Record<ProjectStatus, string> = {
      upcoming: 'pi pi-clock',
      planning: 'pi pi-map',
      construction: 'pi pi-hammer',
      completed: 'pi pi-check-circle',
      archived: 'pi pi-inbox',
    };
    return status ? map[status] : undefined;
  });

  readonly heroFacts = computed(() => {
    const p = this.project();
    if (!p) {
      return [];
    }
    return [
      { label: 'Type', value: p.projectType.replace(/-/g, ' ') },
      { label: 'Hierarchy', value: p.hierarchy.replace(/-/g, ' ') },
    ];
  });

  readonly heroStats = computed(() => {
    const p = this.project();
    if (!p) {
      return [];
    }
    return [
      { id: 'units', label: 'Units', value: String(p.summary.unitsTotal) },
      { id: 'owners', label: 'Owners', value: String(p.summary.ownersCount) },
      { id: 'documents', label: 'Documents', value: String(p.summary.documentsCount) },
      {
        id: 'buildings',
        label: 'Buildings',
        value: this.showBuildings() ? String(this.buildingStats().total) : '—',
      },
    ];
  });

  readonly overflowActions = computed<readonly EnterpriseDetailAction[]>(() => {
    const p = this.project();
    if (!p) {
      return [];
    }
    const actions: EnterpriseDetailAction[] = [
      { id: 'back', label: 'Back to list', icon: 'pi pi-arrow-left' },
    ];
    if (this.showBuildings()) {
      actions.push({ id: 'buildings', label: 'Manage buildings', icon: 'pi pi-building' });
    }
    actions.push({ id: 'units', label: 'Open units', icon: 'pi pi-th-large' });
    if (!p.archived) {
      actions.push({
        id: 'archive',
        label: 'Archive',
        icon: 'pi pi-archive',
        severity: 'danger',
      });
    } else {
      actions.push({ id: 'restore', label: 'Restore', icon: 'pi pi-replay' });
    }
    return actions;
  });

  readonly quickActions = computed<readonly EnterpriseDetailAction[]>(() => {
    const actions: EnterpriseDetailAction[] = [
      { id: 'units', label: 'Open units', icon: 'pi pi-th-large' },
      { id: 'owners', label: 'Open owners', icon: 'pi pi-users' },
    ];
    if (this.showBuildings()) {
      actions.unshift({ id: 'buildings', label: 'Manage buildings', icon: 'pi pi-building' });
    }
    return actions;
  });

  readonly dangerActions = computed<readonly EnterpriseDetailAction[]>(() => {
    const p = this.project();
    if (!p) {
      return [];
    }
    return p.archived
      ? [{ id: 'restore', label: 'Restore', icon: 'pi pi-replay' }]
      : [{ id: 'archive', label: 'Archive', icon: 'pi pi-archive', severity: 'danger' }];
  });

  readonly buildingRelatedItems = computed(() => {
    const stats = this.buildingStats();
    if (!stats.total) {
      return [];
    }
    return stats.recent.map((b) => ({
      id: b.id,
      title: b.name,
      subtitle: b.code,
      meta: b.status,
      href: `/builder-portal/projects/${this.projectId()}/buildings/${b.id}`,
      statusLabel: b.status,
    }));
  });

  readonly unitRelatedItems = computed(() => {
    const p = this.project();
    if (!p?.summary.unitsTotal) {
      return [];
    }
    return [
      {
        id: 'units-summary',
        title: `${p.summary.unitsTotal} units`,
        subtitle: `${p.summary.unitsSold} sold`,
        href: `/builder-portal/projects/${p.id}/units`,
      },
    ];
  });

  readonly ownerRelatedItems = computed(() => {
    const p = this.project();
    if (!p?.summary.ownersCount) {
      return [];
    }
    return [
      {
        id: 'owners-summary',
        title: `${p.summary.ownersCount} owners`,
        subtitle: 'Assignments across this project',
        href: '/builder-portal/owners',
      },
    ];
  });

  readonly documentAttachments = computed(() => {
    const count = this.project()?.summary.documentsCount ?? 0;
    if (!count) {
      return [];
    }
    return [
      {
        id: 'docs-summary',
        name: `${count} project documents`,
        version: undefined,
        sizeLabel: 'Library',
      },
    ];
  });

  onTabChange(tabId: string): void {
    this.activeTab.set(tabId);
  }

  goToEdit(): void {
    void this.router.navigate(['/builder-portal/projects', this.projectId(), 'edit']);
  }

  goToBuildings(): void {
    void this.router.navigate(['/builder-portal/projects', this.projectId(), 'buildings']);
  }

  goToUnits(): void {
    void this.router.navigate(['/builder-portal/projects', this.projectId(), 'units']);
  }

  goToOwners(): void {
    void this.router.navigate(['/builder-portal/owners']);
  }

  goToDocuments(): void {
    void this.router.navigate(['/builder-portal/documents']);
  }

  goToList(): void {
    void this.router.navigate(['/builder-portal/projects/list']);
  }

  onOverflowAction(actionId: string): void {
    void this.onPanelAction(actionId);
  }

  onPanelAction(actionId: string): void {
    switch (actionId) {
      case 'back':
        this.goToList();
        break;
      case 'buildings':
        this.goToBuildings();
        break;
      case 'units':
        this.goToUnits();
        break;
      case 'owners':
        this.goToOwners();
        break;
      case 'archive':
        void this.onArchive();
        break;
      case 'restore':
        void this.onRestore();
        break;
      default:
        break;
    }
  }

  async onArchive(): Promise<void> {
    const project = this.project();
    if (!project) {
      return;
    }
    const confirmed = await this.dialog.confirm({
      title: 'Archive project',
      message: `Archive "${project.name}"? It will be hidden from the default list view until restored.`,
      acceptLabel: 'Archive',
      acceptSeverity: 'danger',
    });
    if (!confirmed) {
      return;
    }
    this.store.archive(project.id);
    this.toast.success('Project archived', `${project.name} has been archived.`);
  }

  async onRestore(): Promise<void> {
    const project = this.project();
    if (!project) {
      return;
    }
    const confirmed = await this.dialog.confirm({
      title: 'Restore project',
      message: `Restore "${project.name}" to the active portfolio?`,
      acceptLabel: 'Restore',
    });
    if (!confirmed) {
      return;
    }
    this.store.restore(project.id);
    this.toast.success('Project restored', `${project.name} is active again.`);
  }
}
