import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-divider',
  templateUrl: './section-divider.component.html',
  styleUrl: './section-divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionDividerComponent {
  readonly variant = input<'default' | 'gradient'>('default');
}
