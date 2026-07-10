import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { ThemeContext } from '../models';
import { ThemeService } from '../services';

export const themeResolver: ResolveFn<ThemeContext> = () => {
  const themeService = inject(ThemeService);
  return themeService.context();
};
