import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-version-badge',
  template: `<span class="version-badge"><i class="pi pi-history" aria-hidden="true"></i> v{{ versionNumber() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionBadgeComponent {
  readonly versionNumber = input.required<number>();
}
