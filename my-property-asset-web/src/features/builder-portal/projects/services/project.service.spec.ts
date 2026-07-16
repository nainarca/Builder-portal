import { TestBed } from '@angular/core/testing';

import { CurrentOrganizationService } from '@core/organization-context';

import { BuilderProjectRepository } from '../repositories/builder-project.repository';
import { InMemoryBuilderProjectRepository } from '../repositories/in-memory-builder-project.repository';
import { ProjectService } from './project.service';

describe('ProjectService (P8)', () => {
  let service: ProjectService;
  let repository: InMemoryBuilderProjectRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InMemoryBuilderProjectRepository,
        { provide: BuilderProjectRepository, useExisting: InMemoryBuilderProjectRepository },
        ProjectService,
        {
          provide: CurrentOrganizationService,
          useValue: {
            organizationId: () => 'org-builder-demo',
            snapshot: () => ({
              organizationId: 'org-builder-demo',
              organizationName: 'Horizon Builders',
              role: 'builder-org-owner',
            }),
          },
        },
      ],
    });
    service = TestBed.inject(ProjectService);
    repository = TestBed.inject(InMemoryBuilderProjectRepository);
  });

  it('lists projects with search and status filter', () => {
    const result = service.query({
      search: 'horizon',
      statusFilter: 'construction',
      typeFilter: 'all',
      cityFilter: '',
      includeArchived: false,
      sortField: 'name',
      sortDirection: 'asc',
      page: 1,
      pageSize: 10,
    });

    expect(result.total).toBeGreaterThan(0);
    expect(result.items.every((p) => p.name.toLowerCase().includes('horizon'))).toBeTrue();
  });

  it('creates a project with required P8/P9.1 fields', () => {
    const created = service.create({
      name: 'Lakeview Apartments',
      code: 'LVA-01',
      description: 'Waterfront apartments',
      projectType: 'apartment',
      hierarchy: 'building-based',
      status: 'planning',
      addressLine: '1 Lake Road',
      city: 'Kochi',
      state: 'Kerala',
      postalCode: '682001',
      latitude: '9.9312',
      longitude: '76.2673',
      launchDate: '2026-08-01',
      expectedCompletionDate: '2029-08-01',
      bannerUrl: '',
      logoUrl: '',
    });

    expect(created.id).toBeTruthy();
    expect(created.projectType).toBe('apartment');
    expect(created.hierarchy).toBe('building-based');
    expect(created.location.city).toBe('Kochi');
    expect(service.getById(created.id)?.name).toBe('Lakeview Apartments');
  });

  it('creates a DIRECT_UNITS villa community without buildings nav support', () => {
    const created = service.create({
      ...service.emptyFormModel(),
      name: 'Palm Villas',
      code: 'PV-01',
      projectType: 'villa',
      hierarchy: 'direct-units',
      city: 'Goa',
    });
    expect(created.hierarchy).toBe('direct-units');
    expect(created.projectType).toBe('villa');
  });

  it('archives and restores a project', () => {
    const created = service.create({
      ...service.emptyFormModel(),
      name: 'Archive Me',
      code: 'ARC-1',
      city: 'Delhi',
    });

    const archived = service.archive(created.id);
    expect(archived?.status).toBe('archived');
    expect(archived?.archived).toBeTrue();

    const restored = service.restore(created.id);
    expect(restored?.archived).toBeFalse();
    expect(restored?.status).not.toBe('archived');
  });

  it('exposes dashboard stats by status', () => {
    const stats = service.dashboardStats();
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.byStatus.construction + stats.byStatus.planning).toBeGreaterThan(0);
    expect(stats.recent.length).toBeGreaterThan(0);
  });

  it('filters by project type', () => {
    const villas = repository.list(
      {
        search: '',
        statusFilter: 'all',
        typeFilter: 'villa',
        cityFilter: '',
        includeArchived: true,
        sortField: 'name',
        sortDirection: 'asc',
        page: 1,
        pageSize: 50,
      },
      'org-builder-demo',
    );
    expect(villas.items.every((p) => p.projectType === 'villa')).toBeTrue();
  });
});
