import { ChangeDetectionStrategy, Component, afterNextRender, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent } from '@shared/ui';

import { WorkflowCardComponent } from '../../components/shared';
import { HandoverStoreService } from '../../services/handover-store.service';
import { AttachmentsPlaceholderComponent, ChecklistSectionComponent, InspectorNotesPanelComponent } from '../components/checklist';
import { InspectionStatusBadgeComponent } from '../components/shared';
import { InspectionStoreService } from '../services/inspection-store.service';

@Component({
  selector: 'app-checklist-execution-page',
  imports: [
    BasePageComponent,
    ButtonComponent,
    WorkflowCardComponent,
    InspectionStatusBadgeComponent,
    ChecklistSectionComponent,
    InspectorNotesPanelComponent,
    AttachmentsPlaceholderComponent,
  ],
  templateUrl: './checklist-execution-page.component.html',
  styleUrl: './checklist-execution-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistExecutionPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly handoverStore = inject(HandoverStoreService);
  private readonly inspectionStore = inject(InspectionStoreService);

  private readonly handoverId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly handover = computed(() => this.handoverStore.getById(this.handoverId()));
  readonly inspections = computed(() => this.inspectionStore.getByHandoverId(this.handoverId()));

  readonly focusCategory: string | null;

  constructor() {
    this.focusCategory = this.route.snapshot.queryParamMap.get('category');

    if (this.focusCategory) {
      const categoryId = this.focusCategory;
      afterNextRender(() => {
        document.getElementById(`insp-category-${categoryId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  backToInspection(handoverId: string): void {
    this.router.navigate(['/builder-portal/handovers', handoverId, 'inspection']);
  }
}
