import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-table-toolbar',
  template: `
    <div class="ui-table-toolbar">
      <div class="ui-table-toolbar__start">
        <ng-content select="[toolbarStart]" />
      </div>
      <div class="ui-table-toolbar__end">
        <ng-content select="[toolbarEnd]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableToolbarComponent {}
