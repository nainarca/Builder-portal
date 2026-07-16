import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';

import { Project } from '../models/project.model';
import { ProjectService } from '../services/project.service';

/** Resolves a project by `:id` for detail/edit routes. */
export const projectResolver: ResolveFn<Project | RedirectCommand> = (route: ActivatedRouteSnapshot) => {
  const projectService = inject(ProjectService);
  const router = inject(Router);
  const id = route.paramMap.get('id');

  if (!id) {
    return new RedirectCommand(router.parseUrl('/builder-portal/projects/list'));
  }

  const project = projectService.getById(id);
  if (!project) {
    return new RedirectCommand(router.parseUrl('/builder-portal/projects/list'));
  }

  return project;
};
