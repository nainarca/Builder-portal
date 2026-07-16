import {
  buildingsAreRequired,
  buildingsAreSupported,
  resolveBuildingMode,
} from './project-building-compatibility';

describe('project-building-compatibility (P9)', () => {
  it('marks apartment/commercial/mixed as required', () => {
    expect(resolveBuildingMode('apartment')).toBe('required');
    expect(resolveBuildingMode('commercial')).toBe('required');
    expect(resolveBuildingMode('mixed-development')).toBe('required');
    expect(buildingsAreRequired('apartment')).toBeTrue();
  });

  it('marks villa/plot as optional but supported', () => {
    expect(resolveBuildingMode('villa')).toBe('optional');
    expect(resolveBuildingMode('residential-plot')).toBe('optional');
    expect(buildingsAreSupported('villa')).toBeTrue();
    expect(buildingsAreRequired('villa')).toBeFalse();
  });
});
