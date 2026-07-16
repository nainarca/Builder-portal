export { BUILDING_ROUTES } from './buildings.routes';
export { BuildingService } from './services/building.service';
export { provideBuilderBuildings } from './providers/building.providers';
export {
  allowedHierarchiesForProjectType,
  buildingsAreRequired,
  buildingsAreSupported,
  defaultHierarchyForProjectType,
  isBuildingBased,
  isDirectUnits,
  isHierarchyCompatible,
  resolveBuildingMode,
  unitRequiresBuilding,
} from './utils/project-building-compatibility';
export { buildingHierarchyGuard } from './guards/building-hierarchy.guard';
