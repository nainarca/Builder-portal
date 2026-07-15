import { DashboardChartConfig } from '../../models/dashboard.model';

const CHART_COLORS = [
  'var(--mpa-color-primary)',
  'var(--mpa-color-info)',
  'var(--mpa-color-success)',
  'var(--mpa-color-warning)',
  'var(--mpa-color-danger)',
];

export function chartColor(index: number, override?: string): string {
  return override ?? CHART_COLORS[index % CHART_COLORS.length];
}

export function normalizeValues(values: readonly number[]): {
  readonly min: number;
  readonly max: number;
  readonly normalized: readonly number[];
} {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return {
    min,
    max,
    normalized: values.map((value) => (value - min) / range),
  };
}

export function donutGradient(config: DashboardChartConfig): string {
  const total = config.series[0]?.values.reduce((sum, value) => sum + value, 0) ?? 1;
  let cursor = 0;
  const segments: string[] = [];

  config.series[0]?.values.forEach((value, index) => {
    const start = (cursor / total) * 100;
    cursor += value;
    const end = (cursor / total) * 100;
    segments.push(`${chartColor(index)} ${start}% ${end}%`);
  });

  return `conic-gradient(${segments.join(', ')})`;
}

export function hasChartData(config: DashboardChartConfig): boolean {
  return config.series.some((series) => series.values.some((value) => value > 0));
}
