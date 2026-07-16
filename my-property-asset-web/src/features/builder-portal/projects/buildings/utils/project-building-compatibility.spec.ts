import {
  allowedHierarchiesForProjectType,
  buildingsAreRequired,
  buildingsAreSupported,
  defaultHierarchyForProjectType,
  isHierarchyCompatible,
  resolveBuildingMode,
  unitRequiresBuilding,
} from './project-building-compatibility';

describe('project-building-compatibility (P9.1)', () => {
  it('defaults hierarchy by project type', () => {
    expect(defaultHierarchyForProjectType('apartment')).toBe('building-based');
    expect(defaultHierarchyForProjectType('commercial')).toBe('building-based');
    expect(defaultHierarchyForProjectType('mixed-development')).toBe('building-based');
    expect(defaultHierarchyForProjectType('villa')).toBe('direct-units');
    expect(defaultHierarchyForProjectType('residential-plot')).toBe('direct-units');
    expect(defaultHierarchyForProjectType('farm-land')).toBe('direct-units');
  });

  it('restricts allowed hierarchies by type', () => {
    expect(allowedHierarchiesForProjectType('apartment')).toEqual(['building-based']);
    expect(allowedHierarchiesForProjectType('villa')).toEqual(['direct-units']);
    expect(allowedHierarchiesForProjectType('mixed-development')).toEqual([
      'building-based',
      'direct-units',
    ]);
    expect(isHierarchyCompatible('apartment', 'direct-units')).toBeFalse();
    expect(isHierarchyCompatible('mixed-development', 'direct-units')).toBeTrue();
  });

  it('hides buildings for DIRECT_UNITS', () => {
    expect(
      resolveBuildingMode({ projectType: 'villa', hierarchy: 'direct-units' }),
    ).toBe('unsupported');
    expect(
      buildingsAreSupported({ projectType: 'villa', hierarchy: 'direct-units' }),
    ).toBeFalse();
    expect(
      unitRequiresBuilding({ projectType: 'villa', hierarchy: 'direct-units' }),
    ).toBeFalse();
  });

  it('requires buildings for apartment/commercial BUILDING_BASED', () => {
    expect(
      resolveBuildingMode({ projectType: 'apartment', hierarchy: 'building-based' }),
    ).toBe('required');
    expect(
      buildingsAreRequired({ projectType: 'commercial', hierarchy: 'building-based' }),
    ).toBeTrue();
    expect(
      unitRequiresBuilding({ projectType: 'apartment', hierarchy: 'building-based' }),
    ).toBeTrue();
  });

  it('treats mixed BUILDING_BASED as optional buildings', () => {
    expect(
      resolveBuildingMode({
        projectType: 'mixed-development',
        hierarchy: 'building-based',
      }),
    ).toBe('optional');
    expect(
      buildingsAreSupported({
        projectType: 'mixed-development',
        hierarchy: 'building-based',
      }),
    ).toBeTrue();
    expect(
      buildingsAreRequired({
        projectType: 'mixed-development',
        hierarchy: 'building-based',
      }),
    ).toBeFalse();
  });
});
