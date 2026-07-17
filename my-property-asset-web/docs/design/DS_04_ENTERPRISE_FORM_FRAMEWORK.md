# DS-04 — Enterprise Form & Wizard Framework

| Field | Value |
|---|---|
| **Document ID** | DS-04 |
| **Status** | **IMPLEMENTED** |
| **Date** | 2026-07-17 |
| **Repository** | `my-property-asset-web` |
| **Depends on** | P0, P0.1, DS-01, DS-02, DS-03 |
| **Out of scope** | Migrating Project/Builder/Unit/Owner/etc. pages; any module redesign |

---

## Summary

Reusable **Enterprise Form & Wizard** infrastructure under `src/shared/ui/enterprise/forms/`, exported via `@shared/ui`. Presentation-only: no domain services, no business validation rules, no module migrations. Modules later compose these shells/fields the same way for Create/Edit.

---

## Form Architecture

```
app-enterprise-form-shell
├── app-enterprise-form-page-header   (title / subtitle / status / breadcrumb / actions)
├── app-enterprise-form-state         (loading | saving | draft | archived | error | permission)
│   ├── app-enterprise-validation-summary
│   ├── app-enterprise-form-layout    (max-width + responsive stack)
│   │   └── app-enterprise-form-section* (collapsible section cards)
│   │       └── app-enterprise-form-field + input components
│   └── app-enterprise-form-actions   (sticky Save / Draft / Cancel / Delete / Archive)
```

**Section kinds:** General Information, Address, Configuration, Financial, Attachments, Audit, Advanced (`kind` input).

**Field chrome:** label, required `*`, hint, inline error, quiet success, disabled / readonly.

---

## Wizard Architecture

```
app-enterprise-wizard
├── phase: steps
│   ├── progress meta (“Step X of Y”)
│   ├── app-stepper (existing) + step body projection
│   ├── validation summary
│   └── sticky Draft / Cancel
├── phase: review
├── phase: confirmation
└── phase: completion
```

Outputs: `next`, `previous`, `stepChange`, `saveDraft`, `cancel`, `review`, `confirm`, `submit`, `completionAction`.  
Step validity is supplied by the host via `canProceed` / `validationIssues` (no domain logic inside the framework).

---

## Files Created

| Path | Role |
|---|---|
| `enterprise/forms/models/enterprise-form.models.ts` | Section kinds, lifecycle, upload/wizard types |
| `enterprise/forms/form-page-header.component.ts` | Form page header |
| `enterprise/forms/form-layout.component.ts` + styles | Layout width / spacing |
| `enterprise/forms/form-section.component.ts` + styles | Collapsible section cards |
| `enterprise/forms/form-field.component.ts` + styles | Field chrome |
| `enterprise/forms/form-inputs.component.ts` | Text/textarea/email/phone/currency/%/date/range/select/autocomplete/multi/toggle/checkbox/radio |
| `enterprise/forms/form-actions.component.ts` | Sticky actions + validation summary wrap |
| `enterprise/forms/form-state.component.ts` | Lifecycle states |
| `enterprise/forms/form-shell.component.ts` | Full form shell composer |
| `enterprise/forms/wizard/*` | Wizard framework |
| `enterprise/forms/files/*` | File/image upload + document preview |
| `enterprise/forms/index.ts` | Barrel |
| `docs/design/DS_04_ENTERPRISE_FORM_FRAMEWORK.md` | This document |

## Files Modified

| Path | Change |
|---|---|
| `src/shared/ui/enterprise/index.ts` | `export * from './forms'` |

**Unchanged:** feature modules, routes, auth, RBAC rules, Supabase, Flutter.

---

## Component Mapping

| DS-04 requirement | Selector |
|---|---|
| Page header | `app-enterprise-form-page-header` |
| Form layout | `app-enterprise-form-layout` / `app-enterprise-form-shell` |
| Collapsible sections | `app-enterprise-form-section` |
| Field chrome | `app-enterprise-form-field` |
| Inputs | `app-enterprise-*-input` / `app-enterprise-radio-group` |
| Sticky actions | `app-enterprise-form-actions` |
| Validation summary | `app-enterprise-validation-summary` |
| Form states | `app-enterprise-form-state` |
| Wizard | `app-enterprise-wizard` |
| Attachments / images | `app-enterprise-file-upload` / `app-enterprise-image-upload` |
| Document preview | `app-enterprise-document-preview` |

---

## Migration Strategy (future — not in DS-04)

1. New Create/Edit screens adopt `app-enterprise-form-shell` first.
2. Replace local `*-form__field` BEM with `app-enterprise-form-field` + input selectors.
3. Wrap existing multi-step feature wizards with `app-enterprise-wizard` while keeping feature state services.
4. Do **not** dual-run redesigns of Project/Builder/Unit pages in the same change set as framework adoption.

---

## Accessibility

- Labels associated via `for` / `aria-label`; required announced to AT
- Errors use `role="alert"`; summary uses existing validation alert region
- Section toggle exposes `aria-expanded` / `aria-controls`
- Wizard progress is live-region polite; completion uses real heading
- File upload progressbars expose valuemin/max/now; remove controls labeled
- Sticky actions reserved bottom padding on form layout so focus is not obscured
- Tokens only (`--mpa-*`) for color/spacing — white-label / dark-mode ready

---

## Responsive Behaviour

- Form layout max-widths: narrow / default / wide / fluid
- Section fields: optional 2-column on desktop → forced 1-column &lt; 768px
- Date range stacks on phone
- Sticky actions: primary Save full-width on small screens
- Wizard progress meta compact on tablet/phone; stepper inherits existing responsive styles

---

## Verification Checklist

- [x] Standalone Angular components under `enterprise/forms`
- [x] Composes DS-03 buttons / sticky bar / empty / loading / alerts
- [x] No business module migrations
- [x] Design tokens only (no hardcoded brand colors)
- [x] `npx ng build --configuration=development`
- [ ] Optional smoke: mount `app-enterprise-form-shell` in a blank sandbox (not required for DS-04)

---

## Future Extension Points

| Extension | Approach |
|---|---|
| Reactive Forms CVA adapters | Optional wrappers around enterprise inputs |
| Autosave indicator | Slot into form header toolbar |
| Wizard dialog (P0.1 §7.2) | Compose wizard inside `app-preview-dialog` / modal shell |
| Server-driven section schemas | Feed `kind` + field configs from feature layer |
| Upload transport | Feature services consume `filesSelected` / `retry` events |

---

## STOP

DS-04 delivers reusable Form & Wizard infrastructure only. Existing business pages were not migrated or redesigned.
