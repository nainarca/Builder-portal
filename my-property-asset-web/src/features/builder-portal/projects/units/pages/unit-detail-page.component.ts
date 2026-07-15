import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent, UiDialogService, UiToastService } from '@shared/ui';

import {
  UnitDrawingPlaceholderComponent,
  UnitGalleryPlaceholderComponent,
  UnitOverviewComponent,
  UnitSummaryRowComponent,
  UnitTimelineComponent,
} from '../components/detail';
import { UnitHeaderComponent } from '../components/shared';
import { UnitStoreService } from '../services/unit-store.service';

@Component({
  selector: 'app-unit-detail-page',
  imports: [
    BasePageComponent,
    ButtonComponent,
    UnitHeaderComponent,
    UnitOverviewComponent,
    UnitTimelineComponent,
    UnitSummaryRowComponent,
    UnitGalleryPlaceholderComponent,
    UnitDrawingPlaceholderComponent,
  ],
  templateUrl: './unit-detail-page.component.html',
  styleUrl: './unit-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(UnitStoreService);
  private readonly dialog = inject(UiDialogService);
  private readonly toast = inject(UiToastService);

  readonly projectId = toSignal(
    (this.route.parent?.paramMap ?? this.route.paramMap).pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' },
  );
  private readonly unitId = toSignal(this.route.paramMap.pipe(map((p) => p.get('unitId') ?? '')), {
    initialValue: '',
  });

  readonly unit = computed(() => this.store.getById(this.unitId()));

  async onArchive(): Promise<void> {
    const unit = this.unit();
    if (!unit) {
      return;
    }
    const confirmed = await this.dialog.confirm({
      title: 'Archive unit',
      message: `Archive unit "${unit.unitNumber}"? It will be hidden from the default list view until restored.`,
      acceptLabel: 'Archive',
      acceptSeverity: 'danger',
    });
    if (!confirmed) {
      return;
    }
    this.store.archive(unit.id);
    this.toast.success('Unit archived', `${unit.unitNumber} has been archived.`);
  }

  async onRestore(): Promise<void> {
    const unit = this.unit();
    if (!unit) {
      return;
    }
    const confirmed = await this.dialog.confirm({
      title: 'Restore unit',
      message: `Restore unit "${unit.unitNumber}" to the active list?`,
      acceptLabel: 'Restore',
    });
    if (!confirmed) {
      return;
    }
    this.store.restore(unit.id);
    this.toast.success('Unit restored', `${unit.unitNumber} is active again.`);
  }
}
