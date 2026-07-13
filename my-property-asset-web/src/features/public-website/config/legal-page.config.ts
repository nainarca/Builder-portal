import { PublicCtaAction } from '../models/public-section.model';
import { LegalDocument, SupportPageHero } from '../models/support.model';

export const LEGAL_HUB_HERO: SupportPageHero = {
  eyebrow: 'Legal',
  title: 'Legal & compliance',
  subtitle:
    'Policies, terms, and compliance information governing use of the MyPropertyAsset platform and services.',
  primaryCta: {
    label: 'Contact legal',
    route: '/contact',
    analyticsName: 'legal_hero_contact_cta',
  },
};

export const LEGAL_DOCUMENTS: readonly LegalDocument[] = [
  {
    id: 'privacy',
    slug: 'privacy',
    title: 'Privacy Policy',
    description:
      'How MyPropertyAsset collects, uses, stores, and protects personal and organizational data.',
    lastUpdated: '2025-07-01',
    sections: [
      {
        id: 'intro',
        heading: 'Introduction',
        level: 2,
        paragraphs: [
          'MyPropertyAsset ("we", "us", "our") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our website, platform, and related services (collectively, the "Services").',
          'By using the Services, you agree to the collection and use of information in accordance with this policy. Enterprise customers may have additional data processing agreements.',
        ],
      },
      {
        id: 'collection',
        heading: 'Information we collect',
        level: 2,
        paragraphs: ['We collect information you provide directly and information collected automatically:'],
        listItems: [
          'Account information: name, email, organization details, and authentication credentials.',
          'Usage data: pages visited, features used, and interaction patterns within the platform.',
          'Technical data: browser type, device information, IP address, and session identifiers.',
          'Communications: support requests, contact form submissions, and sales inquiries.',
        ],
      },
      {
        id: 'use',
        heading: 'How we use information',
        level: 2,
        paragraphs: ['We use collected information to:'],
        listItems: [
          'Provide, maintain, and improve the Services.',
          'Authenticate users and enforce organization context and permissions.',
          'Respond to support requests and communicate about the Services.',
          'Comply with legal obligations and protect against fraud or abuse.',
        ],
      },
      {
        id: 'sharing',
        heading: 'Information sharing',
        level: 2,
        paragraphs: [
          'We do not sell personal information. We may share information with service providers who assist in operating the Services, subject to confidentiality obligations. We may disclose information when required by law or to protect rights and safety.',
        ],
      },
      {
        id: 'retention',
        heading: 'Data retention',
        level: 2,
        paragraphs: [
          'We retain information for as long as necessary to provide the Services and fulfill the purposes described in this policy, unless a longer retention period is required by law or enterprise agreement.',
        ],
      },
      {
        id: 'rights',
        heading: 'Your rights',
        level: 2,
        paragraphs: [
          'Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict processing of your personal data. Contact privacy@mypropertyasset.com to exercise these rights.',
        ],
      },
      {
        id: 'contact',
        heading: 'Contact us',
        level: 2,
        paragraphs: [
          'For privacy-related inquiries, contact privacy@mypropertyasset.com or write to MyPropertyAsset, 100 Enterprise Plaza, Suite 2400, New York, NY 10001.',
        ],
      },
    ],
  },
  {
    id: 'terms',
    slug: 'terms',
    title: 'Terms & Conditions',
    description: 'Terms governing access to and use of MyPropertyAsset services.',
    lastUpdated: '2025-07-01',
    sections: [
      {
        id: 'acceptance',
        heading: 'Acceptance of terms',
        level: 2,
        paragraphs: [
          'By accessing or using MyPropertyAsset Services, you agree to be bound by these Terms & Conditions. If you are using the Services on behalf of an organization, you represent that you have authority to bind that organization.',
        ],
      },
      {
        id: 'services',
        heading: 'Description of services',
        level: 2,
        paragraphs: [
          'MyPropertyAsset provides a cloud-based property asset management platform. Features vary by plan tier. We may modify, suspend, or discontinue features with reasonable notice where practicable.',
        ],
      },
      {
        id: 'accounts',
        heading: 'Accounts and responsibilities',
        level: 2,
        paragraphs: ['You are responsible for:'],
        listItems: [
          'Maintaining the confidentiality of account credentials.',
          'All activity occurring under your account.',
          'Ensuring users within your organization comply with these Terms.',
        ],
      },
      {
        id: 'acceptable-use',
        heading: 'Acceptable use',
        level: 2,
        paragraphs: [
          'You agree not to misuse the Services. See our Acceptable Use Policy at /legal/acceptable-use for detailed restrictions.',
        ],
      },
      {
        id: 'ip',
        heading: 'Intellectual property',
        level: 2,
        paragraphs: [
          'MyPropertyAsset retains all rights to the platform, software, and branding. You retain rights to your data. You grant us a limited license to process your data solely to provide the Services.',
        ],
      },
      {
        id: 'liability',
        heading: 'Limitation of liability',
        level: 2,
        paragraphs: [
          'To the maximum extent permitted by law, MyPropertyAsset shall not be liable for indirect, incidental, special, or consequential damages. Our total liability is limited to fees paid in the twelve months preceding the claim.',
        ],
      },
      {
        id: 'termination',
        heading: 'Termination',
        level: 2,
        paragraphs: [
          'Either party may terminate in accordance with the applicable subscription agreement. Upon termination, access to the Services will cease and data handling will follow our Privacy Policy and any enterprise data processing agreement.',
        ],
      },
    ],
  },
  {
    id: 'cookies',
    slug: 'cookies',
    title: 'Cookie Policy',
    description: 'How MyPropertyAsset uses cookies and similar technologies.',
    lastUpdated: '2025-07-01',
    sections: [
      {
        id: 'what',
        heading: 'What are cookies?',
        level: 2,
        paragraphs: [
          'Cookies are small text files stored on your device when you visit a website. They help us provide functionality, remember preferences, and understand how the Services are used.',
        ],
      },
      {
        id: 'types',
        heading: 'Types of cookies we use',
        level: 2,
        paragraphs: ['We use the following categories of cookies:'],
        listItems: [
          'Essential cookies: required for authentication, session management, and security.',
          'Preference cookies: remember language, theme, and organization branding choices.',
          'Analytics cookies: help us understand usage patterns (framework for future analytics integration).',
        ],
      },
      {
        id: 'manage',
        heading: 'Managing cookies',
        level: 2,
        paragraphs: [
          'You can control cookies through your browser settings. Disabling essential cookies may affect platform functionality. Our cookie consent banner allows you to manage non-essential preferences.',
        ],
      },
    ],
  },
  {
    id: 'disclaimer',
    slug: 'disclaimer',
    title: 'Disclaimer',
    description: 'Important disclaimers regarding MyPropertyAsset content and services.',
    lastUpdated: '2025-07-01',
    sections: [
      {
        id: 'general',
        heading: 'General disclaimer',
        level: 2,
        paragraphs: [
          'The information on this website and within the MyPropertyAsset platform is provided for general informational purposes. While we strive for accuracy, we make no warranties about completeness, reliability, or suitability for any particular purpose.',
        ],
      },
      {
        id: 'professional',
        heading: 'Not professional advice',
        level: 2,
        paragraphs: [
          'MyPropertyAsset does not provide legal, financial, tax, or investment advice. Content within the platform should not be relied upon as a substitute for professional consultation.',
        ],
      },
      {
        id: 'availability',
        heading: 'Service availability',
        level: 2,
        paragraphs: [
          'We aim for high availability but do not guarantee uninterrupted access. Maintenance windows, updates, and unforeseen events may temporarily affect service availability.',
        ],
      },
    ],
  },
  {
    id: 'acceptable-use',
    slug: 'acceptable-use',
    title: 'Acceptable Use Policy',
    description: 'Rules governing acceptable use of MyPropertyAsset services.',
    lastUpdated: '2025-07-01',
    sections: [
      {
        id: 'scope',
        heading: 'Scope',
        level: 2,
        paragraphs: [
          'This Acceptable Use Policy applies to all users of MyPropertyAsset Services. Violations may result in suspension or termination of access.',
        ],
      },
      {
        id: 'prohibited',
        heading: 'Prohibited activities',
        level: 2,
        paragraphs: ['You may not:'],
        listItems: [
          'Attempt unauthorized access to systems, accounts, or data.',
          'Upload malicious code, malware, or harmful content.',
          'Use the Services to harass, defame, or violate the rights of others.',
          'Reverse engineer, decompile, or attempt to extract source code except as permitted by law.',
          'Resell or sublicense the Services without written authorization.',
          'Overload or interfere with platform infrastructure.',
        ],
      },
      {
        id: 'enforcement',
        heading: 'Enforcement',
        level: 2,
        paragraphs: [
          'We reserve the right to investigate violations and take appropriate action, including account suspension, termination, and reporting to authorities where required.',
        ],
      },
    ],
  },
  {
    id: 'security',
    slug: 'security',
    title: 'Security Policy',
    description: 'MyPropertyAsset security practices and commitments.',
    lastUpdated: '2025-07-01',
    sections: [
      {
        id: 'commitment',
        heading: 'Security commitment',
        level: 2,
        paragraphs: [
          'MyPropertyAsset is built with security as a foundational pillar. We implement technical and organizational measures designed to protect customer data and maintain platform integrity.',
        ],
      },
      {
        id: 'architecture',
        heading: 'Platform security architecture',
        level: 2,
        paragraphs: ['Key security measures include:'],
        listItems: [
          'Multi-tenant organization isolation with strict context boundaries.',
          'Authentication and session management before business data access.',
          'Role-based access control (RBAC) across portals and navigation.',
          'Encrypted data transmission (TLS) for all web traffic.',
          'Secure token lifecycle management.',
        ],
      },
      {
        id: 'incident',
        heading: 'Incident response',
        level: 2,
        paragraphs: [
          'We maintain incident response procedures for security events. Enterprise customers receive notification in accordance with their service agreements and applicable regulations.',
        ],
      },
      {
        id: 'reporting',
        heading: 'Reporting vulnerabilities',
        level: 2,
        paragraphs: [
          'To report a security vulnerability, contact security@mypropertyasset.com. We appreciate responsible disclosure and will acknowledge reports promptly.',
        ],
      },
    ],
  },
  {
    id: 'compliance',
    slug: 'compliance',
    title: 'Compliance Overview',
    description: 'Overview of regulatory compliance frameworks and commitments.',
    lastUpdated: '2025-07-01',
    sections: [
      {
        id: 'overview',
        heading: 'Compliance overview',
        level: 2,
        paragraphs: [
          'MyPropertyAsset is designed with enterprise compliance requirements in mind. Our architecture supports GDPR-aware data handling, audit readiness, and pathways toward formal certifications.',
        ],
      },
      {
        id: 'frameworks',
        heading: 'Framework alignment',
        level: 2,
        paragraphs: ['We align our practices with recognized frameworks:'],
        listItems: [
          'GDPR: privacy-by-design data handling and user rights support.',
          'SOC 2: readiness framework for security, availability, and confidentiality controls.',
          'Enterprise SLAs: customizable agreements for availability and support response.',
        ],
      },
      {
        id: 'enterprise',
        heading: 'Enterprise agreements',
        level: 2,
        paragraphs: [
          'Enterprise customers may execute Data Processing Agreements (DPAs), Business Associate Agreements where applicable, and custom compliance addenda. Contact legal@mypropertyasset.com for enterprise compliance discussions.',
        ],
      },
    ],
  },
];

export const LEGAL_HUB_DOCUMENTS = LEGAL_DOCUMENTS.map((doc) => ({
  id: doc.id,
  slug: doc.slug,
  title: doc.title,
  description: doc.description,
  lastUpdated: doc.lastUpdated,
}));

export const LEGAL_SUPPORT_CTA = {
  title: 'Questions about our policies?',
  description: 'Contact our team for legal inquiries, enterprise agreements, or compliance documentation.',
  primaryCta: {
    label: 'Contact us',
    route: '/contact',
    analyticsName: 'legal_contact_cta',
  } satisfies PublicCtaAction,
} as const;

export function findLegalDocumentBySlug(slug: string): LegalDocument | undefined {
  return LEGAL_DOCUMENTS.find((doc) => doc.slug === slug);
}
