import { TestBed } from '@angular/core/testing';

import { DEFAULT_COMMUNICATION_FORM } from '../config/communications.config';
import { CommunicationRepository } from '../repositories/communication.repository';
import { InMemoryCommunicationRepository } from '../repositories/in-memory-communication.repository';

describe('InMemoryCommunicationRepository (P14)', () => {
  let repository: InMemoryCommunicationRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InMemoryCommunicationRepository,
        { provide: CommunicationRepository, useExisting: InMemoryCommunicationRepository },
      ],
    });
    repository = TestBed.inject(InMemoryCommunicationRepository);
  });

  it('lists seeded communications for demo organization', () => {
    const result = repository.list('org-builder-demo', {
      search: '',
      communicationType: 'all',
      status: 'all',
      priority: 'all',
      projectId: '',
      publishDateFrom: '',
      publishDateTo: '',
      sortField: 'updatedAt',
      sortDirection: 'desc',
      page: 1,
      pageSize: 10,
    });
    expect(result.total).toBeGreaterThan(0);
  });

  it('creates and publishes a communication with audit trail', () => {
    const created = repository.create('org-builder-demo', {
      ...DEFAULT_COMMUNICATION_FORM,
      title: 'Test communication',
      shortDescription: 'Test body',
      audienceConfig: { projectId: 'proj-001' },
    }, 'Tester');
    const published = repository.publish(created.id, 'Tester');
    expect(published?.status).toBe('published');
    expect(repository.listAudit(created.id).some((event) => event.action === 'published')).toBeTrue();
  });

  it('schedules a communication', () => {
    const created = repository.create('org-builder-demo', DEFAULT_COMMUNICATION_FORM, 'Tester');
    const scheduled = repository.schedule(created.id, 'Tester', '2026-12-01T10:00:00Z');
    expect(scheduled?.status).toBe('scheduled');
    expect(scheduled?.publishAt).toBe('2026-12-01T10:00:00Z');
  });
});
