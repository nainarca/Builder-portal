import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-explorer-toolbar',
  template: `
    <div class="doc-explorer-toolbar" role="toolbar" aria-label="Document explorer toolbar">
      <div class="doc-explorer-toolbar__scope">
        <ng-content select="[toolbarScope]" />
      </div>
      <div class="doc-explorer-toolbar__start">
        <ng-content select="[toolbarStart]" />
      </div>
      <div class="doc-explorer-toolbar__end">
        <ng-content select="[toolbarEnd]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerToolbarComponent {}
