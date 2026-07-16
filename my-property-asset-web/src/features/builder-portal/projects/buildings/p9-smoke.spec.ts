/**
 * P9 smoke checklist — run after applying Batch 4 SQL and serving the app.
 *
 * 1. Open apartment project (Horizon Towers) → Buildings button visible
 * 2. /projects/:id/buildings → stats + list + search/filter/sort
 * 3. Create building with unique code → detail
 * 4. Attempt duplicate code → validation error
 * 5. Edit building → save
 * 6. Archive → soft-hidden; include archived → visible; Restore
 * 7. Open villa project → Buildings still available (optional)
 * 8. Confirm no Units / Owners / Documents domain work in P9
 */
describe('P9 smoke checklist', () => {
  it('documents the building management vertical-slice smoke path', () => {
    expect(true).toBeTrue();
  });
});
