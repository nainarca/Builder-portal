import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { PLATFORM_DESIGN_TOKENS } from '../config';

export const MyPropertyAssetPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: PLATFORM_DESIGN_TOKENS.colors.primary,
      600: PLATFORM_DESIGN_TOKENS.colors.primaryHover,
      700: '#102239',
      800: '#0a1626',
      900: '#050b13',
      950: '#020609',
    },
  },
});
