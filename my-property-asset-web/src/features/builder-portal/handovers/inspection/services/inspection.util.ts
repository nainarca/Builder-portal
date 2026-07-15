import { ChecklistItem, InspectionResultStatus } from '../models/inspection.model';

export function deriveInspectionResult(
  items: readonly ChecklistItem[],
): { result: InspectionResultStatus; completionPercent: number } {
  if (items.length === 0) {
    return { result: 'pending', completionPercent: 0 };
  }

  const resolvedCount = items.filter((i) => i.status === 'passed' || i.status === 'not-applicable').length;
  const completionPercent = Math.round((resolvedCount / items.length) * 100);
  const hasFailedMandatory = items.some((i) => i.mandatory && i.status === 'failed');

  if (hasFailedMandatory) {
    return { result: 'failed', completionPercent };
  }

  const allResolved = resolvedCount === items.length;
  if (allResolved) {
    const hasRemarks = items.some((i) => !!i.remarks);
    return { result: hasRemarks ? 'passed-with-remarks' : 'passed', completionPercent: 100 };
  }

  return { result: 'pending', completionPercent };
}
