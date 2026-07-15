import { Inspection, InspectionCategoryDefinition, ChecklistItem, ChecklistSection } from '../models/inspection.model';
import { deriveInspectionResult } from '../services/inspection.util';

export const INSPECTION_CATEGORY_DEFINITIONS: readonly InspectionCategoryDefinition[] = [
  {
    id: 'construction',
    label: 'Construction Checklist',
    icon: 'pi pi-building',
    mandatoryForHandover: true,
    sections: [
      {
        id: 'foundation-structure',
        title: 'Foundation & Structure',
        items: [
          { id: 'con-1', label: 'Foundation waterproofing verified', mandatory: true },
          { id: 'con-2', label: 'Structural columns aligned', mandatory: true },
          { id: 'con-3', label: 'Slab curing certificate available', mandatory: true },
        ],
      },
      {
        id: 'flooring-finishing',
        title: 'Flooring & Finishing',
        items: [
          { id: 'con-4', label: 'Flooring level and finish inspected', mandatory: true },
          { id: 'con-5', label: 'Wall putty and paint finish inspected', mandatory: false },
          { id: 'con-6', label: 'Ceiling finish inspected', mandatory: false },
        ],
      },
    ],
  },
  {
    id: 'electrical',
    label: 'Electrical Checklist',
    icon: 'pi pi-bolt',
    mandatoryForHandover: true,
    sections: [
      {
        id: 'wiring-distribution',
        title: 'Wiring & Distribution',
        items: [
          { id: 'ele-1', label: 'Main distribution board labeled and tested', mandatory: true },
          { id: 'ele-2', label: 'Wiring insulation resistance tested', mandatory: true },
          { id: 'ele-3', label: 'Earthing continuity verified', mandatory: true },
        ],
      },
      {
        id: 'fixtures-safety',
        title: 'Fixtures & Safety',
        items: [
          { id: 'ele-4', label: 'All switches and sockets functional', mandatory: true },
          { id: 'ele-5', label: 'Light fixtures installed and tested', mandatory: false },
          { id: 'ele-6', label: 'MCB/RCCB trip test completed', mandatory: true },
        ],
      },
    ],
  },
  {
    id: 'plumbing',
    label: 'Plumbing Checklist',
    icon: 'pi pi-wrench',
    mandatoryForHandover: true,
    sections: [
      {
        id: 'water-supply',
        title: 'Water Supply',
        items: [
          { id: 'plu-1', label: 'Water pressure test completed', mandatory: true },
          { id: 'plu-2', label: 'No visible leaks at supply joints', mandatory: true },
          { id: 'plu-3', label: 'Overhead tank cleaning certificate available', mandatory: false },
        ],
      },
      {
        id: 'drainage-fixtures',
        title: 'Drainage & Fixtures',
        items: [
          { id: 'plu-4', label: 'Drainage flow test completed', mandatory: true },
          { id: 'plu-5', label: 'All fixtures (taps, showers, WC) functional', mandatory: true },
          { id: 'plu-6', label: 'Waterproofing in wet areas verified', mandatory: true },
        ],
      },
    ],
  },
  {
    id: 'civil',
    label: 'Civil Checklist',
    icon: 'pi pi-map',
    mandatoryForHandover: true,
    sections: [
      {
        id: 'walls-ceiling',
        title: 'Walls & Ceiling',
        items: [
          { id: 'civ-1', label: 'No visible cracks on walls or ceiling', mandatory: true },
          { id: 'civ-2', label: 'Waterproofing of terrace/roof verified', mandatory: true },
          { id: 'civ-3', label: 'External plaster finish inspected', mandatory: false },
        ],
      },
      {
        id: 'doors-windows',
        title: 'Doors & Windows',
        items: [
          { id: 'civ-4', label: 'All doors and windows open/close smoothly', mandatory: true },
          { id: 'civ-5', label: 'Window seals and glazing inspected', mandatory: false },
          { id: 'civ-6', label: 'Balcony railing height and stability verified', mandatory: true },
        ],
      },
    ],
  },
  {
    id: 'safety',
    label: 'Safety Checklist',
    icon: 'pi pi-shield',
    mandatoryForHandover: true,
    sections: [
      {
        id: 'fire-safety',
        title: 'Fire Safety',
        items: [
          { id: 'saf-1', label: 'Fire extinguishers installed and tagged', mandatory: true },
          { id: 'saf-2', label: 'Smoke detectors functional', mandatory: true },
          { id: 'saf-3', label: 'Fire exit signage visible', mandatory: true },
        ],
      },
      {
        id: 'emergency-systems',
        title: 'Emergency Systems',
        items: [
          { id: 'saf-4', label: 'Emergency lighting functional', mandatory: true },
          { id: 'saf-5', label: 'Elevator emergency alarm tested', mandatory: false },
          { id: 'saf-6', label: 'Common area emergency contact signage displayed', mandatory: false },
        ],
      },
    ],
  },
];

type Scenario = 'not-started' | 'complete' | 'complete-remarks' | 'partial' | 'failed' | 'blocked';

function buildSections(
  def: InspectionCategoryDefinition,
  scenario: Scenario,
): readonly ChecklistSection[] {
  let firstMandatoryFlagged = false;

  return def.sections.map((sectionDef, sectionIndex) => {
    const items: ChecklistItem[] = sectionDef.items.map((itemDef) => {
      const base = { id: itemDef.id, label: itemDef.label, mandatory: itemDef.mandatory };

      switch (scenario) {
        case 'not-started':
        case 'blocked':
          return { ...base, status: 'pending' as const };
        case 'complete':
          return { ...base, status: 'passed' as const };
        case 'complete-remarks': {
          const isLastItemOfLastSection =
            sectionIndex === def.sections.length - 1 && itemDef.id === sectionDef.items[sectionDef.items.length - 1].id;
          return {
            ...base,
            status: 'passed' as const,
            remarks: isLastItemOfLastSection ? 'Minor cosmetic touch-up noted; does not block handover.' : undefined,
          };
        }
        case 'partial':
          return { ...base, status: sectionIndex === 0 ? ('passed' as const) : ('pending' as const) };
        case 'failed': {
          if (itemDef.mandatory && !firstMandatoryFlagged) {
            firstMandatoryFlagged = true;
            return { ...base, status: 'failed' as const, remarks: 'Does not meet quality standard — rectification required.' };
          }
          return { ...base, status: sectionIndex === 0 ? ('passed' as const) : ('pending' as const) };
        }
      }
    });

    return { id: sectionDef.id, title: sectionDef.title, items };
  });
}

function instantiateInspection(def: InspectionCategoryDefinition, handoverId: string, scenario: Scenario, updatedAt: string): Inspection {
  const sections = buildSections(def, scenario);
  const allItems = sections.flatMap((s) => s.items);
  const derived = deriveInspectionResult(allItems);

  const result = scenario === 'blocked' ? 'blocked' : derived.result;
  const completionPercent = scenario === 'blocked' ? 0 : derived.completionPercent;

  return {
    id: `insp-${handoverId}-${def.id}`,
    handoverId,
    category: def.id,
    title: def.label,
    mandatoryForHandover: def.mandatoryForHandover,
    result,
    completionPercent,
    sections,
    updatedAt,
    completedAt: result === 'passed' || result === 'passed-with-remarks' ? updatedAt : undefined,
  };
}

function seedForHandover(handoverId: string, scenarios: Record<string, Scenario>, updatedAt: string): readonly Inspection[] {
  return INSPECTION_CATEGORY_DEFINITIONS.map((def) =>
    instantiateInspection(def, handoverId, scenarios[def.id] ?? 'not-started', updatedAt),
  );
}

export const MOCK_INSPECTIONS: readonly Inspection[] = [
  ...seedForHandover(
    'handover-001',
    { construction: 'complete', electrical: 'complete', plumbing: 'complete', civil: 'complete-remarks', safety: 'complete' },
    '2026-04-10T09:00:00Z',
  ),
  ...seedForHandover(
    'handover-002',
    { construction: 'complete', electrical: 'complete', plumbing: 'complete', civil: 'complete', safety: 'complete' },
    '2026-01-10T09:00:00Z',
  ),
  ...seedForHandover(
    'handover-003',
    { construction: 'complete', electrical: 'partial', plumbing: 'blocked', civil: 'failed', safety: 'not-started' },
    '2026-07-14T09:00:00Z',
  ),
  ...seedForHandover(
    'handover-004',
    { construction: 'complete', electrical: 'complete-remarks', plumbing: 'complete', civil: 'complete', safety: 'complete' },
    '2026-05-01T09:00:00Z',
  ),
  ...seedForHandover(
    'handover-005',
    { construction: 'not-started', electrical: 'not-started', plumbing: 'not-started', civil: 'not-started', safety: 'not-started' },
    '2026-07-09T09:00:00Z',
  ),
  ...seedForHandover(
    'handover-006',
    { construction: 'not-started', electrical: 'not-started', plumbing: 'not-started', civil: 'not-started', safety: 'not-started' },
    '2026-07-08T09:00:00Z',
  ),
  ...seedForHandover(
    'handover-007',
    { construction: 'not-started', electrical: 'not-started', plumbing: 'not-started', civil: 'not-started', safety: 'not-started' },
    '2026-06-02T09:00:00Z',
  ),
];
