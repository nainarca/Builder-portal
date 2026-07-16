import {
  projectHierarchyFromDb,
  projectHierarchyToDb,
  projectTypeFromDb,
  projectTypeToDb,
} from './project.model';

describe('Project model helpers (P8/P9.1)', () => {
  it('maps project types to and from DB snake_case', () => {
    expect(projectTypeToDb('residential-plot')).toBe('residential_plot');
    expect(projectTypeToDb('mixed-development')).toBe('mixed_development');
    expect(projectTypeToDb('farm-land')).toBe('farm_land');
    expect(projectTypeFromDb('residential_plot')).toBe('residential-plot');
    expect(projectTypeFromDb('mixed_development')).toBe('mixed-development');
    expect(projectTypeFromDb('farm_land')).toBe('farm-land');
  });

  it('maps hierarchy to and from DB snake_case', () => {
    expect(projectHierarchyToDb('building-based')).toBe('building_based');
    expect(projectHierarchyToDb('direct-units')).toBe('direct_units');
    expect(projectHierarchyFromDb('building_based')).toBe('building-based');
    expect(projectHierarchyFromDb('direct_units')).toBe('direct-units');
  });
});
