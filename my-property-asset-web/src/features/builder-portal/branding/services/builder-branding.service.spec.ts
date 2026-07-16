import { TestBed } from '@angular/core/testing';

import { CurrentOrganizationService, OrganizationBrandingService } from '@core/organization-context';
import { BrandPreviewService } from '@features/super-admin/branding/services/brand-preview.service';
import { ThemeService } from '@theme/services/theme.service';
import { BuilderOrganizationService } from '../../organization/services/builder-organization.service';
import { DEFAULT_BUILDER_BRANDING } from '../config/builder-branding.config';
import { BuilderBrandingRepository } from '../repositories/builder-branding.repository';
import { InMemoryBuilderBrandingRepository } from '../repositories/in-memory-builder-branding.repository';
import { BuilderBrandingService } from './builder-branding.service';

describe('BuilderBrandingService (P13)', () => {
  let service: BuilderBrandingService;
  let repository: InMemoryBuilderBrandingRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BuilderBrandingService,
        { provide: BuilderBrandingRepository, useExisting: InMemoryBuilderBrandingRepository },
        {
          provide: CurrentOrganizationService,
          useValue: { organizationId: () => 'org-builder-demo', organizationName: () => 'Horizon Builders' },
        },
        {
          provide: OrganizationBrandingService,
          useValue: { applyPlatformBrand: jasmine.createSpy('applyPlatformBrand') },
        },
        {
          provide: ThemeService,
          useValue: { applyBuilderBrand: jasmine.createSpy('applyBuilderBrand') },
        },
        {
          provide: BuilderOrganizationService,
          useValue: {
            activeCompany: () => ({ id: 'bc-demo-001' }),
            updateCompanyProfile: jasmine.createSpy('updateCompanyProfile'),
          },
        },
        {
          provide: BrandPreviewService,
          useValue: { applyToElement: jasmine.createSpy('applyToElement') },
        },
      ],
    });

    service = TestBed.inject(BuilderBrandingService);
    repository = TestBed.inject(InMemoryBuilderBrandingRepository);
  });

  it('computes branding completion warnings for missing assets', () => {
    const completion = service.completion();
    expect(completion.completionPercent).toBeLessThan(100);
    expect(completion.missingItems).toContain('Logo');
    expect(completion.missingItems).toContain('Favicon');
  });

  it('maps branding profile to Flutter payload contract', () => {
    const payload = service.toFlutterPayload(service.activeBranding());
    expect(payload.organizationId).toBe('org-builder-demo');
    expect(payload.displayName).toBe('Horizon Builders');
    expect(payload.theme.buttonStyle).toBe('rounded');
    expect(payload.primaryColor).toBeTruthy();
  });

  it('saves branding and applies builder theme', () => {
    const theme = TestBed.inject(ThemeService);
    const saved = service.save({
      ...DEFAULT_BUILDER_BRANDING,
      displayName: 'Updated Horizon',
      media: {
        ...DEFAULT_BUILDER_BRANDING.media,
        logo: 'https://cdn.example.com/logo.svg',
      },
      socialLinks: { ...DEFAULT_BUILDER_BRANDING.socialLinks },
      theme: { ...DEFAULT_BUILDER_BRANDING.theme },
    });

    expect(saved.displayName).toBe('Updated Horizon');
    expect(theme.applyBuilderBrand).toHaveBeenCalled();
    expect(repository.getByOrganizationId('org-builder-demo')?.displayName).toBe('Updated Horizon');
  });

  it('disables branding and falls back to platform brand', () => {
    const orgBranding = TestBed.inject(OrganizationBrandingService);
    const disabled = service.disable();
    expect(disabled?.enabled).toBeFalse();
    expect(orgBranding.applyPlatformBrand).toHaveBeenCalled();
  });
});
