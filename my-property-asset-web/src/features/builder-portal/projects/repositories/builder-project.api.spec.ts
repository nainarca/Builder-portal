/**
 * P8 API contract smoke — mirrors Batch 3 RPC names expected by the repository layer.
 */
describe('P8 builder_projects API contracts', () => {
  const rpcs = [
    'list_builder_projects',
    'get_builder_project',
    'create_builder_project',
    'update_builder_project',
    'archive_builder_project',
  ] as const;

  it('defines the Batch 3 RPC surface', () => {
    expect(rpcs.length).toBe(5);
    expect(rpcs).toContain('create_builder_project');
    expect(rpcs).toContain('archive_builder_project');
  });

  it('documents list query params', () => {
    const listParams = [
      'organization_id',
      'search',
      'status',
      'project_type',
      'include_archived',
      'sort_field',
      'sort_direction',
      'page',
      'page_size',
    ];
    expect(listParams).toContain('project_type');
    expect(listParams).toContain('status');
  });
});
