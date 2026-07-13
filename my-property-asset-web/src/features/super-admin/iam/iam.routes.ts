import { Routes } from '@angular/router';

import {
  SUPER_ADMIN_IAM_INVITATIONS_METADATA,
  SUPER_ADMIN_IAM_PERMISSIONS_METADATA,
  SUPER_ADMIN_IAM_ROLE_DETAIL_METADATA,
  SUPER_ADMIN_IAM_ROLES_METADATA,
  SUPER_ADMIN_IAM_USER_CREATE_METADATA,
  SUPER_ADMIN_IAM_USER_DETAIL_METADATA,
  SUPER_ADMIN_IAM_USER_EDIT_METADATA,
  SUPER_ADMIN_IAM_USERS_METADATA,
} from '../../../core/constants/route-metadata.constants';
import { userUnsavedChangesGuard } from './guards/user-unsaved-changes.guard';
import { IamInvitationListPageComponent } from './pages/invitations/iam-invitation-list-page.component';
import { IamPermissionMatrixPageComponent } from './pages/permissions/iam-permission-matrix-page.component';
import { IamRoleDetailPageComponent } from './pages/roles/iam-role-detail-page.component';
import { IamRoleListPageComponent } from './pages/roles/iam-role-list-page.component';
import { IamUserCreatePageComponent } from './pages/users/iam-user-create-page.component';
import { IamUserDetailPageComponent } from './pages/users/iam-user-detail-page.component';
import { IamUserEditPageComponent } from './pages/users/iam-user-edit-page.component';
import { IamUserListPageComponent } from './pages/users/iam-user-list-page.component';

export const IAM_ADMIN_ROUTE_CHILDREN: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'users' },
  { path: 'users', component: IamUserListPageComponent, data: SUPER_ADMIN_IAM_USERS_METADATA },
  { path: 'users/new', component: IamUserCreatePageComponent, canDeactivate: [userUnsavedChangesGuard], data: SUPER_ADMIN_IAM_USER_CREATE_METADATA },
  { path: 'users/:id', component: IamUserDetailPageComponent, data: SUPER_ADMIN_IAM_USER_DETAIL_METADATA },
  { path: 'users/:id/edit', component: IamUserEditPageComponent, canDeactivate: [userUnsavedChangesGuard], data: SUPER_ADMIN_IAM_USER_EDIT_METADATA },
  { path: 'roles', component: IamRoleListPageComponent, data: SUPER_ADMIN_IAM_ROLES_METADATA },
  { path: 'roles/:id', component: IamRoleDetailPageComponent, data: SUPER_ADMIN_IAM_ROLE_DETAIL_METADATA },
  { path: 'permissions', component: IamPermissionMatrixPageComponent, data: SUPER_ADMIN_IAM_PERMISSIONS_METADATA },
  { path: 'invitations', component: IamInvitationListPageComponent, data: SUPER_ADMIN_IAM_INVITATIONS_METADATA },
];
