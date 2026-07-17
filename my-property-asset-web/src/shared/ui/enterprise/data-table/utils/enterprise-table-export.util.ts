import type { EnterpriseTableColumnDef, EnterpriseTableExportFormat } from '../models/enterprise-table.models';

export interface EnterpriseTableExportContext {
  readonly format: EnterpriseTableExportFormat;
  readonly rows: readonly Record<string, unknown>[];
  readonly columns: readonly EnterpriseTableColumnDef[];
  readonly filename?: string;
}

export type EnterpriseTableExportHandler = (context: EnterpriseTableExportContext) => void | Promise<void>;

const DEFAULT_HANDLERS = new Map<EnterpriseTableExportFormat, EnterpriseTableExportHandler>();

DEFAULT_HANDLERS.set('csv', exportCsv);

export function registerEnterpriseTableExportHandler(
  format: EnterpriseTableExportFormat,
  handler: EnterpriseTableExportHandler,
): void {
  DEFAULT_HANDLERS.set(format, handler);
}

export async function runEnterpriseTableExport(context: EnterpriseTableExportContext): Promise<void> {
  const handler = DEFAULT_HANDLERS.get(context.format);
  if (!handler) {
    throw new Error(`No export handler registered for format: ${context.format}`);
  }
  await handler(context);
}

export function exportCsv(context: EnterpriseTableExportContext): void {
  const visibleColumns = context.columns.filter((column) => column.visible !== false);
  const header = visibleColumns.map((column) => escapeCsvCell(column.header)).join(',');
  const lines = context.rows.map((row) =>
    visibleColumns
      .map((column) => escapeCsvCell(formatCellValue(row[column.field])))
      .join(','),
  );
  const csv = [header, ...lines].join('\n');
  downloadBlob(csv, 'text/csv;charset=utf-8', `${context.filename ?? 'export'}.csv`);
}

function formatCellValue(value: unknown): string {
  if (value == null) {
    return '';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadBlob(content: string, mimeType: string, filename: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Extension-point stubs — modules register handlers before invoking export. */
export function createExcelExportPlaceholder(): EnterpriseTableExportHandler {
  return () => {
    throw new Error('Excel export is an extension point. Register a handler via registerEnterpriseTableExportHandler.');
  };
}

export function createPdfExportPlaceholder(): EnterpriseTableExportHandler {
  return () => {
    throw new Error('PDF export is an extension point. Register a handler via registerEnterpriseTableExportHandler.');
  };
}

export function createPrintExportPlaceholder(): EnterpriseTableExportHandler {
  return () => window.print();
}
