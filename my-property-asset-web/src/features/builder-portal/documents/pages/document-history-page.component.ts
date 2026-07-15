import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent, InputTextComponent, ModalShellComponent, PageHeaderComponent, UiToastService } from '@shared/ui';

import {
  CurrentVersionCardComponent,
  VersionComparisonPlaceholderComponent,
  VersionHistoryListComponent,
  VersionTimelineComponent,
} from '../components/version';
import { DocumentStoreService } from '../services/document-store.service';

@Component({
  selector: 'app-document-history-page',
  imports: [
    BasePageComponent,
    ButtonComponent,
    InputTextComponent,
    ModalShellComponent,
    PageHeaderComponent,
    CurrentVersionCardComponent,
    VersionHistoryListComponent,
    VersionTimelineComponent,
    VersionComparisonPlaceholderComponent,
  ],
  templateUrl: './document-history-page.component.html',
  styleUrl: './document-history-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHistoryPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(DocumentStoreService);
  private readonly toast = inject(UiToastService);

  private readonly documentId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly document = computed(() => this.store.getById(this.documentId()));

  readonly addVersionVisible = signal(false);
  readonly newFileName = signal('');
  readonly newNotes = signal('');

  goBack(): void {
    void this.router.navigate(['/builder-portal/documents', this.documentId()]);
  }

  openAddVersion(): void {
    this.newFileName.set('');
    this.newNotes.set('');
    this.addVersionVisible.set(true);
  }

  closeAddVersion(): void {
    this.addVersionVisible.set(false);
  }

  confirmAddVersion(): void {
    const doc = this.document();
    if (!doc || !this.newFileName().trim()) {
      return;
    }
    this.store.addVersion(doc.id, this.newFileName().trim(), this.newNotes().trim() || undefined);
    this.addVersionVisible.set(false);
    this.toast.success('Version added', `A new version of ${doc.name} has been added.`);
  }
}
