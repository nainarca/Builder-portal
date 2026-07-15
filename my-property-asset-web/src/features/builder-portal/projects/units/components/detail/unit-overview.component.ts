import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ContentCardComponent, ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { Unit } from '../../models/unit.model';

@Component({
  selector: 'app-unit-overview',
  imports: [ContentSectionComponent, SectionHeaderComponent, ContentCardComponent],
  template: `
    <div class="unit-overview">
      <div class="unit-stats">
        @for (stat of stats(); track stat.label) {
          <div class="unit-stats__card">
            <i class="unit-stats__icon" [class]="stat.icon" aria-hidden="true"></i>
            <p class="unit-stats__label">{{ stat.label }}</p>
            <p class="unit-stats__value">{{ stat.value }}</p>
          </div>
        }
      </div>

      <div class="unit-overview__grid">
        <div class="unit-info-panel">
          <h3 class="unit-info-panel__title">Unit information</h3>
          <dl class="unit-info-panel__list">
            @for (item of profileItems(); track item.label) {
              <div class="unit-info-panel__row">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            }
          </dl>
        </div>
        <app-content-section>
          <app-section-header title="Construction status" description="Current stage and completion" />
          <app-content-card icon="gauge">
            <p class="mpa-body-md m-0">Stage: {{ stageLabel() }}</p>
            <p class="mpa-body-md m-0">Progress: {{ unit().progress }}%</p>
          </app-content-card>
        </app-content-section>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitOverviewComponent {
  readonly unit = input.required<Unit>();

  readonly stats = computed(() => [
    { label: 'Progress', value: `${this.unit().progress}%`, icon: 'pi pi-gauge' },
    { label: 'Area', value: `${this.unit().areaSqft} sqft`, icon: 'pi pi-expand' },
    { label: 'Floor', value: String(this.unit().floorNumber), icon: 'pi pi-building' },
    { label: 'Open snags', value: String(this.unit().summary.openSnags), icon: 'pi pi-exclamation-triangle' },
  ]);

  readonly profileItems = computed(() => {
    const u = this.unit();
    return [
      { label: 'Tower / Block', value: u.towerName },
      { label: 'Unit number', value: u.unitNumber },
      { label: 'Unit code', value: u.code },
      { label: 'Type', value: this.typeLabel() },
      { label: 'Configuration', value: u.configuration },
    ];
  });

  readonly stageLabel = computed(() => {
    const map: Record<Unit['constructionStage'], string> = {
      'not-started': 'Not started',
      foundation: 'Foundation',
      structure: 'Structure',
      finishing: 'Finishing',
      'ready-for-handover': 'Ready for handover',
      'handed-over': 'Handed over',
    };
    return map[this.unit().constructionStage];
  });

  private typeLabel(): string {
    const map: Record<Unit['unitType'], string> = {
      apartment: 'Apartment',
      villa: 'Villa',
      studio: 'Studio',
      penthouse: 'Penthouse',
      commercial: 'Commercial',
      retail: 'Retail',
    };
    return map[this.unit().unitType];
  }
}
