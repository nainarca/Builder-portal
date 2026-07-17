import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EmptyStateComponent } from '../../composites/feedback/empty-state.component';
import { NoDataStateComponent } from '../../composites/feedback/no-data-state.component';

@Component({
  selector: 'app-empty-no-data',
  imports: [NoDataStateComponent],
  template: `
    <app-no-data-state
      [title]="title()"
      [description]="description()"
      [actionLabel]="actionLabel()"
      (action)="action.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyNoDataComponent {
  readonly title = input('No data');
  readonly description = input<string | undefined>('There is nothing to show yet.');
  readonly actionLabel = input<string | undefined>(undefined);
  readonly action = output<MouseEvent>();
}

@Component({
  selector: 'app-empty-no-search-results',
  imports: [NoDataStateComponent],
  template: `
    <app-no-data-state
      [title]="title()"
      [description]="description()"
      [actionLabel]="actionLabel()"
      (action)="action.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyNoSearchResultsComponent {
  readonly title = input('No search results');
  readonly description = input<string | undefined>('Try a different search term or clear filters.');
  readonly actionLabel = input<string | undefined>('Clear search');
  readonly action = output<MouseEvent>();
}

@Component({
  selector: 'app-empty-permission-denied',
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state
      [title]="title()"
      [description]="description()"
      icon="lock"
      [actionLabel]="actionLabel()"
      (action)="action.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyPermissionDeniedComponent {
  readonly title = input('Permission denied');
  readonly description = input<string | undefined>(
    'You do not have access to view this content. Contact an administrator if you need access.',
  );
  readonly actionLabel = input<string | undefined>(undefined);
  readonly action = output<MouseEvent>();
}

@Component({
  selector: 'app-empty-coming-soon',
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state
      [title]="title()"
      [description]="description()"
      icon="clock"
      [actionLabel]="actionLabel()"
      (action)="action.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyComingSoonComponent {
  readonly title = input('Coming soon');
  readonly description = input<string | undefined>('This capability is on the roadmap and not available yet.');
  readonly actionLabel = input<string | undefined>(undefined);
  readonly action = output<MouseEvent>();
}

@Component({
  selector: 'app-empty-no-organization',
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state
      [title]="title()"
      [description]="description()"
      icon="building"
      [actionLabel]="actionLabel()"
      (action)="action.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyNoOrganizationComponent {
  readonly title = input('No organization');
  readonly description = input<string | undefined>(
    'Select or create an organization to continue.',
  );
  readonly actionLabel = input<string | undefined>('Select organization');
  readonly action = output<MouseEvent>();
}

@Component({
  selector: 'app-empty-no-project',
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state
      [title]="title()"
      [description]="description()"
      icon="briefcase"
      [actionLabel]="actionLabel()"
      (action)="action.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyNoProjectComponent {
  readonly title = input('No project');
  readonly description = input<string | undefined>(
    'Create a project to start managing buildings, units, and handovers.',
  );
  readonly actionLabel = input<string | undefined>('Create project');
  readonly action = output<MouseEvent>();
}
