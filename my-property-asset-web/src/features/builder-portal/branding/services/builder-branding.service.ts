import { Injectable, computed, inject } from '@angular/core';

import { CurrentOrganizationService, OrganizationBrandingService } from '@core/organization-context';
import { BrandPreviewService } from '@features/super-admin/branding/services/brand-preview.service';
import { ThemeService } from '@theme/services/theme.service';
import { BrandConfiguration } from '@theme/models';
import { BuilderOrganizationService } from '../../organization/services/builder-organization.service';
import {
  buildStorageAssets,
  createBrandingProfile,
  DEFAULT_BUILDER_BRANDING,
} from '../config/builder-branding.config';
import {
  BrandingCompletionStatus,
  BuilderBrandingFormModel,
  BuilderBrandingProfile,
  BuilderBrandingStorageAsset,
  FlutterBrandingPayload,
} from '../models/builder-branding.model';
import { BuilderBrandingRepository } from '../repositories/builder-branding.repository';

@Injectable({ providedIn: 'root' })
export class BuilderBrandingService {
  private readonly repository = inject(BuilderBrandingRepository);
  private readonly currentOrganization = inject(CurrentOrganizationService);
  private readonly orgBranding = inject(OrganizationBrandingService);
  private readonly theme = inject(ThemeService);
  private readonly builderOrg = inject(BuilderOrganizationService);
  readonly preview = inject(BrandPreviewService);

  readonly activeBranding = computed(() => {
    const organizationId = this.resolveOrganizationId();
    return (
      this.repository.getByOrganizationId(organizationId) ??
      this.repository.upsert(organizationId, {
        ...DEFAULT_BUILDER_BRANDING,
        companyName: this.currentOrganization.organizationName() ?? DEFAULT_BUILDER_BRANDING.companyName,
      })
    );
  });

  readonly completion = computed(() => this.computeCompletion(this.activeBranding()));
  readonly storageAssets = computed<readonly BuilderBrandingStorageAsset[]>(() =>
    buildStorageAssets(this.activeBranding().organizationId),
  );

  save(model: BuilderBrandingFormModel): BuilderBrandingProfile {
    const organizationId = this.activeBranding().organizationId;
    const updated = this.repository.upsert(organizationId, model);
    this.builderOrg.updateCompanyProfile(this.builderOrg.activeCompany()?.id ?? '', {
      whiteLabelEnabled: updated.enabled,
    });
    this.apply(updated);
    return updated;
  }

  reset(): BuilderBrandingProfile {
    const updated = this.repository.reset(this.activeBranding().organizationId);
    this.apply(updated);
    return updated;
  }

  disable(): BuilderBrandingProfile | undefined {
    const updated = this.repository.disable(this.activeBranding().organizationId);
    if (updated) {
      this.builderOrg.updateCompanyProfile(this.builderOrg.activeCompany()?.id ?? '', {
        whiteLabelEnabled: false,
      });
      this.orgBranding.applyPlatformBrand();
    }
    return updated;
  }

  restoreDefault(): BuilderBrandingProfile {
    const updated = this.repository.restoreDefault(this.activeBranding().organizationId);
    this.apply(updated);
    return updated;
  }

  getBrandingForOrganization(organizationId: string): BuilderBrandingProfile {
    return (
      this.repository.getByOrganizationId(organizationId) ??
      this.repository.upsert(organizationId, {
        ...DEFAULT_BUILDER_BRANDING,
      })
    );
  }

  resetForOrganization(organizationId: string): BuilderBrandingProfile {
    return this.repository.reset(organizationId);
  }

  disableForOrganization(organizationId: string): BuilderBrandingProfile | undefined {
    return this.repository.disable(organizationId);
  }

  restoreDefaultForOrganization(organizationId: string): BuilderBrandingProfile {
    return this.repository.restoreDefault(organizationId);
  }

  getCompletionForOrganization(organizationId: string): BrandingCompletionStatus {
    return this.computeCompletion(this.getBrandingForOrganization(organizationId));
  }

  toFormModel(profile: BuilderBrandingProfile): BuilderBrandingFormModel {
    return {
      companyName: profile.companyName,
      displayName: profile.displayName,
      shortName: profile.shortName,
      applicationName: profile.applicationName,
      tagline: profile.tagline,
      primaryColor: profile.primaryColor,
      secondaryColor: profile.secondaryColor,
      accentColor: profile.accentColor,
      supportEmail: profile.supportEmail,
      supportPhone: profile.supportPhone,
      website: profile.website,
      officeAddress: profile.officeAddress,
      copyright: profile.copyright,
      termsUrl: profile.termsUrl,
      privacyPolicyUrl: profile.privacyPolicyUrl,
      socialLinks: { ...profile.socialLinks },
      media: { ...profile.media },
      theme: { ...profile.theme },
      enabled: profile.enabled,
    };
  }

  toBrandConfiguration(profile: BuilderBrandingProfile): BrandConfiguration {
    return {
      id: profile.organizationId,
      type: 'builder',
      name: profile.applicationName,
      shortName: profile.shortName,
      primaryColor: profile.primaryColor,
      secondaryColor: profile.secondaryColor,
      accentColor: profile.accentColor,
      favicon: profile.media.favicon || undefined,
      logo: profile.media.logo
        ? { src: profile.media.logo, alt: profile.displayName }
        : undefined,
      logoVariants: {
        light: {
          src: profile.media.logo || 'assets/branding/platform/logo-light.svg',
          alt: `${profile.displayName} light logo`,
        },
        dark: {
          src: profile.media.darkLogo || profile.media.logo || 'assets/branding/platform/logo-dark.svg',
          alt: `${profile.displayName} dark logo`,
        },
        compact: {
          src: profile.media.logo || 'assets/branding/platform/logo-compact.svg',
          alt: profile.shortName,
        },
        loading: {
          src: profile.media.mobileSplashImage || profile.media.logo || 'assets/branding/platform/logo-loading.svg',
          alt: `${profile.displayName} loading logo`,
        },
      },
      loadingLogo: profile.media.mobileSplashImage
        ? { src: profile.media.mobileSplashImage, alt: `${profile.displayName} splash` }
        : undefined,
      browserThemeColor: profile.primaryColor,
      typography: {
        fontFamily: this.mapTypography(profile.theme.typography),
      },
      manifest: {
        name: profile.applicationName,
        shortName: profile.shortName,
        themeColor: profile.primaryColor,
        backgroundColor: '#ffffff',
      },
      emailBranding: {
        headerBackgroundColor: profile.primaryColor,
        footerTextColor: profile.secondaryColor,
        logoUrl: profile.media.logo || undefined,
      },
    };
  }

  toFlutterPayload(profile: BuilderBrandingProfile): FlutterBrandingPayload {
    return {
      organizationId: profile.organizationId,
      displayName: profile.displayName,
      shortName: profile.shortName,
      applicationName: profile.applicationName,
      tagline: profile.tagline,
      logo: profile.media.logo,
      darkLogo: profile.media.darkLogo,
      favicon: profile.media.favicon,
      primaryColor: profile.primaryColor,
      secondaryColor: profile.secondaryColor,
      accentColor: profile.accentColor,
      supportEmail: profile.supportEmail,
      supportPhone: profile.supportPhone,
      website: profile.website,
      officeAddress: profile.officeAddress,
      socialLinks: profile.socialLinks,
      termsUrl: profile.termsUrl,
      privacyPolicyUrl: profile.privacyPolicyUrl,
      theme: profile.theme,
    };
  }

  previewApply(profile: BuilderBrandingProfile): void {
    if (!profile.enabled) {
      this.orgBranding.applyPlatformBrand();
      return;
    }
    this.theme.applyBuilderBrand(this.toBrandConfiguration(profile));
  }

  private apply(profile: BuilderBrandingProfile): void {
    this.previewApply(profile);
  }

  private computeCompletion(profile: BuilderBrandingProfile): BrandingCompletionStatus {
    const missingItems: string[] = [];
    if (!profile.displayName.trim()) missingItems.push('Display name');
    if (!profile.shortName.trim()) missingItems.push('Short name');
    if (!profile.media.logo.trim()) missingItems.push('Logo');
    if (!profile.media.favicon.trim()) missingItems.push('Favicon');
    if (!profile.supportEmail.trim()) missingItems.push('Support email');
    if (!profile.website.trim()) missingItems.push('Website');
    if (!profile.termsUrl.trim()) missingItems.push('Terms URL');
    if (!profile.privacyPolicyUrl.trim()) missingItems.push('Privacy policy URL');

    const completionPercent = Math.max(0, Math.round(((8 - missingItems.length) / 8) * 100));
    return {
      completionPercent,
      missingItems,
      statusLabel:
        completionPercent === 100 ? 'Configured' : completionPercent >= 50 ? 'In Progress' : 'Draft',
    };
  }

  private resolveOrganizationId(): string {
    return this.currentOrganization.organizationId() ?? 'org-builder-demo';
  }

  private mapTypography(value: BuilderBrandingProfile['theme']['typography']): string {
    switch (value) {
      case 'dm-sans':
        return "'DM Sans', system-ui, sans-serif";
      case 'plus-jakarta':
        return "'Plus Jakarta Sans', system-ui, sans-serif";
      case 'system':
        return 'system-ui, sans-serif';
      case 'inter':
      default:
        return "'Inter', system-ui, sans-serif";
    }
  }
}
