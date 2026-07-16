import { Routes } from '@angular/router';

import {
  SUPER_ADMIN_OPERATIONS_ACTIVITY_METADATA,
  SUPER_ADMIN_OPERATIONS_ALERTS_METADATA,
  SUPER_ADMIN_OPERATIONS_AUDIT_DETAIL_METADATA,
  SUPER_ADMIN_OPERATIONS_AUDIT_METADATA,
  SUPER_ADMIN_COMMUNICATIONS_METADATA,
  SUPER_ADMIN_OPERATIONS_HEALTH_METADATA,
  SUPER_ADMIN_OPERATIONS_METADATA,
  SUPER_ADMIN_OPERATIONS_MONITORING_METADATA,
} from '../../../core/constants/route-metadata.constants';
import { OpsActivityPageComponent } from './pages/ops-activity-page.component';
import { OpsAlertsPageComponent } from './pages/ops-alerts-page.component';
import { OpsAuditDetailPageComponent } from './pages/ops-audit-detail-page.component';
import { OpsAuditPageComponent } from './pages/ops-audit-page.component';
import { OpsCommunicationsPageComponent } from './pages/ops-communications-page.component';
import { OpsDashboardPageComponent } from './pages/ops-dashboard-page.component';
import { OpsHealthPageComponent } from './pages/ops-health-page.component';
import { OpsMonitoringPageComponent } from './pages/ops-monitoring-page.component';

export const OPERATIONS_ADMIN_ROUTE_CHILDREN: Routes = [
  {
    path: '',
    component: OpsDashboardPageComponent,
    data: SUPER_ADMIN_OPERATIONS_METADATA,
  },
  {
    path: 'health',
    component: OpsHealthPageComponent,
    data: SUPER_ADMIN_OPERATIONS_HEALTH_METADATA,
  },
  {
    path: 'audit',
    component: OpsAuditPageComponent,
    data: SUPER_ADMIN_OPERATIONS_AUDIT_METADATA,
  },
  {
    path: 'audit/:id',
    component: OpsAuditDetailPageComponent,
    data: SUPER_ADMIN_OPERATIONS_AUDIT_DETAIL_METADATA,
  },
  {
    path: 'activity',
    component: OpsActivityPageComponent,
    data: SUPER_ADMIN_OPERATIONS_ACTIVITY_METADATA,
  },
  {
    path: 'monitoring',
    component: OpsMonitoringPageComponent,
    data: SUPER_ADMIN_OPERATIONS_MONITORING_METADATA,
  },
  {
    path: 'alerts',
    component: OpsAlertsPageComponent,
    data: SUPER_ADMIN_OPERATIONS_ALERTS_METADATA,
  },
  {
    path: 'communications',
    component: OpsCommunicationsPageComponent,
    data: SUPER_ADMIN_COMMUNICATIONS_METADATA,
  },
];
