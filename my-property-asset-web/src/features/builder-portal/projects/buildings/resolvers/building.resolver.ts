import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';

import { Building } from '../models/building.model';
import { BuildingService } from '../services/building.service';

function resolveProjectId(route: ActivatedRouteSnapshot): string {
  return (
    route.parent?.paramMap.get('id') ??
    route.paramMap.get('id') ??
    route.parent?.parent?.paramMap.get('id') ??
    ''
  );
}

export const buildingResolver: ResolveFn<Building | RedirectCommand> = (
  route: ActivatedRouteSnapshot,
) => {
  const buildingService = inject(BuildingService);
  const router = inject(Router);
  const projectId = resolveProjectId(route);
  const buildingId = route.paramMap.get('buildingId');

  if (!buildingId || !projectId) {
    return new RedirectCommand(
      router.parseUrl(`/builder-portal/projects/${projectId || ''}/buildings`),
    );
  }

  const building = buildingService.getById(buildingId);
  if (!building || building.projectId !== projectId) {
    return new RedirectCommand(router.parseUrl(`/builder-portal/projects/${projectId}/buildings`));
  }

  return building;
};
