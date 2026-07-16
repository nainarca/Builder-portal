import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const MyPropertyAssetPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fffbeb',
      100: '#fff3c4',
      200: '#ffe58a',
      300: '#ffd54f',
      400: '#ffc824',
      500: '#ffc107',
      600: '#e6ac00',
      700: '#b38300',
      800: '#805e00',
      900: '#4d3800',
      950: '#332500',
    },
  },
});
