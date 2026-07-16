import {
  Project,
  ProjectFormModel,
  ProjectListQuery,
  ProjectListResult,
} from '../models/project.model';

/**
 * P8 Builder Project repository contract.
 * In-memory implementation mirrors Batch 3 RPCs; swap provider for Supabase later.
 */
export abstract class BuilderProjectRepository {
  abstract list(query: ProjectListQuery, organizationId?: string | null): ProjectListResult;
  abstract getById(id: string): Project | undefined;
  abstract create(model: ProjectFormModel, organizationId: string, organizationName: string): Project;
  abstract update(id: string, model: ProjectFormModel): Project | undefined;
  abstract archive(id: string): Project | undefined;
  abstract restore(id: string): Project | undefined;
  abstract bulkArchive(ids: readonly string[]): number;
  abstract bulkRestore(ids: readonly string[]): number;
  abstract getAll(): readonly Project[];
  abstract getCities(organizationId?: string | null): readonly string[];
}
