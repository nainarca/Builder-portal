import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FooterNavigationComponent } from '../../../navigation/components/footer-navigation/footer-navigation.component';

@Component({
  selector: 'app-footer-placeholder',
  imports: [FooterNavigationComponent],
  templateUrl: './footer-placeholder.component.html',
  styleUrl: './footer-placeholder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterPlaceholderComponent {
  readonly brand = input('MyPropertyAsset');
  readonly showNavigation = input(true);
}
