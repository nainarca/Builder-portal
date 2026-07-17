import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CardComponent } from '../../composites/cards/card.component';
import { EnterpriseButtonComponent } from '../buttons/enterprise-button.component';
import { EmptyNoDataComponent } from '../empty-states/enterprise-empty-states.component';
import type { EnterpriseDetailAttachment } from './models/enterprise-detail.models';

/** Attachment / document panel — preview/download/upload placeholder (presentation). */
@Component({
  selector: 'app-enterprise-attachment-panel',
  imports: [CardComponent, EnterpriseButtonComponent, EmptyNoDataComponent],
  template: `
    <app-card variant="outlined">
      <div class="enterprise-attachment-panel">
        <div class="enterprise-attachment-panel__header">
          <h3 class="enterprise-attachment-panel__title">{{ title() }}</h3>
          @if (showUpload()) {
            <app-enterprise-button
              variant="outline"
              label="Upload"
              icon="pi pi-upload"
              (clicked)="uploadClick.emit($event)"
            />
          }
        </div>

        @if (items().length === 0) {
          <app-empty-no-data
            title="No documents"
            [description]="emptyDescription()"
            [actionLabel]="showUpload() ? 'Upload document' : undefined"
            (action)="uploadClick.emit($event)"
          />
        } @else {
          <ul class="enterprise-attachment-panel__list" [attr.aria-label]="title()">
            @for (file of items(); track file.id) {
              <li class="enterprise-attachment-panel__item">
                <div class="enterprise-attachment-panel__file">
                  <i class="pi pi-file" aria-hidden="true"></i>
                  <div>
                    <p class="enterprise-attachment-panel__name">{{ file.name }}</p>
                    <p class="enterprise-attachment-panel__meta">
                      @if (file.version) {
                        <span>v{{ file.version }}</span>
                      }
                      @if (file.sizeLabel) {
                        <span>{{ file.sizeLabel }}</span>
                      }
                      @if (file.updatedAt) {
                        <span>{{ file.updatedAt }}</span>
                      }
                    </p>
                  </div>
                </div>
                <div class="enterprise-attachment-panel__actions">
                  <app-enterprise-button
                    variant="ghost"
                    label="Preview"
                    icon="pi pi-eye"
                    (clicked)="previewClick.emit(file.id)"
                  />
                  <app-enterprise-button
                    variant="ghost"
                    label="Download"
                    icon="pi pi-download"
                    (clicked)="downloadClick.emit(file.id)"
                  />
                </div>
              </li>
            }
          </ul>
        }
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-attachment-panel {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md);
    }
    .enterprise-attachment-panel__header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--mpa-spacing-sm);
    }
    .enterprise-attachment-panel__title {
      margin: 0;
      font-size: var(--mpa-font-size-md);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-attachment-panel__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-sm);
    }
    .enterprise-attachment-panel__item {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--mpa-spacing-sm);
      padding: var(--mpa-spacing-sm);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md);
    }
    .enterprise-attachment-panel__file {
      display: flex;
      gap: var(--mpa-spacing-sm);
      align-items: flex-start;
      min-width: 0;
    }
    .enterprise-attachment-panel__file i {
      color: var(--mpa-color-primary);
      margin-top: 0.2rem;
    }
    .enterprise-attachment-panel__name {
      margin: 0;
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-medium);
    }
    .enterprise-attachment-panel__meta {
      margin: 0.15rem 0 0;
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-sm);
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-attachment-panel__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-xs);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseAttachmentPanelComponent {
  readonly title = input('Documents');
  readonly items = input<readonly EnterpriseDetailAttachment[]>([]);
  readonly showUpload = input(true);
  readonly emptyDescription = input('Upload documents to attach them to this record.');

  readonly uploadClick = output<MouseEvent>();
  readonly previewClick = output<string>();
  readonly downloadClick = output<string>();
}
