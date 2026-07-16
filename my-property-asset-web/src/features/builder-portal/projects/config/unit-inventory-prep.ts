/**
 * P9.1 Unit inventory preparation — types only.
 * Do NOT implement Unit Management here; architecture is unchanged until Units phase.
 */

export type PreparedUnitType =
  | 'apartment-flat'
  | 'villa'
  | 'residential-plot'
  | 'commercial-unit'
  | 'office'
  | 'warehouse';

export const PREPARED_UNIT_TYPE_LABELS: Readonly<Record<PreparedUnitType, string>> = {
  'apartment-flat': 'Apartment Flat',
  villa: 'Villa',
  'residential-plot': 'Residential Plot',
  'commercial-unit': 'Commercial Unit',
  office: 'Office',
  warehouse: 'Warehouse',
};

/** Suggested unit types by project type (guidance for a future Units phase). */
export const SUGGESTED_UNIT_TYPES_BY_PROJECT: Readonly<
  Record<string, readonly PreparedUnitType[]>
> = {
  apartment: ['apartment-flat'],
  villa: ['villa'],
  'residential-plot': ['residential-plot'],
  commercial: ['commercial-unit', 'office', 'warehouse'],
  'mixed-development': [
    'apartment-flat',
    'villa',
    'commercial-unit',
    'office',
    'warehouse',
  ],
  'farm-land': ['residential-plot'],
};
