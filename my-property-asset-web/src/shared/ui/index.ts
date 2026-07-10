export * from './composites';
export * from './models';
export * from './primitives';
export * from './providers/provide-shared-ui';
export * from './services';

// Backward-compatible aliases from early shell prototypes
export { ContentCardComponent as ShellFeaturePanelComponent } from './composites/cards/content-card.component';
export { PageHeaderComponent as ShellPageHeaderComponent } from './composites/page/page-header.component';
