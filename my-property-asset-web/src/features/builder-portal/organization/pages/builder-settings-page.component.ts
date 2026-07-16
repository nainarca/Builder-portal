import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CurrentOrganizationService } from '@core/organization-context';
import { BuilderOrganizationService } from '../services/builder-organization.service';

@Component({
  selector: 'app-builder-settings-page',
  imports: [RouterLink],
  templateUrl: './builder-settings-page.component.html',
  styleUrl: './builder-settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderSettingsPageComponent {
  private readonly organizationService = inject(BuilderOrganizationService);
  private readonly currentOrganization = inject(CurrentOrganizationService);

  readonly company = this.organizationService.activeCompany;
  readonly organizationName = this.currentOrganization.organizationName;
  readonly organizationId = this.currentOrganization.organizationId;
}
