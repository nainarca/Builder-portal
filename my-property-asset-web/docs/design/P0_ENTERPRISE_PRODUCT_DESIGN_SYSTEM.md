# P0 — Enterprise Product Design System
### MyPropertyAsset Web Platform — Product Design Blueprint

**Status:** Draft — Design Only (no implementation)
**Scope:** Super Admin Portal + Builder Portal (the entire Angular Web Platform). Excludes the Flutter Owner App (already shipped, not redesigned here) and excludes all business logic, database, and module/domain design (see the A-/NG-/P- series in `docs/architecture/` and `docs/technical/` for that).
**Explicitly out of scope:** Angular code, HTML, CSS/SCSS, component implementation. Every value in this document is a **design decision to be translated into tokens/components later**, not a snippet to paste in.
**Audience:** Whoever designs the next component library pass, whoever reviews future screens for "does this feel enterprise," and whoever onboards a new white-label customer's brand.

---

## 0. Why This Document Exists

The platform today reads as a CRUD admin template: dense forms with no grouping, inconsistent card usage, too many menu levels, and no consistent rhythm of spacing or type. That is disqualifying for the actual buyer of this product — a builder, developer, or institutional investor evaluating whether to trust an enterprise counterparty with their property portfolio, their handover workflow, and their owners' data. Enterprise buyers read visual polish as a proxy for operational trustworthiness before they ever test a feature.

This document redesigns the **experience layer only**: how information is organized, how the eye is guided, how state is communicated, and how every screen is built from the same small set of rules. It does not touch what data exists or what a screen does — only how a person perceives, trusts, and moves through it.

---

## 1. Product Design Philosophy

**"Quiet confidence."** The interface should feel like it was built by people who have done this many times before — nothing decorative, nothing hesitant, nothing that calls attention to itself except the data the user actually came for.

Four commitments, in priority order when they conflict:

1. **Clarity over cleverness.** If a design idea makes a screen more interesting but less immediately readable, it loses. This is a tool used daily under time pressure (site visits, handover day, investor reporting), not a marketing surface browsed once.
2. **Density with air.** Enterprise software fails in two opposite directions: cramped Bootstrap-CRUD density, or SaaS-marketing whitespace that wastes a 27" monitor. The target is **information-dense but never cramped** — every pixel of whitespace is intentional (it groups or separates), never leftover.
3. **One visual system, many surfaces.** A Super Admin table, a Builder Portal wizard, and a mobile Owner-facing summary card must all be visibly the same product. Consistency is the actual deliverable of this document — more valuable than any individual screen's polish.
4. **Restraint as a brand attribute.** No gradients-as-decoration, no illustration-heavy empty states, no more than one accent color doing work on any given screen. Restraint is what "enterprise" and "premium" both cash out to, visually — it is not the absence of a design point of view, it is the design point of view.

---

## 2. UX Principles

1. **Progressive disclosure by default.** Every list, detail page, and form shows the 20% of fields a user needs 80% of the time up front; everything else is one deliberate click away (expand, "Show more," a secondary tab) — never hidden entirely, never all shown at once.
2. **One primary action per screen.** Every screen has exactly one visually dominant action (the filled button). Everything else — secondary buttons, icon buttons, links — is visually subordinate. A screen with three equally loud buttons has no primary action at all.
3. **State is always visible, never guessed.** Loading, empty, error, partial-save, and stale-data states are first-class designs (§19–22), not afterthoughts patched in after the "happy path" ships.
4. **The system explains itself.** Status is communicated by consistent badge/color/icon vocabulary (§7, §8), not by prose the user has to read every time. A user should be able to scan a table of 40 handovers and understand portfolio health in four seconds.
5. **Undo and confirm scale with consequence.** Reversible actions (archive, draft-save) are single-click. Irreversible or high-consequence actions (delete, approve a handover, deactivate a builder) require a confirmation step that names the specific consequence, not a generic "Are you sure?"
6. **Context never gets lost.** In a nested hierarchy (Organization → Project → Building → Unit → Owner → Handover), the user always sees the breadcrumb trail and can jump back to any ancestor in one click. Deep linking is a UX feature, not just a routing detail.
7. **Keyboard and power-user paths exist alongside the polished default.** Command palette, `/` to search, `⌘K`-style quick navigation — enterprise operators (Super Admin staff, builder back-office teams) live in this tool 8 hours a day and will judge it on how little the mouse is needed for repetitive work.

---

## 3. Visual Language

**Descriptors this system optimizes for:** engineered, precise, calm, financial-grade, spatially generous, quietly premium.

**Descriptors this system explicitly rejects:** playful, gamified, loud, trendy-for-its-own-sake, illustration-heavy, "dashboard as wallpaper."

**Reference language, not reference literalism** — study these products for *principles*, never copy a specific screen:

| Product | What we take from it |
|---|---|
| **Stripe Dashboard** | Restrained color used only for status/meaning; monospace for financial/ID values; table density done right |
| **Linear** | Keyboard-first navigation, command palette, near-instant perceived performance, minimal chrome |
| **Notion** | Progressive disclosure, calm typography hierarchy, generous but purposeful whitespace |
| **Vercel** | Dark-mode-first engineering aesthetic, monochrome-plus-one-accent discipline |
| **Azure Portal / Salesforce Lightning** | Proof that dense, multi-entity enterprise data *can* stay legible at scale — the density model, not the visual skin |
| **HubSpot / Atlassian** | Consistent iconography and badge vocabulary across dozens of object types without visual fatigue |
| **Framer** | Motion used only to communicate state change, never as spectacle |

**The one-accent-color rule:** any given screen may use exactly one accent color for interactive/primary emphasis. Status colors (§7) are semantic and separate from brand accent — they never compete with it.

---

## 4. Design Tokens

Design tokens are the contract between this document and whatever implements it later. They are named here as a **specification**, not as CSS — actual variable syntax, units, and file structure belong to a future implementation-phase document (see `docs/technical/NG-013_Frontend_Presentation_Architecture.md`'s `DESIGN_TOKENS.md`, which this document supersedes at the decision level and which should be revised to match).

Token categories to be defined downstream, each with a **Core** tier (raw values) and a **Semantic** tier (purpose-named aliases pointing at Core — semantic tokens are the only ones components ever reference):

| Category | Core tier example | Semantic tier example |
|---|---|---|
| Color | `neutral.0`…`neutral.900`, `brand.500`, `success.500` | `surface.default`, `text.primary`, `border.subtle`, `action.primary` |
| Spacing | `space.1`…`space.12` (§5) | `layout.gutter`, `stack.section`, `inline.field-gap` |
| Typography | `font.size.1`…`font.size.9` (§6) | `text.heading.page`, `text.body.default`, `text.label.field` |
| Radius | `radius.sm/md/lg/full` | `surface.card.radius`, `control.radius` |
| Elevation | `elevation.0`…`elevation.4` (§8) | `surface.card.shadow`, `surface.overlay.shadow` |
| Motion | `duration.fast/base/slow`, `ease.standard` | `transition.hover`, `transition.panel` |

**Rule:** semantic tokens are never bypassed. A component that needs "the danger color" reaches for `text.danger` / `surface.danger-subtle`, never `red.500` directly — this is what makes white-labeling (§25) and dark-mode (a reserved future track, not in this phase's scope) possible without a rewrite.

---

## 5. Spacing System

An **8pt base grid**, one scale, used everywhere — no screen invents its own spacing value.

| Token | Value | Primary use |
|---|---|---|
| `space.1` | 4px | Icon-to-label gap, tight inline pairs |
| `space.2` | 8px | Compact control padding, chip padding |
| `space.3` | 12px | Form field internal padding |
| `space.4` | 16px | Default gap between related elements (label→input, card internal padding on dense surfaces) |
| `space.5` | 24px | Card internal padding (standard), gap between fields in a form group |
| `space.6` | 32px | Gap between form groups/sections within a card |
| `space.8` | 48px | Gap between major page sections (e.g. KPI row → content) |
| `space.10` | 64px | Page-level top margin under a page header, empty-state vertical rhythm |
| `space.12` | 96px | Reserved for marketing/public-site only — never inside authenticated app shells |

**Two governing rules:**
- **4px is the smallest legal increment; nothing is ever off-grid.** A one-off "13px" is how CRUD-template drift starts.
- **Related things sit at the smaller distance, unrelated things at the larger one.** Spacing itself is the primary grouping mechanism — before color, before dividers, before card borders. A properly-spaced page needs almost no visible borders at all.

---

## 6. Typography System

**One typeface family, two roles:**

- **Interface/UI typeface:** a neutral, high-legibility grotesque (Inter-class) for all labels, body copy, navigation, buttons.
- **Numeric/tabular typeface:** the same family's **tabular-figure** variant for every number that appears in a table, KPI, or financial context — amounts, unit counts, dates, IDs. Numbers must align in columns; this single rule does more for "financial-grade" perception than any color choice.

| Token | Size | Weight | Usage |
|---|---|---|---|
| `text.display` | 32px | 600 | Reserved for Super Admin/Builder Portal landing hero only (rare) |
| `text.heading.page` | 24px | 600 | Page title (e.g. "Projects", "Handover #HX-2291") |
| `text.heading.section` | 18px | 600 | Card/section header |
| `text.heading.sub` | 15px | 600 | Sub-section, table group header |
| `text.body.default` | 14px | 400 | Default body copy, form values, table cells |
| `text.body.emphasis` | 14px | 500 | Emphasized inline value (e.g. a KPI's label) |
| `text.label.field` | 13px | 500 | Form field labels, table column headers (uppercase, letter-spaced) |
| `text.caption` | 12px | 400 | Meta text, timestamps, helper text under fields |
| `text.overline` | 11px | 600 | Rare — status-strip or eyebrow text only, uppercase, letter-spaced |

**Line-height rule:** 1.5× for body copy, 1.2× for headings — headings are compact, reading copy is relaxed.

**Hierarchy discipline:** no screen uses more than 4 of these 9 sizes. A form uses `page`, `section`, `label.field`, `body.default`, `caption` — five is the practical ceiling. More than that is the CRUD-template symptom this document exists to remove.

---

## 7. Color System

**Structure:** one neutral ramp (10 steps) that does 90% of the work, one brand/accent color (white-label-able, §25), and five semantic status colors that are **never used for decoration, only for meaning.**

| Role | Token | Behavior |
|---|---|---|
| Neutral ramp | `neutral.0`→`neutral.900` | Backgrounds, borders, all text — the entire visual weight of the product lives here |
| Brand/accent | `brand.500` (+ 2 supporting steps) | Primary buttons, active nav item, focus ring, links, selected states only |
| Success | `success.500` | Completed, approved, active, in-good-standing |
| Warning | `warning.500` | Pending action, expiring soon, needs attention |
| Danger | `danger.500` | Rejected, overdue, failed, destructive action |
| Info | `info.500` | Informational, neutral in-progress (distinct from warning — no urgency implied) |
| Neutral-status | `neutral.500` | Draft, archived, inactive — deliberately desaturated so it recedes |

**Non-negotiable rules:**
- **Danger is never overridable by white-label theming** (carried forward from the existing `THEME_ARCHITECTURE.md` decision) — an organization's brand color can never be allowed to visually soften a destructive or overdue state.
- **Status color always pairs with an icon or label, never color alone** — this is an accessibility floor (WCAG 2.1 AA, already an accepted ADR at NG-012), not a nice-to-have.
- **Backgrounds are never pure white or pure black.** `neutral.0` is an off-white with a faint warmth or coolness (final hue TBD by the visual designer executing this system) — pure `#FFFFFF` reads as "default Bootstrap," not "designed."
- **Every screen has exactly one accent moment** — reinforces §3's one-accent-color rule at the token level.

---

## 8. Elevation System

Elevation communicates **hierarchy of interaction layer**, not decoration. Five levels only:

| Level | Token | Meaning | Example |
|---|---|---|---|
| 0 | `elevation.0` | Flat, resting surface | Page background, table row |
| 1 | `elevation.1` | Slightly raised, static content | Standard card, KPI tile |
| 2 | `elevation.2` | Interactive/hoverable surface | Card on hover, dropdown trigger |
| 3 | `elevation.3` | Floating, temporary | Popover, dropdown menu, toast |
| 4 | `elevation.4` | Modal layer | Dialog, drawer, wizard overlay |

**Rule:** shadows are soft, low-opacity, and cool-neutral — never a hard drop-shadow. A card at rest should look like it sits a hair above the page, not like it's floating in a game UI. Borders (`border.subtle`) are preferred over shadow for level 1 wherever the surface doesn't need to communicate "this moves/reacts."

---

## 9. Iconography

- **One icon set, used exhaustively.** A single outlined, geometrically consistent icon library (stroke-based, ~1.5–2px stroke weight at 20–24px) — never mixing filled and outlined styles, never mixing two vendors' icon sets.
- **Icons are functional, not decorative.** Every icon either (a) labels a navigation destination, (b) represents an action, or (c) reinforces a status. An icon with no semantic job (purely to "fill space" in an empty state or card) is not used.
- **Consistent sizing scale:** 16px (inline with text/table cells), 20px (buttons, form fields), 24px (navigation rail, page headers). No arbitrary in-between sizes.
- **Entity iconography is fixed and memorized-once:** Organization, Builder, Project, Building, Unit, Owner, Document, Handover each get exactly one icon used everywhere they appear (nav, breadcrumbs, table rows, cards) — a user should recognize "this row is a Unit" from the icon alone before reading the label.

---

## 10. Navigation Philosophy

The current product's complaint — "too many menus" — is solved structurally, not by hiding items:

- **Two-tier navigation, never three.** A left rail (top-level sections: Dashboard, Projects, Owners, Documents, Handovers, Settings) plus in-page tabs for a specific record's sub-views (e.g. a Project's Overview/Buildings/Units/Documents tabs). No flyout-within-flyout mega-menus.
- **The rail is collapsible to icon-only**, expanding on hover/pin — gives dense-data screens their width back without removing navigation.
- **Breadcrumbs are mandatory on every nested detail page**, styled as first-class navigation (clickable ancestors), not decorative text.
- **Command palette (`⌘K` / `Ctrl+K`) is a Phase-1 navigation citizen, not a stretch goal** — jump to any Project/Unit/Owner/Handover by name, or trigger any primary action, without touching the rail. This is the single highest-leverage "feels like Linear, not like a CRUD template" investment available.
- **Organization/context switcher lives in the header, always visible, never buried** — Super Admin staff and multi-project builder teams need to always know "which context am I in" without hunting.
- **Notifications and profile are icon-only in the top-right, consistent across both portals** — never duplicated into the left rail.

---

## 11. Dashboard Layout

A dashboard's job is **triage**, not decoration — "what needs my attention today," answered in under five seconds.

**Standard structure, top to bottom:**
1. **Context header** — page title, current scope (e.g. Organization name), primary action (top-right, one only).
2. **KPI strip** — 3–5 tiles maximum, each one number + one trend indicator + one label. Never more than 5; a KPI strip that needs a horizontal scrollbar has failed.
3. **Attention zone** — the single most important "needs action" list (e.g. overdue handovers, pending approvals) — always above the fold, always the second thing seen.
4. **Portfolio/activity zone** — charts and recent-activity feed, two-column on desktop, stacked on tablet.
5. **Quick actions** — a small, fixed set (3–4) of the most common creation/navigation shortcuts, never a dumping ground for every possible action.

**Rule:** a dashboard tile earns its place by answering a question the user asks daily. If a stakeholder can't say what decision a tile drives, the tile is cut — this is the direct fix for "too much empty space / random cards."

---

## 12. Form Design Principles

Forms are the highest-volume surface in this product (Project/Building/Unit/Owner/Document creation, handover stages) and the biggest current offender ("large forms without visual grouping").

- **Every form is grouped into named sections** (e.g. "Basic Details," "Location," "Compliance") — a section never exceeds 6 fields before it's split further.
- **Single column by default.** Multi-column forms are only used for genuinely paired short fields (City/State, Start Date/End Date) — never as a density trick for unrelated fields, which is the #1 cause of "which field does this label belong to" confusion.
- **Inline validation, not submit-time surprise.** A field validates on blur; errors appear directly under the field, never as a page-top banner listing 12 problems.
- **Labels above fields, always** (never left-aligned label + right-aligned input) — scans faster, works identically at any label-text length across future localization.
- **Long forms use a persistent section-progress indicator** (sidebar or sticky top strip showing which named section the user is in) — replaces "scroll and hope," directly answering the "large forms without grouping" complaint.
- **Destructive/irreversible fields are visually set apart** (e.g. a subtle enclosing border or distinct section) — a user should never discover a field was high-consequence only after submitting.
- **Every form has an explicit, always-visible save state** (Draft saved automatically / Unsaved changes / Saved) — never silent.

---

## 13. Table Design

Tables are where "enterprise-grade" is won or lost — this product lives and dies by Project/Unit/Owner/Document/Handover lists.

- **Tabular figures for every numeric column** (§6) — right-aligned; text columns left-aligned; status columns center-aligned with a badge, never raw text.
- **Row density: comfortable by default, compact as a user-toggleable preference** — enterprise operators processing hundreds of units want density control; casual users want breathing room. Both are legitimate, so it's a toggle, not a fixed decision.
- **Sticky header, sticky primary column** on horizontal scroll for wide tables (many Unit/Owner attributes) — a row's identity column must never scroll out of view.
- **Sort, filter, and column visibility are always available, never hidden behind a settings page** — a filter bar sits directly above the table, persistent, not a modal.
- **Bulk selection reveals a contextual action bar** (not a floating toolbar that obscures rows) — appears only when ≥1 row is selected, disappears otherwise.
- **Status is always a badge** (subtle background tint + label + optional icon, from the §7 semantic palette) — never a colored table row, which reads as a spreadsheet, not a product.
- **Empty, loading, and zero-filtered-result states are distinct designs** (§19–22) — a table that just goes blank when a filter matches nothing is a common, avoidable failure.
- **Row click opens detail; a distinct affordance (icon button, kebab menu) handles secondary actions** — never overload the row click with ambiguity about what it does.

---

## 14. Wizard Design

Used for genuinely multi-step, ordered creation flows (Project creation, Handover stage progression) — not a default for every form.

- **A wizard is justified only when steps have a real, meaningful order** (e.g. you cannot assign a Unit before the Project exists). If steps are just "a long form cut into pages," it should be a grouped single-page form (§12) instead — this is a real anti-pattern to avoid, not a stylistic choice.
- **Persistent stepper at the top**, showing all steps at once (never a single "Step 3 of 8" text label alone) — the user always sees the whole journey and can jump back to any completed step.
- **Each step validates independently before advancing** — no "you can't find out step 2 was wrong until step 6."
- **Save-and-exit is always available**, not just Cancel — enterprise users get interrupted; a wizard that discards 20 minutes of work on a closed tab is a trust-breaking failure.
- **The final step is always a review/summary**, never a blind submit — show exactly what will be created before the commit action fires.
- **The handover pipeline (already an 8-stage engine in the existing implementation) is the canonical example of a *tracker*, not a wizard** — worth distinguishing explicitly: a wizard is a single session's guided input; a stage tracker (§15) is a long-running, multi-day/week process with its own persistent visualization. Don't force one pattern to serve both jobs.

---

## 15. Builder Portal UX

The Builder Portal is the operational home for a builder's back-office team — high daily usage, high entity-count (many projects × buildings × units × owners), and the primary showcase surface for the white-label pitch.

- **Portfolio-first mental model.** The Builder Portal's dashboard and navigation are organized around "my portfolio," with Project as the primary organizing entity — every deeper entity (Building, Unit, Owner, Document, Handover) is reached by drilling into a Project, never presented as a disconnected flat list as the *default* view (flat cross-project views like the existing Owners/Documents directories remain available, but framed as secondary/global views, not the front door).
- **The handover workflow is this portal's signature moment** — it is the one workflow a builder will demo to their own investors and to prospective owners. It deserves the highest design investment in the entire product: the stage tracker, the digital signature moment, and the completion certificate should feel closer to a premium onboarding/checkout flow than to an internal admin screen.
- **Compliance and document state must be scannable at a glance** — a builder's back-office anxiety is "did we get every approval before handover." Document approval status and inspection readiness (Go/No-Go) use the strongest, most consistent badge treatment in the product for exactly this reason.
- **Multi-project switching is frictionless** — the header context switcher (§10) is load-bearing for any builder with more than a handful of active projects.
- **This portal is the white-label demo surface** (§25) — every design decision here should be sanity-checked against "would this still look premium with a different logo and accent color."

---

## 16. Super Admin UX

The Super Admin Portal is an internal operations tool for the platform owner's own staff — different job, different design bias.

- **Operator density over marketing polish.** Super Admin staff live in tables and audit trails all day; this portal can (and should) run denser by default than the Builder Portal, with compact row density as the default rather than opt-in.
- **Cross-organization awareness is constant.** Every screen that shows Builder/Organization data makes the current organization scope unmistakable in the header — the cost of a Super Admin operator acting on the wrong organization is high.
- **Support Access is a visibly distinct mode.** When a Super Admin operator has an active, time-boxed Support Access session into a builder's data (the existing platform mechanism), the entire chrome should carry a persistent, unmissable visual indicator (a distinct header treatment, a visible countdown) — this is a trust/audit feature expressed as design, not just a backend log entry.
- **Audit and activity views prioritize scanability over density of detail** — an audit log is read under time pressure during an investigation; filters, timestamps, and actor identity need to be the loudest elements on the row, with full detail one click away.
- **Settings and configuration screens (organization management, builder onboarding, feature flags) favor clarity and explicit state over compactness** — these are lower-frequency, higher-consequence actions where a mistake is expensive; slow down the visual pace deliberately (more spacing, more explicit confirmation) relative to the high-frequency list/table screens.

---

## 17. Mobile Responsive Strategy

Both portals are desktop-primary (operational, high-density, keyboard-and-mouse tools), but the responsive strategy must not be an afterthought — field staff (site inspectors, builder back-office on the move) will hit these screens on tablets and phones.

- **Tiered responsive commitment, not one-size-fits-all:**
 - **Desktop (≥1280px):** full experience, full density options, multi-column layouts.
 - **Tablet (768–1279px):** single-column dashboards, tables become horizontally scrollable with sticky primary column, side rail collapses to icon-only by default. This tier must be genuinely usable, not just "doesn't break" — inspection checklists and handover sign-off (§15) are realistically used on a tablet on-site.
 - **Phone (<768px):** read-oriented, not create-oriented. Tables convert to stacked card rows (each row's key fields become a small labeled card, not a squeezed table). Wizards and long forms are explicitly discouraged below tablet width — the design should guide (not silently block) complex creation flows back to a larger screen, via a clear inline notice rather than a broken cramped layout.
- **Touch targets scale up, not just layout.** Any control usable on tablet/phone meets a minimum 44px touch target, regardless of the desktop control's visual size.
- **The Owner-facing surfaces already live in the Flutter app** — this web platform's mobile responsive tier is for internal staff on the move, not a competing owner experience, which keeps its scope bounded.

---

## 18. Component Library

The existing technical decision (ADR-021, `docs/technical/NG-013...`) already establishes a three-tier **Primitive / Composite / Feature** classification on top of PrimeNG. This document adds the *design* rules that tier should follow — it does not re-decide the tier structure itself.

**Primitive tier** (buttons, inputs, selects, checkboxes, badges, tooltips): every primitive has exactly 5 states designed up front — default, hover, focus, disabled, error (where applicable) — before it is ever used in a feature screen. No feature screen invents a one-off variant of a primitive.

**Composite tier** (cards, modals, data tables, stepper, KPI tile, filter bar, empty-state block): each composite is designed once, generically, then reused verbatim across every feature domain (Projects, Units, Owners, Documents, Handovers, Organizations, Builders). A composite that needs a special case for one domain is a signal the composite's design was incomplete, not that the domain needs an exception.

**Feature tier**: assemblies of Composites/Primitives specific to one business screen — these are the only tier allowed to be domain-specific, and even here, layout patterns (§23 Page Templates) are reused across domains.

**Governing rule carried from NG-013 and restated at the design level:** a new visual pattern is never introduced inside a Feature-tier component. If a screen needs something new, it is designed once at the Composite tier and then reused — this is the actual mechanism that prevents the "poor component consistency" complaint from recurring as the product grows to dozens of screens.

---

## 19. Empty States

An empty state is a **first-impression and onboarding surface**, not an error to apologize for.

- **Structure:** one small, purposeful icon (from the existing icon set, §9 — never a large decorative illustration), one short headline naming what's missing, one sentence of context, one primary action button.
- **Three distinct empty-state variants, not one generic template:**
 1. **True zero-state** ("You haven't created a Project yet") — optimistic, action-forward, sells the value of taking the action.
 2. **Filtered-to-zero** ("No units match these filters") — neutral, offers a "Clear filters" action, never implies the data itself is missing.
 3. **Scoped-empty** ("This building has no units yet," inside an otherwise populated hierarchy) — contextual, action defaults to creating within the current scope.
- **Never a full illustration-heavy graphic** — a single small icon at low visual weight keeps this consistent with the "restraint" brand attribute (§1, §3) rather than reading as consumer-SaaS whimsy.

---

## 20. Error States

- **Field-level errors** (§12): inline, specific, actionable ("Start date must be before end date," never "Invalid input").
- **Page/section-level errors** (a failed data load): replace only the affected region, never the whole shell — the navigation and header remain usable so the user isn't stranded. Includes a specific retry action.
- **System-level errors** (session expired, network down, permission denied): a distinct, full-context takeover state — but even here, tells the user exactly what happened and exactly what to do next, never a bare "Something went wrong."
- **Destructive-action confirmation is treated as error-adjacent design**: the confirmation dialog names the specific record and specific consequence ("Archive Project 'Sunrise Towers'? Its 3 active buildings and 42 units will be archived with it.") — never a generic "Are you sure?" This is both a UX-quality and a genuine risk-reduction feature for an enterprise tool.
- **Tone:** factual and calm, never alarmist, never cute. No exclamation points, no "Oops!"

---

## 21. Loading States

- **Sub-300ms operations show nothing** — a flicker of a spinner is worse than no feedback at all.
- **300ms–2s operations** show an inline, localized loading indicator scoped to the specific region being updated (a button's own spinner, a table's own overlay) — never a full-page blocker for a partial update.
- **>2s operations** (report generation, bulk import, first full page load) use skeleton screens (§22), not spinners — a skeleton communicates *shape and imminent structure*, which measurably reduces perceived wait versus a generic spinner.
- **Every async action that mutates data shows an explicit success confirmation** (a toast, or an inline state change like a button transitioning to a checkmark) — silence after submission is a trust failure ("did that actually save?").
- **Long-running background processes** (bulk document upload, report export) get a persistent, dismissible progress indicator that survives navigation, not a modal that blocks the rest of the app until it finishes.

---

## 22. Skeleton Design

- **Skeletons mirror the real layout's shape exactly** — same grid, same card boundaries, same approximate text-line lengths as the content that will replace them. A skeleton that doesn't match its eventual content causes a visible "jump" that reads as sloppy.
- **Skeleton blocks use a single subtle shimmer/pulse animation**, one shared timing across the whole product — never a different animation style per screen.
- **Skeletons are built once per Composite** (table-row skeleton, card skeleton, KPI-tile skeleton, detail-page skeleton) and reused everywhere that composite is reused — consistent with §18's Composite-tier discipline.
- **Never skeleton the navigation chrome** — the rail, header, and breadcrumb are populated instantly from already-known state (route, user session); only the data-dependent content region ever shows a skeleton.

---

## 23. Page Templates

A small, fixed set of page templates covers every screen in both portals — a new feature domain (e.g. a future Snag Management module) should be assemblable entirely from these without inventing a new layout:

1. **Dashboard template** (§11) — KPI strip + attention zone + activity zone + quick actions.
2. **List/Table template** (§13) — page header with primary action, filter bar, table, pagination, bulk-action bar on selection.
3. **Detail template** — breadcrumb, entity header (name + status badge + key metadata + primary/secondary actions), tabbed sub-sections, each tab reusing List or Form templates as appropriate.
4. **Form/Create-Edit template** (§12) — grouped single-column sections, section-progress sidebar for long forms, persistent save-state indicator.
5. **Wizard template** (§14) — persistent stepper, per-step validation, review step, save-and-exit.
6. **Stage-Tracker template** (§14) — for long-running multi-stage processes (handover pipeline model): persistent visual pipeline + current-stage detail + historical timeline, distinct from a Wizard.
7. **Settings template** — for configuration screens (§16): slower visual pace, explicit sectioned settings groups, always-visible save/discard state.

**Rule:** any new screen request should be answered "which of these seven templates does this fit," not "let's design a new layout." This single discipline is what actually prevents the platform from re-accumulating CRUD-template drift as it grows.

---

## 24. Enterprise Design Rules

A condensed checklist — the fastest way to catch regression toward the current CRUD-template feel in any future screen review:

1. Exactly one primary (filled) action visible per screen.
2. Exactly one accent color doing interactive work per screen; status colors are semantic only, never decorative.
3. No spacing value outside the 8pt scale (§5); no off-grid "13px" fixes.
4. No more than 4 type sizes on any single screen (§6).
5. Numbers are tabular-aligned in every table and KPI (§6).
6. Every status is a badge with icon + label, never color-only, never a colored table row.
7. Every list has designed empty, loading, error, and zero-filtered-result states — not just the happy path.
8. Every destructive action names its specific consequence in its confirmation.
9. No new visual pattern is invented inside a Feature-tier component (§18) — it goes to Composite tier first.
10. Every nested detail page shows a clickable breadcrumb trail.
11. No decorative illustration, gradient, or icon that isn't functionally load-bearing (§1, §3, §19).
12. Every screen fits one of the seven Page Templates (§23) — a genuinely new template is a deliberate, rare decision, not a default.

---

## 25. White-label Strategy

The platform's eventual buyers include builders who will present this tool under their own brand to their own owners and investors — the design system must support that without ever compromising the rules above.

**Bounded customization surface** (consistent with the existing `THEME_ARCHITECTURE.md` decision — this document does not expand it, only restates its design rationale):

- **Primary/brand accent color** — the single accent used per §3/§7's one-accent-color rule. Swapping it must never break contrast/accessibility floors; any organization-submitted color is validated against a minimum contrast ratio before acceptance, with the platform default as a safe fallback.
- **Logo** — placed in the header/nav in a single fixed slot sized and cropped consistently regardless of the source logo's aspect ratio.
- **One reserved secondary/accent color slot** — for future use (e.g. a chart-series accent), not yet activated.

**Permanently non-overridable, regardless of white-label tier:**

- All semantic status colors (§7) — danger, warning, success, info, neutral-status.
- Spacing, typography scale, elevation, and iconography (§5, §6, §8, §9) — the *system* is the product; only the brand skin is licensed.
- All seven Page Templates and every Composite-tier component's structure (§18, §23).

**Design implication:** every screen in this system should be designed and reviewed with a mental "brand swap test" — replace the accent color and logo, and the screen must still look deliberate, premium, and internally consistent. If a screen only looks good under the platform's own default brand, its design relies on something that shouldn't be customization-fragile, and it fails this system's white-label bar.

---

## Appendix: Traceability to Existing Architecture

This document is a design-layer addition, not a replacement, for what's already decided:

- Supersedes-at-the-decision-level: `docs/technical/DESIGN_TOKENS.md`, `THEME_ARCHITECTURE.md`, `COMPONENT_ARCHITECTURE.md`'s visual (not structural) content — those documents' *structural* decisions (PrimeNG as the underlying library, ADR-021's Primitive/Composite/Feature tiering, the bounded white-label surface) stand; this document supplies the visual/UX rules those structures should be filled in with.
- Assumes, does not re-decide: WCAG 2.1 AA (ADR-020), the existing entity model (Organization/Builder/Project/Building/Unit/Owner/Document/Handover), and the Support Access mechanism referenced in §16.
- Recommended next step for whoever owns this series: reconcile this document's token/component vocabulary with `DESIGN_TOKENS.md` and `COMPONENT_ARCHITECTURE.md` directly, then proceed to an implementation-phase design system (actual token values, a component spec sheet per Composite) — explicitly the next phase, not part of this document's scope.
