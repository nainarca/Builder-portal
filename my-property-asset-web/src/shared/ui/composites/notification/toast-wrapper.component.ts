import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ToastHostComponent } from '../../primitives/toast/toast-host.component';

@Component({
  selector: 'app-toast-wrapper',
  imports: [ToastHostComponent],
  template: `<app-toast-host />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastWrapperComponent {}
