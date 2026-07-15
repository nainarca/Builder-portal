import { DocumentFileType } from '../models/document.model';

const FILE_TYPE_ICONS: Record<DocumentFileType, string> = {
  pdf: 'pi pi-file-pdf',
  image: 'pi pi-image',
  spreadsheet: 'pi pi-table',
  word: 'pi pi-file-word',
  other: 'pi pi-file',
};

export function fileTypeIcon(type: DocumentFileType): string {
  return FILE_TYPE_ICONS[type];
}

const CATEGORY_LABEL_FALLBACK: Record<string, string> = {
  legal: 'Legal',
  financial: 'Financial',
  technical: 'Technical',
  construction: 'Construction',
  warranty: 'Warranty',
  maintenance: 'Maintenance',
  custom: 'Custom',
};

export function categoryLabel(category: string, customLabel?: string): string {
  if (category === 'custom' && customLabel) {
    return customLabel;
  }
  return CATEGORY_LABEL_FALLBACK[category] ?? category;
}
