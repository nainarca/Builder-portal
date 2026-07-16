import {
  Building,
  BuildingFormModel,
  BuildingListQuery,
  BuildingListResult,
} from '../models/building.model';

export abstract class BuilderBuildingRepository {
  abstract list(query: BuildingListQuery): BuildingListResult;
  abstract getById(id: string): Building | undefined;
  abstract getByProjectId(projectId: string, includeArchived?: boolean): readonly Building[];
  abstract create(
    projectId: string,
    organizationId: string,
    model: BuildingFormModel,
  ): Building;
  abstract update(id: string, model: BuildingFormModel): Building | undefined;
  abstract archive(id: string): Building | undefined;
  abstract restore(id: string): Building | undefined;
  abstract getAll(): readonly Building[];
  abstract codeExists(projectId: string, code: string, excludeId?: string): boolean;
}
