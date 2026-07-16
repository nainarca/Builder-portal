import {
  projectTypeFromDb,
  projectTypeToDb,
} from './project.model';

describe('Project model helpers (P8)', () => {
  it('maps project types to and from DB snake_case', () => {
    expect(projectTypeToDb('residential-plot')).toBe('residential_plot');
    expect(projectTypeToDb('mixed-development')).toBe('mixed_development');
    expect(projectTypeFromDb('residential_plot')).toBe('residential-plot');
    expect(projectTypeFromDb('mixed_development')).toBe('mixed-development');
  });
});
