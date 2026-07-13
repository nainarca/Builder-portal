import { PublicFooterColumn, PublicSocialLink } from '../models/public-section.model';

export const PUBLIC_FOOTER_COLUMNS: readonly PublicFooterColumn[] = [
  {
    id: 'company',
    title: 'Company',
    links: [
      { id: 'about', label: 'About', route: '/about' },
      { id: 'company', label: 'Company', route: '/company' },
      { id: 'careers', label: 'Careers', route: '/' },
      { id: 'press', label: 'Press', route: '/' },
      { id: 'contact', label: 'Contact', route: '/contact' },
    ],
  },
  {
    id: 'product',
    title: 'Product',
    links: [
      { id: 'features', label: 'Features', route: '/', fragment: 'features' },
      { id: 'pricing', label: 'Pricing', route: '/pricing' },
      { id: 'benefits', label: 'Solutions', route: '/', fragment: 'benefits' },
      { id: 'how-it-works', label: 'How it works', route: '/', fragment: 'how-it-works' },
      { id: 'security', label: 'Security', route: '/legal/security' },
    ],
  },
  {
    id: 'resources',
    title: 'Resources',
    links: [
      { id: 'docs', label: 'Help Center', route: '/help' },
      { id: 'faq', label: 'FAQ', route: '/faq' },
      { id: 'blog', label: 'Blog', route: '/' },
      { id: 'support', label: 'Support', route: '/contact' },
      { id: 'status', label: 'System status', route: '/', external: true },
    ],
  },
  {
    id: 'legal',
    title: 'Legal',
    links: [
      { id: 'privacy', label: 'Privacy', route: '/legal/privacy' },
      { id: 'terms', label: 'Terms', route: '/legal/terms' },
      { id: 'cookies', label: 'Cookies', route: '/legal/cookies' },
      { id: 'compliance', label: 'Compliance', route: '/legal/compliance' },
    ],
  },
];

export const PUBLIC_SOCIAL_LINKS: readonly PublicSocialLink[] = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com', icon: 'pi pi-linkedin' },
  { id: 'twitter', label: 'X (Twitter)', href: 'https://twitter.com', icon: 'pi pi-twitter' },
  { id: 'youtube', label: 'YouTube', href: 'https://youtube.com', icon: 'pi pi-youtube' },
];
