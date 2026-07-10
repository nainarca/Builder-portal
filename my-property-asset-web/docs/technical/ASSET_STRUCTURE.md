# Asset Structure — MyPropertyAsset Web Platform

**Companion to:** [`NG-008_Folder_Structure_Architecture.md`](NG-008_Folder_Structure_Architecture.md)
**Covers:** Asset Folder Placement, Icon Strategy, Image Strategy.

## 1. Asset Folder Placement

Two tiers, matching `LIBRARY_STRATEGY.md` §12's shared-vs-application-specific asset principle, now given concrete paths:

| Tier | Location | Contains |
|---|---|---|
| Shared assets (used by 2+ applications) | `libs/shared/ui/src/assets/` — travels with `shared-ui` since a shared asset almost always backs a shared component (an icon inside a shared button, a placeholder image inside a shared card) | Platform-wide icon set, placeholder imagery, shared fonts |
| Application-specific assets | `apps/<app>/src/assets/` (already named in `SOURCE_TREE.md` §2) | Anything only that application uses — e.g. Public Website's marketing imagery, which Super Admin and Builder Portal have no reason to bundle |

**Organization-specific assets (a Builder's logo) are never placed in either tier.** Per `LIBRARY_STRATEGY.md` §12, they are Organization-scoped data (A-007 ID-04), fetched at runtime from Supabase Storage — this document's contribution is the negative rule, stated plainly: no `assets/organizations/<org-id>/` folder should ever exist in this source tree, because that would silently reintroduce a build-time coupling `LIBRARY_STRATEGY.md` already explicitly ruled out.

## 2. Icon Strategy

A single shared icon set lives in `libs/shared/ui/src/assets/icons/`, consumed via a `shared-ui` icon component (not raw `<img>` tags scattered per feature) — this keeps icon usage swappable and consistent, and gives white-label a single component to theme (via `theme-tokens`' color values, per `SCSS_STRUCTURE.md` §1) rather than dozens of hard-coded SVG fills. This document places the folder; it does not select a specific icon library or format (SVG sprite vs. individual files) — that implementation choice is out of this document's scope, deferred to whichever document or ticket actually builds `shared-ui`.

## 3. Image Strategy

Application-specific marketing/content imagery lives under that application's own `assets/images/` (§1 above). No image is duplicated across applications — if an image is genuinely needed by more than one application, it is promoted to `libs/shared/ui/src/assets/images/` rather than copy-pasted, the same "reference, don't duplicate" discipline this whole documentation series has applied to data (A-007/A-008) and now applies to static assets. Responsive/optimized image delivery mechanics (srcset strategy, CDN, lazy-loading images) are not decided here — a future NG-010 (Performance & Scalability) concern, not a folder-placement one.
