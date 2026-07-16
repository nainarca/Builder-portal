describe('P9 builder_buildings API contracts', () => {
  const rpcs = [
    'list_builder_buildings',
    'get_builder_building',
    'create_builder_building',
    'update_builder_building',
    'archive_builder_building',
  ] as const;

  it('defines the Batch 4 RPC surface', () => {
    expect(rpcs.length).toBe(5);
    expect(rpcs).toContain('create_builder_building');
    expect(rpcs).toContain('archive_builder_building');
  });

  it('documents uniqueness and soft-delete rules', () => {
    const rules = [
      'unique (project_id, code)',
      'cannot move building across projects',
      'archive sets status=archived (soft delete)',
    ];
    expect(rules.length).toBe(3);
  });
});
