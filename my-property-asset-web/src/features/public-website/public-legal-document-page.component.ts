import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SeoService } from '../../infrastructure/seo/services/seo.service';
import { findLegalDocumentBySlug } from './config/legal-page.config';
import { LegalDocument } from './models/support.model';
import {
  createBreadcrumbSchema,
  createLegalWebPageSchema,
  createOrganizationSchema,
} from './utils/support-seo.utils';
import { LegalDocumentLayoutComponent } from './components/support/legal-document-layout/legal-document-layout.component';

@Component({
  selector: 'app-public-legal-document-page',
  imports: [RouterLink, LegalDocumentLayoutComponent],
  templateUrl: './public-legal-document-page.component.html',
  styleUrl: './public-legal-document-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLegalDocumentPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly document = signal<LegalDocument | undefined>(undefined);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const found = findLegalDocumentBySlug(slug);
    this.document.set(found);

    if (found) {
      this.applySeo(found);
    }

    this.destroyRef.onDestroy(() => this.seo.reset());
  }

  private applySeo(doc: LegalDocument): void {
    const path = `/legal/${doc.slug}`;

    this.seo.apply(
      {
        title: `${doc.title} — MyPropertyAsset`,
        description: doc.description,
        canonicalUrl: `https://mypropertyasset.com${path}`,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterSite: '@mypropertyasset',
        structuredData: [
          createOrganizationSchema(),
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Legal', path: '/legal' },
            { name: doc.title, path },
          ]),
          createLegalWebPageSchema(doc),
        ],
      },
      path,
    );
  }
}
