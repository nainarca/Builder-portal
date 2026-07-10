# SCSS Structure — MyPropertyAsset Web Platform

**Companion to:** [`NG-008_Folder_Structure_Architecture.md`](NG-008_Folder_Structure_Architecture.md)
**Covers:** SCSS Organization, Theme Folder Placement (physical layer, not the runtime mechanism — that remains `theme-runtime`'s job, `LIBRARY_STRATEGY.md` §15).

## 1. SCSS Organization

Three tiers, matching the Core/Theme split already established (`LIBRARY_STRATEGY.md` §6), never a single global stylesheet:

| Tier | Location | Contains |
|---|---|---|
| **Design tokens** | `libs/theme/tokens/src/lib/` | SCSS variables/custom-properties generated from (or authored alongside) `theme-tokens`' TypeScript data contract — colors, spacing, typography scale. No component styling here, values only. |
| **Component styles** | Co-located with each component (`*.component.scss`, standard Angular convention) | Every `shared-ui` component and every feature's own components — each references tokens, never hard-codes a value tokens already provide (`LIBRARY_STRATEGY.md` §17 restated at the file level: "a component never hard-codes a color, it reads a token"). |
| **Application-level entry style** | `apps/<app>/src/styles/` (named in `SOURCE_TREE.md` §2) | Global resets, font-face declarations, and the single `@use` statement pulling in `theme-tokens` — the only place a full stylesheet is assembled; every component below it stays scoped. |

## 2. Theme Folder Placement (physical)

`libs/theme/tokens/` and `libs/theme/runtime/` (`SOURCE_TREE.md` §3) are where the *data* and *resolution mechanism* for white-label theming live — this document places them, it does not design what's inside either (that remains UI-001's job, per `LIBRARY_STRATEGY.md` §15's own explicit deferral). No application folder contains its own copy of theme tokens; every application's `styles/` entry point consumes `theme-tokens` via import, never redefines a value locally — this is the folder-level guarantee behind `LIBRARY_STRATEGY.md` §25's shared-asset principle applied to styling specifically.

Organization-specific white-label values (a Builder's brand color) are **runtime data, not a folder in this source tree at all** — resolved by `theme-runtime` from Supabase at Shell bootstrap, never a `.scss` file per Organization. This is the same runtime-vs-build-time boundary `WORKSPACE_GUIDE.md` §14 already drew for configuration, restated here so a future contributor doesn't mistake "add a new Organization" for "add a new SCSS file."
