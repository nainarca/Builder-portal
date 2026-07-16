import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ButtonComponent, FormSectionComponent } from '@shared/ui';
import { BuilderOrganizationService } from '../services/builder-organization.service';

@Component({
  selector: 'app-builder-company-page',
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, FormSectionComponent],
  templateUrl: './builder-company-page.component.html',
  styleUrl: './builder-company-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderCompanyPageComponent {
  private readonly organizationService = inject(BuilderOrganizationService);

  readonly company = this.organizationService.activeCompany;

  readonly form = new FormGroup({
    legalName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    tradingName: new FormControl('', { nonNullable: true }),
    primaryContactName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    primaryContactEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    primaryContactPhone: new FormControl('', { nonNullable: true }),
    region: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    const current = this.company();
    if (current) {
      this.form.patchValue({
        legalName: current.legalName,
        tradingName: current.tradingName ?? '',
        primaryContactName: current.primaryContactName,
        primaryContactEmail: current.primaryContactEmail,
        primaryContactPhone: current.primaryContactPhone ?? '',
        region: current.region ?? '',
      });
    }
  }

  save(): void {
    const current = this.company();
    if (!current || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.organizationService.updateCompanyProfile(current.id, {
      legalName: value.legalName,
      tradingName: value.tradingName || undefined,
      primaryContactName: value.primaryContactName,
      primaryContactEmail: value.primaryContactEmail,
      primaryContactPhone: value.primaryContactPhone || undefined,
      region: value.region || undefined,
    });
  }
}
