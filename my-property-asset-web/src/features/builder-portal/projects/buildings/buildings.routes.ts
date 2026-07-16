import { Routes } from '@angular/router';

import {
  BUILDER_PORTAL_BUILDING_CREATE_METADATA,
  BUILDER_PORTAL_BUILDING_DETAIL_METADATA,
  BUILDER_PORTAL_BUILDING_EDIT_METADATA,
  BUILDER_PORTAL_BUILDINGS_METADATA,
} from '../../../../core/constants/route-metadata.constants';
import { buildingUnsavedChangesGuard } from './guards/building-unsaved-changes.guard';
import { BuildingCreatePageComponent } from './pages/building-create-page.component';
import { BuildingDetailPageComponent } from './pages/building-detail-page.component';
import { BuildingEditPageComponent } from './pages/building-edit-page.component';
import { BuildingListPageComponent } from './pages/building-list-page.component';
import { buildingResolver } from './resolvers/building.resolver';

export const BUILDING_ROUTES: Routes = [
  {
    path: '',
    component: BuildingListPageComponent,
    data: BUILDER_PORTAL_BUILDINGS_METADATA,
  },
  {
    path: 'create',
    component: BuildingCreatePageComponent,
    canDeactivate: [buildingUnsavedChangesGuard],
    data: BUILDER_PORTAL_BUILDING_CREATE_METADATA,
  },
  {
    path: ':buildingId',
    component: BuildingDetailPageComponent,
    resolve: { building: buildingResolver },
    data: BUILDER_PORTAL_BUILDING_DETAIL_METADATA,
  },
  {
    path: ':buildingId/edit',
    component: BuildingEditPageComponent,
    resolve: { building: buildingResolver },
    canDeactivate: [buildingUnsavedChangesGuard],
    data: BUILDER_PORTAL_BUILDING_EDIT_METADATA,
  },
];
