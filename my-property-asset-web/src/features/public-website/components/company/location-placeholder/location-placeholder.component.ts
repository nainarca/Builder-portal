import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-location-placeholder',
  templateUrl: './location-placeholder.component.html',
  styleUrl: './location-placeholder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationPlaceholderComponent {
  readonly label = input<string>('Interactive map coming soon');
}
