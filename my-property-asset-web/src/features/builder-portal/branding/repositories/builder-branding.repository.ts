import {
  BuilderBrandingFormModel,
  BuilderBrandingProfile,
} from '../models/builder-branding.model';

export abstract class BuilderBrandingRepository {
  abstract getByOrganizationId(organizationId: string): BuilderBrandingProfile | undefined;
  abstract upsert(organizationId: string, model: BuilderBrandingFormModel): BuilderBrandingProfile;
  abstract reset(organizationId: string): BuilderBrandingProfile;
  abstract disable(organizationId: string): BuilderBrandingProfile | undefined;
  abstract restoreDefault(organizationId: string): BuilderBrandingProfile;
}
