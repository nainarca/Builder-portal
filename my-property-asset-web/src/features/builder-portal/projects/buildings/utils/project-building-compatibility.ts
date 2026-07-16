import { ProjectType } from '../../models/project.model';
import { BuildingMode } from '../models/building.model';

/**
 * P9 project ↔ building compatibility.
 * Apartment / Commercial / Mixed → buildings required
 * Villa / Residential Plot → buildings optional
 */
export function resolveBuildingMode(projectType: ProjectType): BuildingMode {
  switch (projectType) {
    case 'apartment':
    case 'commercial':
    case 'mixed-development':
      return 'required';
    case 'villa':
    case 'residential-plot':
      return 'optional';
    default:
      return 'optional';
  }
}

export function buildingsAreRequired(projectType: ProjectType): boolean {
  return resolveBuildingMode(projectType) === 'required';
}

export function buildingsAreSupported(projectType: ProjectType): boolean {
  return resolveBuildingMode(projectType) !== 'unsupported';
}
