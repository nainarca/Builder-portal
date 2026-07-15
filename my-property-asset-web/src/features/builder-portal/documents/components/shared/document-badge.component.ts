import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-document-badge',
  template: `<span class="doc-badge"><i [class]="icon()" aria-hidden="true"></i> {{ label() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentBadgeComponent {
  readonly label = input.required<string>();
  readonly icon = input('pi pi-tag');
}
