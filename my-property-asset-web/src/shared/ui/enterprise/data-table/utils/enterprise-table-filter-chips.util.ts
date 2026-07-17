import type { EnterpriseTableFilterChip } from '../models/enterprise-table.models';

/** Build a removable chip when a filter is active (presentation helper only). */
export function filterChip(
  id: string,
  label: string,
  active: boolean,
  removable = true,
): EnterpriseTableFilterChip | null {
  if (!active) {
    return null;
  }
  return { id, label, removable };
}

export function collectFilterChips(
  ...chips: Array<EnterpriseTableFilterChip | null | undefined>
): EnterpriseTableFilterChip[] {
  return chips.filter((chip): chip is EnterpriseTableFilterChip => !!chip);
}

/**
 * Documented view-mode policy (UI-REBIRTH §6 / §20 #4).
 * portfolio → show table/card toggle; directory → table-only.
 */
export function showViewToggleForPolicy(policy: 'portfolio' | 'directory'): boolean {
  return policy === 'portfolio';
}
