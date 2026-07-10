# Menu Structure — MyPropertyAsset Web Platform

**Companion to:** [`A-005_Navigation_Flow.md`](A-005_Navigation_Flow.md)
**Purpose:** A flat listing of every menu item a user actually sees, by product and menu type — distinct from `NAVIGATION_HIERARCHY.md`'s structural tree. This answers "what's in the menu," not "how screens relate."

## Public Website

| Menu Type | Item | Target Screen | Visible To |
|---|---|---|---|
| Main (Global) | Home | PW-01 | Everyone |
| Main (Global) | Features | PW-02 | Everyone |
| Main (Global) | Pricing | PW-03 | Everyone |
| Main (Global) | About | PW-04 | Everyone |
| Main (Global) | Login | PW-09 | Everyone (routes by role post-authentication) |
| Footer (Global) | FAQ | PW-05 | Everyone |
| Footer (Global) | Contact | PW-06 | Everyone |
| Footer (Global) | Builder Registration | PW-08 | Everyone (positioned for builder-track visitors) |
| Action (Context) | Request Demo | PW-07 | Everyone, surfaced from Pricing/Features |

## Super Admin Portal

| Menu Type | Item | Target Screen | Visible To |
|---|---|---|---|
| Primary (Global sidebar) | Dashboard | SA-02 | Super Admin |
| Primary (Global sidebar) | Builders | SA-03 | Super Admin |
| Primary (Global sidebar) | Organizations | SA-05 | Super Admin |
| Primary (Global sidebar) | Users | SA-08 | Super Admin *(screen has no backing story — A-004 §14)* |
| Primary (Global sidebar) | Monitoring | SA-09 | Super Admin |
| Primary (Global sidebar) | Audit Log | SA-10 | Super Admin *(screen has no backing story — A-004 §14)* |
| Primary (Global sidebar) | Settings | SA-11 | Super Admin |
| Secondary (within Builder Detail) | Overview | SA-04 | Super Admin |
| Secondary (within Builder Detail) | White-label | SA-06 | Super Admin, only once builder is approved |
| Secondary (within Builder Detail) | Subscription | SA-07 | Super Admin, only once builder is approved |
| Dashboard Shortcut | "N pending registrations" | SA-03 (filtered) | Super Admin |

## Builder Handover Portal

| Menu Type | Item | Target Screen | Visible To |
|---|---|---|---|
| Primary (Global sidebar) | Dashboard | BA-02 | Builder Administrator |
| Primary (Global sidebar) | Projects | BA-03 | Builder Administrator |
| Primary (Global sidebar) | Owners | **Navigation gap — no backing screen** | Builder Administrator |
| Primary (Global sidebar) | Invitations | BA-09 | Builder Administrator |
| Primary (Global sidebar) | Documents | BA-10 | Builder Administrator |
| Primary (Global sidebar) | Reports | BA-11 | Builder Administrator |
| Primary (Global sidebar) | Notifications | BA-12 | Builder Administrator |
| Primary (Global sidebar) | Settings | BA-13 | Builder Administrator *(screen has no backing story — A-004 §14)* |
| Account menu | Profile | **Navigation gap — no backing screen** | Builder Administrator |
| Secondary (within Project Detail) | Units | BA-05 | Builder Administrator |
| Secondary (within Unit Detail) | Owner Assignment | BA-07 | Builder Administrator, only once unit is "Ready for Handover" |
| Secondary (within Unit Detail) | Document Upload | BA-08 | Builder Administrator |
| Dashboard Shortcut | "N units awaiting response" | BA-09 (filtered) | Builder Administrator |
| Dashboard Shortcut | "N documents pending" | BA-10 (filtered) | Builder Administrator |

## Owner Mobile App (reference only)

Not redesigned by this series. The only new menu-adjacent surface: a deep-link entry point from an invitation (email/SMS/push) into the existing app's activation/property-review flow — this is a single entry point, not a new menu structure.

## Cross-Product Notes

- No menu item ever spans two products — Super Admin's menu never shows Builder Portal items and vice versa (Role Based Navigation, A-005 §2).
- The Login Gateway (PW-09) is the only menu item that exists outside a single product's own menu, by design — it is the seam between the unauthenticated Public Website and the two authenticated portals.
