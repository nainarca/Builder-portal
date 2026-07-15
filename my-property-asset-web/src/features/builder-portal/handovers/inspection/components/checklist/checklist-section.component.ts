import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { ChecklistSection } from '../../models/inspection.model';
import { ChecklistItemComponent } from './checklist-item.component';

@Component({
  selector: 'app-checklist-section',
  imports: [ChecklistItemComponent],
  template: `
    <section class="checklist-section" [class.checklist-section--collapsed]="!expanded()">
      <button
        type="button"
        class="checklist-section__header"
        (click)="toggle()"
        [attr.aria-expanded]="expanded()"
      >
        <span class="checklist-section__title">{{ section().title }}</span>
        <span class="checklist-section__meta">{{ passedCount() }}/{{ section().items.length }} complete</span>
        <i class="pi" [class.pi-chevron-down]="expanded()" [class.pi-chevron-right]="!expanded()" aria-hidden="true"></i>
      </button>

      @if (expanded()) {
        <div class="checklist-section__body">
          @for (item of section().items; track item.id) {
            <app-checklist-item [item]="item" [sectionId]="section().id" [inspectionId]="inspectionId()" />
          }
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistSectionComponent {
  readonly section = input.required<ChecklistSection>();
  readonly inspectionId = input.required<string>();

  readonly expanded = signal(true);

  readonly passedCount = computed(
    () => this.section().items.filter((i) => i.status === 'passed' || i.status === 'not-applicable').length,
  );

  toggle(): void {
    this.expanded.update((v) => !v);
  }
}
