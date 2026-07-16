import {
  Project,
  ProjectHierarchy,
  ProjectType,
} from '../../models/project.model';
import { BuildingMode } from '../models/building.model';

export type ProjectHierarchyRef = Pick<Project, 'projectType' | 'hierarchy'>;

/**
 * P9.1 project type → default hierarchy.
 *
 * Apartment / Commercial Tower → BUILDING_BASED (required)
 * Mixed Development → BUILDING_BASED default (optional — builder may choose DIRECT_UNITS)
 * Villa / Residential Plot / Farm Land → DIRECT_UNITS
 */
export function defaultHierarchyForProjectType(projectType: ProjectType): ProjectHierarchy {
  switch (projectType) {
    case 'villa':
    case 'residential-plot':
    case 'farm-land':
      return 'direct-units';
    case 'apartment':
    case 'commercial':
    case 'mixed-development':
    default:
      return 'building-based';
  }
}

/** Hierarchies the builder may select for a given project type. */
export function allowedHierarchiesForProjectType(
  projectType: ProjectType,
): readonly ProjectHierarchy[] {
  switch (projectType) {
    case 'apartment':
    case 'commercial':
      return ['building-based'];
    case 'villa':
    case 'residential-plot':
    case 'farm-land':
      return ['direct-units'];
    case 'mixed-development':
      return ['building-based', 'direct-units'];
    default:
      return ['building-based'];
  }
}

export function isHierarchyCompatible(
  projectType: ProjectType,
  hierarchy: ProjectHierarchy,
): boolean {
  return allowedHierarchiesForProjectType(projectType).includes(hierarchy);
}

/**
 * Building visibility / requirement from hierarchy (+ type for required vs optional).
 * Building module is unchanged — only hidden when DIRECT_UNITS.
 */
export function resolveBuildingMode(project: ProjectHierarchyRef): BuildingMode {
  if (project.hierarchy === 'direct-units') {
    return 'unsupported';
  }

  switch (project.projectType) {
    case 'apartment':
    case 'commercial':
      return 'required';
    case 'mixed-development':
      return 'optional';
    default:
      return 'optional';
  }
}

export function buildingsAreRequired(project: ProjectHierarchyRef): boolean {
  return resolveBuildingMode(project) === 'required';
}

export function buildingsAreSupported(project: ProjectHierarchyRef): boolean {
  return resolveBuildingMode(project) !== 'unsupported';
}

/** Prep for Units: building parent required only when hierarchy is BUILDING_BASED. */
export function unitRequiresBuilding(project: ProjectHierarchyRef): boolean {
  return project.hierarchy === 'building-based';
}

export function isBuildingBased(project: ProjectHierarchyRef): boolean {
  return project.hierarchy === 'building-based';
}

export function isDirectUnits(project: ProjectHierarchyRef): boolean {
  return project.hierarchy === 'direct-units';
}
