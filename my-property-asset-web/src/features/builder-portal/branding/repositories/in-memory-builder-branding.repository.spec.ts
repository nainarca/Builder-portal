import { TestBed } from '@angular/core/testing';

import { DEFAULT_BUILDER_BRANDING } from '../config/builder-branding.config';
import { InMemoryBuilderBrandingRepository } from './in-memory-builder-branding.repository';

describe('InMemoryBuilderBrandingRepository (P13)', () => {
  let repository: InMemoryBuilderBrandingRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InMemoryBuilderBrandingRepository],
    });
    repository = TestBed.inject(InMemoryBuilderBrandingRepository);
  });

  it('returns seeded branding for demo organization', () => {
    const record = repository.getByOrganizationId('org-builder-demo');
    expect(record).toBeTruthy();
    expect(record?.displayName).toBe('Horizon Builders');
  });

  it('upserts branding and updates lastUpdatedAt', () => {
    const updated = repository.upsert('org-test-branding', {
      ...DEFAULT_BUILDER_BRANDING,
      displayName: 'Test Builders',
      shortName: 'TB',
      socialLinks: { ...DEFAULT_BUILDER_BRANDING.socialLinks },
      media: { ...DEFAULT_BUILDER_BRANDING.media },
      theme: { ...DEFAULT_BUILDER_BRANDING.theme },
    });

    expect(updated.displayName).toBe('Test Builders');
    expect(updated.lastUpdatedAt).toBeTruthy();
    expect(repository.getByOrganizationId('org-test-branding')?.shortName).toBe('TB');
  });

  it('disables branding without deleting the record', () => {
    const disabled = repository.disable('org-builder-demo');
    expect(disabled?.enabled).toBeFalse();
    expect(repository.getByOrganizationId('org-builder-demo')?.enabled).toBeFalse();
  });

  it('restores default branding values', () => {
    repository.upsert('org-builder-demo', {
      ...DEFAULT_BUILDER_BRANDING,
      displayName: 'Temporary Name',
      socialLinks: { ...DEFAULT_BUILDER_BRANDING.socialLinks },
      media: { ...DEFAULT_BUILDER_BRANDING.media },
      theme: { ...DEFAULT_BUILDER_BRANDING.theme },
    });

    const restored = repository.restoreDefault('org-builder-demo');
    expect(restored.displayName).toBe(DEFAULT_BUILDER_BRANDING.displayName);
    expect(restored.enabled).toBeTrue();
  });
});
