export interface BreadcrumbItem {
  id: string;
  label: string;
  route?: string | readonly string[];
  icon?: string;
  isHome?: boolean;
  isActive?: boolean;
}

export interface BreadcrumbConfiguration {
  homeLabel?: string;
  homeRoute?: string;
  showHome?: boolean;
  maxItems?: number;
}

export interface BreadcrumbTrail {
  items: readonly BreadcrumbItem[];
  configuration: BreadcrumbConfiguration;
}
