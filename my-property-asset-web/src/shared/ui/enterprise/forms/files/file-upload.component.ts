import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { EnterpriseButtonComponent } from '../../buttons/enterprise-button.component';
import { EnterpriseFormFieldComponent } from '../form-field.component';
import { EnterpriseUploadFile } from '../models/enterprise-form.models';

/**
 * DS-04 Attachment uploader — drag/drop, progress, retry (presentation only).
 */
@Component({
  selector: 'app-enterprise-file-upload',
  imports: [EnterpriseFormFieldComponent, EnterpriseButtonComponent],
  template: `
    <app-enterprise-form-field
      [label]="label()"
      [required]="required()"
      [hint]="hint()"
      [error]="error()"
      [disabled]="disabled()"
    >
      <div
        class="enterprise-file-upload"
        [class.enterprise-file-upload--dragging]="dragging()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <input
          #fileInput
          class="enterprise-file-upload__input"
          type="file"
          [attr.accept]="accept()"
          [multiple]="multiple()"
          [disabled]="disabled()"
          (change)="onFileInput($event)"
        />

        <div class="enterprise-file-upload__dropzone">
          <i class="pi pi-cloud-upload" aria-hidden="true"></i>
          <p>Drag & drop files here, or</p>
          <app-enterprise-button
            variant="outline"
            label="Browse"
            [disabled]="disabled()"
            (clicked)="fileInput.click()"
          />
        </div>

        @if (files().length) {
          <ul class="enterprise-file-upload__list" role="list">
            @for (file of files(); track file.id) {
              <li class="enterprise-file-upload__item">
                <div class="enterprise-file-upload__meta">
                  @if (showPreview() && file.previewUrl) {
                    <img
                      class="enterprise-file-upload__preview"
                      [src]="file.previewUrl"
                      [alt]="file.name"
                    />
                  } @else {
                    <i class="pi pi-file" aria-hidden="true"></i>
                  }
                  <div>
                    <p class="enterprise-file-upload__name">{{ file.name }}</p>
                    <p class="enterprise-file-upload__size">{{ formatSize(file.size) }}</p>
                    @if (file.status === 'error' && file.errorMessage) {
                      <p class="enterprise-file-upload__error">{{ file.errorMessage }}</p>
                    }
                  </div>
                </div>

                <div class="enterprise-file-upload__actions">
                  @if (file.status === 'uploading') {
                    <div
                      class="enterprise-file-upload__progress"
                      role="progressbar"
                      [attr.aria-valuenow]="file.progress ?? 0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      [attr.aria-label]="'Uploading ' + file.name"
                    >
                      <span [style.width.%]="file.progress ?? 0"></span>
                    </div>
                  }
                  @if (file.status === 'error') {
                    <app-enterprise-button
                      variant="text"
                      label="Retry"
                      (clicked)="retry.emit(file)"
                    />
                  }
                  <app-enterprise-button
                    variant="icon"
                    icon="pi pi-times"
                    [ariaLabel]="'Remove ' + file.name"
                    (clicked)="remove.emit(file)"
                  />
                </div>
              </li>
            }
          </ul>
        }
      </div>
    </app-enterprise-form-field>
  `,
  styleUrl: './file-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseFileUploadComponent {
  readonly label = input('Attachments');
  readonly files = input<readonly EnterpriseUploadFile[]>([]);
  readonly accept = input<string | undefined>(undefined);
  readonly multiple = input(true);
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly disabled = input(false);
  readonly showPreview = input(false);

  readonly filesSelected = output<File[]>();
  readonly remove = output<EnterpriseUploadFile>();
  readonly retry = output<EnterpriseUploadFile>();

  private readonly draggingSignal = signal(false);
  readonly dragging = this.draggingSignal.asReadonly();

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.draggingSignal.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.draggingSignal.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.draggingSignal.set(false);
    const list = event.dataTransfer?.files;
    if (list?.length) {
      this.filesSelected.emit(Array.from(list));
    }
  }

  onFileInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const list = inputEl.files;
    if (list?.length) {
      this.filesSelected.emit(Array.from(list));
      inputEl.value = '';
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

@Component({
  selector: 'app-enterprise-image-upload',
  imports: [EnterpriseFileUploadComponent],
  template: `
    <app-enterprise-file-upload
      [label]="label()"
      [files]="files()"
      accept="image/*"
      [multiple]="multiple()"
      [required]="required()"
      [hint]="hint() || 'PNG or JPG recommended.'"
      [error]="error()"
      [disabled]="disabled()"
      [showPreview]="true"
      (filesSelected)="filesSelected.emit($event)"
      (remove)="remove.emit($event)"
      (retry)="retry.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseImageUploadComponent {
  readonly label = input('Image');
  readonly files = input<readonly EnterpriseUploadFile[]>([]);
  readonly multiple = input(false);
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly disabled = input(false);

  readonly filesSelected = output<File[]>();
  readonly remove = output<EnterpriseUploadFile>();
  readonly retry = output<EnterpriseUploadFile>();
}

@Component({
  selector: 'app-enterprise-document-preview',
  template: `
    <div class="enterprise-document-preview" role="region" [attr.aria-label]="ariaLabel()">
      @if (previewUrl()) {
        @if (isImage()) {
          <img [src]="previewUrl()!" [alt]="fileName() || 'Document preview'" />
        } @else {
          <iframe [src]="previewUrl()!" [title]="fileName() || 'Document preview'"></iframe>
        }
      } @else {
        <p class="enterprise-document-preview__empty">{{ emptyMessage() }}</p>
      }
    </div>
  `,
  styles: `
    .enterprise-document-preview {
      min-height: 16rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md);
      background: var(--mpa-color-surface-muted);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .enterprise-document-preview img,
    .enterprise-document-preview iframe {
      width: 100%;
      height: 24rem;
      border: 0;
      object-fit: contain;
      background: var(--mpa-color-surface);
    }
    .enterprise-document-preview__empty {
      margin: 0;
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDocumentPreviewComponent {
  readonly previewUrl = input<string | null | undefined>(undefined);
  readonly fileName = input<string | undefined>(undefined);
  readonly mimeType = input<string | undefined>(undefined);
  readonly emptyMessage = input('No document selected for preview.');
  readonly ariaLabel = input('Document preview');

  isImage(): boolean {
    const mime = this.mimeType() ?? '';
    const name = this.fileName() ?? '';
    return mime.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(name);
  }
}
