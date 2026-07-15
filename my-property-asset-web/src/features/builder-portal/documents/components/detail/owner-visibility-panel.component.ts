import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-owner-visibility-panel',
  imports: [RouterLink],
  template: `
    <div class="doc-info-panel">
      <h3 class="doc-info-panel__title">Owner visibility</h3>
      @if (!visible()) {
        <p class="mpa-body-md m-0">This document is internal only and not shared with the owner.</p>
      } @else if (ownerName() && ownerId()) {
        <div class="owner-visibility-panel__row">
          <i class="pi pi-eye" aria-hidden="true"></i>
          <p class="mpa-body-md m-0">
            Visible to <a [routerLink]="['/builder-portal/owners', ownerId()]">{{ ownerName() }}</a>
          </p>
        </div>
      } @else {
        <p class="mpa-body-md m-0">Marked owner-visible, but no owner is currently assigned to this unit.</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerVisibilityPanelComponent {
  readonly visible = input.required<boolean>();
  readonly ownerName = input<string | undefined>(undefined);
  readonly ownerId = input<string | undefined>(undefined);
}
