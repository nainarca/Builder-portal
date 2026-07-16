import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { ProjectStoreService } from '../../services/project-store.service';
import { buildingsAreSupported } from '../utils/project-building-compatibility';

function findProjectId(route: ActivatedRouteSnapshot): string {
  let current: ActivatedRouteSnapshot | null = route;
  while (current) {
    const id = current.paramMap.get('id');
    if (id) {
      return id;
    }
    current = current.parent;
  }
  return '';
}

/**
 * P9.1 — Buildings routes are unavailable when hierarchy = DIRECT_UNITS.
 * Redirects to project detail; does not redesign the Building module.
 */
export const buildingHierarchyGuard: CanActivateFn = (route) => {
  const projects = inject(ProjectStoreService);
  const router = inject(Router);
  const projectId = findProjectId(route);
  const project = projects.getById(projectId);

  if (!project || !buildingsAreSupported(project)) {
    return router.createUrlTree(
      projectId ? ['/builder-portal/projects', projectId] : ['/builder-portal/projects/list'],
    );
  }

  return true;
};
