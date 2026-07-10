import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FooterNavigationComponent } from '@navigation/components/footer-navigation/footer-navigation.component';
import { PLATFORM_BRAND } from '@theme/config';
import { PUBLIC_WEBSITE_BRAND } from '../../config/public-website.config';
import { PublicNewsletterFormComponent } from '../newsletter-form/newsletter-form.component';

@Component({
  selector: 'app-public-footer',
  imports: [FooterNavigationComponent, PublicNewsletterFormComponent],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFooterComponent {
  readonly brand = PLATFORM_BRAND;
  readonly tagline = PUBLIC_WEBSITE_BRAND.tagline;
  readonly year = new Date().getFullYear();
}
