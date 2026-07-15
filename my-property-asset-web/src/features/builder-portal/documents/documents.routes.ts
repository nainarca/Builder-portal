import { Routes } from '@angular/router';

import {
  BUILDER_PORTAL_DOCUMENT_CATEGORIES_METADATA,
  BUILDER_PORTAL_DOCUMENT_DETAIL_METADATA,
  BUILDER_PORTAL_DOCUMENT_HISTORY_METADATA,
  BUILDER_PORTAL_DOCUMENT_UPLOAD_METADATA,
  BUILDER_PORTAL_DOCUMENTS_METADATA,
} from '../../../core/constants/route-metadata.constants';
import { documentUnsavedChangesGuard } from './guards/document-unsaved-changes.guard';
import { DocumentCategoriesPageComponent } from './pages/document-categories-page.component';
import { DocumentDetailPageComponent } from './pages/document-detail-page.component';
import { DocumentHistoryPageComponent } from './pages/document-history-page.component';
import { DocumentUploadPageComponent } from './pages/document-upload-page.component';
import { DocumentWorkspacePageComponent } from './pages/document-workspace-page.component';

export const DOCUMENT_ROUTES: Routes = [
  {
    path: '',
    component: DocumentWorkspacePageComponent,
    data: BUILDER_PORTAL_DOCUMENTS_METADATA,
  },
  {
    path: 'categories',
    component: DocumentCategoriesPageComponent,
    data: BUILDER_PORTAL_DOCUMENT_CATEGORIES_METADATA,
  },
  {
    path: 'upload',
    component: DocumentUploadPageComponent,
    canDeactivate: [documentUnsavedChangesGuard],
    data: BUILDER_PORTAL_DOCUMENT_UPLOAD_METADATA,
  },
  {
    path: ':id',
    component: DocumentDetailPageComponent,
    data: BUILDER_PORTAL_DOCUMENT_DETAIL_METADATA,
  },
  {
    path: ':id/history',
    component: DocumentHistoryPageComponent,
    data: BUILDER_PORTAL_DOCUMENT_HISTORY_METADATA,
  },
];
