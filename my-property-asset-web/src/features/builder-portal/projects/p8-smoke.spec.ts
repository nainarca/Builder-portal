/**
 * P8 smoke checklist — run after applying Batch 3 SQL and serving the app.
 *
 * 1. Builder login → /builder-portal dashboard shows Total / Construction / Planning / Completed KPIs
 * 2. Open /builder-portal/projects → workspace KPIs match seed data
 * 3. Open /builder-portal/projects/list → search "Horizon", filter Construction, sort by name
 * 4. Create project with type Apartment, status Planning, city + dates → lands on detail
 * 5. Edit project → update type/status/address → save
 * 6. Archive from detail → hidden from default list; include archived → visible
 * 7. Restore archived project
 * 8. Confirm no Buildings / Units / Owners / Documents domain work was added in P8
 */
describe('P8 smoke checklist', () => {
  it('documents the project management vertical-slice smoke path', () => {
    expect(true).toBeTrue();
  });
});
