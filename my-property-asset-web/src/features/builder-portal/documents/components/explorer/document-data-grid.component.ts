import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';

import { EnterpriseTableEmptyComponent } from '@shared/ui';

import { DocumentRecord } from '../../models/document.model';
import { categoryLabel, fileTypeIcon } from '../../utils/file-type.util';
import { ApprovalBadgeComponent } from '../shared/approval-badge.component';
import { VersionBadgeComponent } from '../shared/version-badge.component';

@Component({
  selector: 'app-document-data-grid',
  imports: [RouterLink, DatePipe, TableModule, ApprovalBadgeComponent, VersionBadgeComponent, EnterpriseTableEmptyComponent],
  template: `
    <p-table
      [value]="gridItems()"
      [paginator]="false"
      [(selection)]="selectionModel"
      dataKey="id"
      [stripedRows]="true"
    >
      <ng-template pTemplate="header">
        <tr>
          <th style="width: 3rem">
            <p-tableHeaderCheckbox />
          </th>
          @if (isColumnVisible('name')) {
            <th>Document</th>
          }
          @if (isColumnVisible('category')) {
            <th>Category</th>
          }
          @if (isColumnVisible('link')) {
            <th>Project / Unit</th>
          }
          @if (isColumnVisible('approval')) {
            <th>Approval status</th>
          }
          @if (isColumnVisible('visibility')) {
            <th>Visibility</th>
          }
          @if (isColumnVisible('version')) {
            <th>Version</th>
          }
          @if (isColumnVisible('updatedAt')) {
            <th>Last updated</th>
          }
          <th style="width: 5rem"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-doc>
        <tr>
          <td>
            <p-tableCheckbox [value]="doc" />
          </td>
          @if (isColumnVisible('name')) {
            <td>
              <a class="doc-grid__name-link" [routerLink]="['/builder-portal/documents', doc.id]">
                <i [class]="fileIcon(doc)" aria-hidden="true"></i>
                <span>{{ doc.name }}</span>
              </a>
            </td>
          }
          @if (isColumnVisible('category')) {
            <td>{{ categoryFor(doc) }}</td>
          }
          @if (isColumnVisible('link')) {
            <td>{{ doc.projectName }}{{ doc.unitNumber ? ' · ' + doc.unitNumber : '' }}</td>
          }
          @if (isColumnVisible('approval')) {
            <td><app-approval-badge [status]="doc.approvalStatus" /></td>
          }
          @if (isColumnVisible('visibility')) {
            <td>{{ doc.visibility === 'owner-visible' ? 'Owner visible' : 'Internal' }}</td>
          }
          @if (isColumnVisible('version')) {
            <td><app-version-badge [versionNumber]="doc.versions[0]?.versionNumber ?? 1" /></td>
          }
          @if (isColumnVisible('updatedAt')) {
            <td>{{ doc.updatedAt | date: 'mediumDate' }}</td>
          }
          <td>
            <a class="doc-grid__view-link" [routerLink]="['/builder-portal/documents', doc.id]">View</a>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td [attr.colspan]="visibleColumnCount() + 2">
            <app-enterprise-table-empty
              title="No documents match your filters"
              description="Try adjusting filters or clearing search."
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentDataGridComponent {
  readonly items = input.required<readonly DocumentRecord[]>();
  readonly visibleColumns = input<string[]>([]);

  readonly selectionChange = output<readonly DocumentRecord[]>();

  readonly gridItems = computed(() => [...this.items()]);

  private _selectionModel: DocumentRecord[] = [];

  get selectionModel(): DocumentRecord[] {
    return this._selectionModel;
  }

  set selectionModel(value: DocumentRecord[]) {
    this._selectionModel = value;
    this.selectionChange.emit([...value]);
  }

  isColumnVisible(id: string): boolean {
    return this.visibleColumns().includes(id);
  }

  visibleColumnCount(): number {
    return this.visibleColumns().length;
  }

  fileIcon(doc: DocumentRecord): string {
    return fileTypeIcon(doc.fileType);
  }

  categoryFor(doc: DocumentRecord): string {
    return categoryLabel(doc.category, doc.customCategoryLabel);
  }
}
