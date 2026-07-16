export const BUILDING_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Planning', value: 'planning' },
  { label: 'Construction', value: 'construction' },
  { label: 'Completed', value: 'completed' },
  { label: 'Archived', value: 'archived' },
] as const;

export const BUILDING_SORT_OPTIONS = [
  { label: 'Display order', value: 'displayOrder:asc' },
  { label: 'Name A–Z', value: 'name:asc' },
  { label: 'Name Z–A', value: 'name:desc' },
  { label: 'Newest', value: 'createdAt:desc' },
  { label: 'Status', value: 'status:asc' },
] as const;

export const BUILDING_STATUS_LABELS: Record<string, string> = {
  planning: 'Planning',
  construction: 'Construction',
  completed: 'Completed',
  archived: 'Archived',
};
