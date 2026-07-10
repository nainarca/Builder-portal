import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-host',
  imports: [RouterOutlet],
  templateUrl: './layout-host.component.html',
  styleUrl: './layout-host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHostComponent {}
