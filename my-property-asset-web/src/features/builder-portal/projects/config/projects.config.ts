import { DashboardActivityItem, DashboardKpiItem, DashboardQuickActionItem } from '../../models/dashboard.model';
import { ProjectSavedView, ProjectTableColumn } from '../models/project.model';

export const PROJECT_WORKSPACE_HEADER = {
  eyebrow: 'Builder Portal',
  title: 'Project workspace',
  description: 'Manage developments — create, edit, archive, and track project status across your portfolio.',
};

export const PROJECT_TABLE_COLUMNS: readonly ProjectTableColumn[] = [
  { id: 'name', label: 'Project', sortable: true, defaultVisible: true },
  { id: 'status', label: 'Status', sortable: true, defaultVisible: true },
  { id: 'projectType', label: 'Type', sortable: true, defaultVisible: true },
  { id: 'city', label: 'City', sortable: true, defaultVisible: true },
  { id: 'launchDate', label: 'Launch date', sortable: true, defaultVisible: false },
  { id: 'expectedCompletionDate', label: 'Expected completion', sortable: true, defaultVisible: true },
];

export const PROJECT_SAVED_VIEWS: readonly ProjectSavedView[] = [
  { id: 'all', name: 'All projects', statusFilter: 'all', typeFilter: 'all', isDefault: true },
  { id: 'construction', name: 'Under construction', statusFilter: 'construction', typeFilter: 'all' },
  { id: 'planning', name: 'Planning', statusFilter: 'planning', typeFilter: 'all' },
  { id: 'upcoming', name: 'Upcoming', statusFilter: 'upcoming', typeFilter: 'all' },
  { id: 'completed', name: 'Completed', statusFilter: 'completed', typeFilter: 'all' },
];

export const PROJECT_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Planning', value: 'planning' },
  { label: 'Construction', value: 'construction' },
  { label: 'Completed', value: 'completed' },
  { label: 'Archived', value: 'archived' },
] as const;

export const PROJECT_TYPE_OPTIONS = [
  { label: 'All types', value: 'all' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Residential Plot', value: 'residential-plot' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Mixed Development', value: 'mixed-development' },
] as const;

export const PROJECT_SORT_OPTIONS = [
  { label: 'Name A–Z', value: 'name:asc' },
  { label: 'Name Z–A', value: 'name:desc' },
  { label: 'Newest', value: 'createdAt:desc' },
  { label: 'Expected completion', value: 'expectedCompletionDate:asc' },
  { label: 'Status', value: 'status:asc' },
] as const;

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  apartment: 'Apartment',
  villa: 'Villa',
  'residential-plot': 'Residential Plot',
  commercial: 'Commercial',
  'mixed-development': 'Mixed Development',
};

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  upcoming: 'Upcoming',
  planning: 'Planning',
  construction: 'Construction',
  completed: 'Completed',
  archived: 'Archived',
};

export const PROJECT_WORKSPACE_KPIS: readonly DashboardKpiItem[] = [
  {
    id: 'total-projects',
    label: 'Total projects',
    value: '—',
    hint: 'Active portfolio',
    icon: 'pi pi-briefcase',
    tone: 'primary',
  },
  {
    id: 'construction',
    label: 'Construction',
    value: '—',
    hint: 'In construction',
    icon: 'pi pi-hammer',
    tone: 'info',
  },
  {
    id: 'planning',
    label: 'Planning',
    value: '—',
    hint: 'In planning',
    icon: 'pi pi-map',
    tone: 'warning',
  },
  {
    id: 'completed',
    label: 'Completed',
    value: '—',
    hint: 'Delivered',
    icon: 'pi pi-check-circle',
    tone: 'success',
  },
];

export const PROJECT_WORKSPACE_QUICK_ACTIONS: readonly DashboardQuickActionItem[] = [
  {
    id: 'pqa1',
    label: 'Create project',
    description: 'Start a new development',
    icon: 'pi pi-plus-circle',
    route: '/builder-portal/projects/create',
    permission: 'id-07-project-unit:full',
    pinned: true,
    favorite: true,
  },
  {
    id: 'pqa2',
    label: 'Browse all projects',
    description: 'Enterprise grid with filters',
    icon: 'pi pi-th-large',
    route: '/builder-portal/projects/list',
    permission: 'id-07-project-unit:read',
    pinned: true,
  },
  {
    id: 'pqa3',
    label: 'Under construction',
    description: 'Projects currently in construction',
    icon: 'pi pi-hammer',
    route: '/builder-portal/projects/list',
    permission: 'id-07-project-unit:read',
    favorite: true,
  },
];

export const PROJECT_WORKSPACE_ACTIVITIES: readonly DashboardActivityItem[] = [
  {
    id: 'pa1',
    title: 'Project updated',
    description: 'Horizon Towers status set to Construction.',
    timestamp: '2 hours ago',
    icon: 'pi pi-flag',
    tone: 'success',
  },
  {
    id: 'pa2',
    title: 'New project created',
    description: 'Emerald Court entered planning.',
    timestamp: '1 day ago',
    icon: 'pi pi-plus-circle',
    tone: 'primary',
  },
];

/** @deprecated Use SEED_BUILDER_PROJECTS from projects.seed — kept for import compatibility */
export { SEED_BUILDER_PROJECTS as MOCK_PROJECTS } from './projects.seed';
