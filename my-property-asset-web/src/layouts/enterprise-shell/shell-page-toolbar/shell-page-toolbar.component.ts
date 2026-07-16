import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * P0.1 §1.5 Page Toolbar — page title / metadata / primary+secondary actions region.
 *
 * Shell projection surface only. Existing pages continue to render title/actions via
 * in-page `app-page-header` inside Content Area until a later page-chrome migration.
 * Project optional chrome with:
 *   <app-shell-page-toolbar>...</app-shell-page-toolbar>
 * or via Application Layout slot `[shellPageToolbar]`.
 */
@Component({
  selector: 'app-shell-page-toolbar',
  templateUrl: './shell-page-toolbar.component.html',
  styleUrl: './shell-page-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'shell-page-toolbar',
  },
})
export class ShellPageToolbarComponent {
  /** When false, host renders nothing (avoids empty chrome when unused). */
  readonly visible = input(true);
}
