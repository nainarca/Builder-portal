import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { MaintenanceStateComponent } from '../../shared/ui';
import { FriendlyErrorComponent } from '../../infrastructure/shell';
import { PageSectionComponent } from '../components/page-section/page-section.component';

@Component({
  selector: 'app-blank-page',
  imports: [FriendlyErrorComponent, MaintenanceStateComponent, PageSectionComponent],
  templateUrl: './blank-page.component.html',
  styleUrl: './blank-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlankPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly title = input('Page');
  readonly description = input('This page is not yet available.');
  readonly code = input<number | undefined>(undefined);

  readonly routeTitle = toSignal(
    this.route.data.pipe(map((data) => data['pageTitle'] as string | undefined)),
    {
      initialValue: undefined,
    },
  );

  readonly routeDescription = toSignal(
    this.route.data.pipe(map((data) => data['pageDescription'] as string | undefined)),
    { initialValue: undefined },
  );

  readonly routeCode = toSignal(
    this.route.data.pipe(map((data) => data['blankPageCode'] as number | undefined)),
    { initialValue: undefined },
  );

  readonly pageVariant = toSignal(
    this.route.data.pipe(map((data) => data['pageVariant'] as string | undefined)),
    { initialValue: undefined },
  );

  reload(): void {
    window.location.reload();
  }
}
