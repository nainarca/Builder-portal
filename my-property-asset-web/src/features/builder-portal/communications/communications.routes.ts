import { Routes } from '@angular/router';

import {
  BUILDER_PORTAL_COMMUNICATION_CREATE_METADATA,
  BUILDER_PORTAL_COMMUNICATION_DETAIL_METADATA,
  BUILDER_PORTAL_COMMUNICATION_EDIT_METADATA,
  BUILDER_PORTAL_COMMUNICATIONS_METADATA,
} from '../../../core/constants/route-metadata.constants';
import { CommunicationDetailPageComponent } from './pages/communication-detail-page.component';
import { CommunicationEditorPageComponent } from './pages/communication-editor-page.component';
import { CommunicationWorkspacePageComponent } from './pages/communication-workspace-page.component';

export const COMMUNICATION_ROUTES: Routes = [
  {
    path: '',
    component: CommunicationWorkspacePageComponent,
    data: BUILDER_PORTAL_COMMUNICATIONS_METADATA,
  },
  {
    path: 'create',
    component: CommunicationEditorPageComponent,
    data: BUILDER_PORTAL_COMMUNICATION_CREATE_METADATA,
  },
  {
    path: ':id',
    component: CommunicationDetailPageComponent,
    data: BUILDER_PORTAL_COMMUNICATION_DETAIL_METADATA,
  },
  {
    path: ':id/edit',
    component: CommunicationEditorPageComponent,
    data: BUILDER_PORTAL_COMMUNICATION_EDIT_METADATA,
  },
];
