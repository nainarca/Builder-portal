# Localization Structure — MyPropertyAsset Web Platform

**Companion to:** [`NG-008_Folder_Structure_Architecture.md`](NG-008_Folder_Structure_Architecture.md)
**Covers:** Localization Folder Placement.

## Reserved, Not Designed

**No prior document in this series — not A-001 through A-009, not NG-000 through NG-007 — has ever named internationalization as an actual platform requirement.** `LIBRARY_STRATEGY.md` §16 already reserved an `i18n` library boundary for exactly this reason (cheap to reserve now, expensive to retrofit later) and explicitly flagged it as a placeholder, not a scoped feature. This document's only job is to give that reservation a folder path, consistent with the same treatment every other unbacked item in this series has received (`ARCHITECTURE_INDEX.md` §4's running list — Partner Portal, Preferences/Help routes, and now this).

## Reserved Placement

```
libs/
└── theme/                      — locale is grouped with Theme, not a new top-level category (LIBRARY_STRATEGY.md §16's own reasoning: locale is a runtime-resolved presentation concern, conceptually adjacent to theme)
    └── i18n/                   — project: theme-i18n (reserved name, not yet created)
        └── src/
            └── lib/
                └── locales/    — reserved sub-path for locale resource files, if this is ever built
```

No application's `assets/` folder gains a `i18n/` or `locales/` subfolder at this time — doing so would imply an actual locale-resource pipeline exists, which would misrepresent this as designed rather than reserved. If a future document (a genuine i18n-scoped NG or UI document) picks this up, it should treat this placement as a starting boundary only, re-verify the requirement is real, and design the actual resource-loading mechanism itself — this document deliberately stops at the folder.
