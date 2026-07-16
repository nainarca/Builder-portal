import { TestBed } from '@angular/core/testing';

import { ProjectStoreService } from '../../services/project-store.service';
import { BuilderBuildingRepository } from '../repositories/builder-building.repository';
import { InMemoryBuilderBuildingRepository } from '../repositories/in-memory-builder-building.repository';
import { BuildingService } from './building.service';

describe('BuildingService (P9)', () => {
  let service: BuildingService;
  let repository: InMemoryBuilderBuildingRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InMemoryBuilderBuildingRepository,
        { provide: BuilderBuildingRepository, useExisting: InMemoryBuilderBuildingRepository },
        BuildingService,
        {
          provide: ProjectStoreService,
          useValue: {
            getById: (id: string) =>
              id === 'proj-001'
                ? {
                    id: 'proj-001',
                    organizationId: 'org-builder-demo',
                    name: 'Horizon Towers',
                    projectType: 'apartment',
                    hierarchy: 'building-based',
                  }
                : undefined,
          },
        },
      ],
    });
    service = TestBed.inject(BuildingService);
    repository = TestBed.inject(InMemoryBuilderBuildingRepository);
  });

  it('lists buildings for a project with search and status filter', () => {
    const result = service.query({
      projectId: 'proj-001',
      search: 'tower a',
      statusFilter: 'construction',
      includeArchived: false,
      sortField: 'displayOrder',
      sortDirection: 'asc',
      page: 1,
      pageSize: 10,
    });
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.every((b) => b.projectId === 'proj-001')).toBeTrue();
  });

  it('creates a building and enforces unique codes per project', () => {
    const created = service.create('proj-001', {
      ...service.emptyFormModel(10),
      name: 'Tower C',
      code: 'HZT-C',
      floorsCount: 20,
      unitsCount: 80,
    });
    expect(created.code).toBe('HZT-C');
    expect(created.projectId).toBe('proj-001');

    expect(() =>
      service.create('proj-001', {
        ...service.emptyFormModel(11),
        name: 'Duplicate',
        code: 'HZT-C',
      }),
    ).toThrowError(/already exists/);
  });

  it('prevents using a building from another project via get + project check', () => {
    const building = service.getById('bld-001');
    expect(building?.projectId).toBe('proj-001');
    expect(building?.projectId).not.toBe('proj-002');
  });

  it('archives with soft delete and restores', () => {
    const created = service.create('proj-001', {
      ...service.emptyFormModel(20),
      name: 'Temp Wing',
      code: 'TMP-1',
    });
    const archived = service.archive(created.id);
    expect(archived?.status).toBe('archived');
    expect(archived?.archived).toBeTrue();

    const restored = service.restore(created.id);
    expect(restored?.archived).toBeFalse();
  });

  it('exposes dashboard stats for a project', () => {
    const stats = service.dashboardStats('proj-001');
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.byStatus.construction + stats.byStatus.planning).toBeGreaterThan(0);
  });

  it('repository rejects cross-project code uniqueness only within project', () => {
    expect(repository.codeExists('proj-001', 'HZT-A')).toBeTrue();
    expect(repository.codeExists('proj-002', 'HZT-A')).toBeFalse();
  });

  it('rejects building create for DIRECT_UNITS projects', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        InMemoryBuilderBuildingRepository,
        { provide: BuilderBuildingRepository, useExisting: InMemoryBuilderBuildingRepository },
        BuildingService,
        {
          provide: ProjectStoreService,
          useValue: {
            getById: () => ({
              id: 'proj-villa',
              organizationId: 'org-builder-demo',
              name: 'Villas',
              projectType: 'villa',
              hierarchy: 'direct-units',
            }),
          },
        },
      ],
    });
    const directService = TestBed.inject(BuildingService);
    expect(() =>
      directService.create('proj-villa', {
        ...directService.emptyFormModel(1),
        name: 'Block A',
        code: 'VA',
      }),
    ).toThrowError(/DIRECT_UNITS/);
  });
});
