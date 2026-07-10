import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { ApplicationConfigurationService } from '../services/application-configuration.service';

export const configurationResolver: ResolveFn<boolean> = async () => {
  const configurationService = inject(ApplicationConfigurationService);
  await configurationService.reload();
  return true;
};
