# P0.1 — Enterprise Design System Architecture
### MyPropertyAsset Web Platform — Implementation Blueprint (Design Only)

**Status:** Draft — Architecture Only (no implementation)
**Depends on:** `P0_ENTERPRISE_PRODUCT_DESIGN_SYSTEM.md` (**approved, not redesigned here**) — every rule number referenced below (spacing scale, type scale, color roles, elevation levels, page templates, enterprise rules) is defined there and only *applied* here.
**Purpose:** Convert P0's principles into a **reusable component architecture** — the exhaustive list of every shell region, layout, card, navigation element, form pattern, table pattern, dialog, feedback state, chart family, and theme-layer primitive that any future page is assembled from. Nothing in this document is specific to a single business screen; anything screen-specific belongs to a future Feature-tier spec, not here.
**Explicitly out of scope:** Angular code, HTML, CSS/SCSS, component implementation, prop/API signatures. This is the architecture Cursor (or any implementer) reads *before* writing a single component — it defines what must exist and the rules each piece must obey, not how it is coded.
**How to read each entry:** every component below is specified against the same eight questions — **Purpose, When to use, When NOT to use, Visual hierarchy, Spacing rules, Responsive behaviour, Accessibility, White-label compatibility** — so that no two components in this system are documented to a different standard.

---

## 0. Architecture Principle: One Inventory, Zero One-Offs

Every future page in both portals must be assembled **entirely** from the inventory in this document. If a screen appears to need something not listed here, that is a signal to extend this document first (a new Composite, reviewed against P0 §18's Composite-tier discipline) — never to build a page-local variant. This is the literal mechanism behind P0 Enterprise Rule #9 ("no new visual pattern is invented inside a Feature-tier component").

Three tiers, carried from `ADR-021` / P0 §18, apply to every section below:
- **Shell** — the one persistent frame every authenticated screen lives inside (§1).
- **Layout** — the reusable skeleton a page's content is poured into (§2, = P0's seven Page Templates, elaborated).
- **Composite** — the reusable pieces (cards, nav elements, form patterns, table patterns, dialogs, feedback states, charts) that populate a Layout (§3–§9).
- **Theme Layer** — the token substrate every Shell/Layout/Composite consumes, never bypasses (§10).

---

## 1. Application Shell

The Shell is singular — there is one Super Admin Shell instance and one Builder Portal Shell instance, each assembled from the same seven regions below. No page ever redefines or re-skins a Shell region; a page only ever populates the Content Area.

### 1.1 Header
- **Purpose:** Persistent global orientation strip — identity, current context, and universal actions, visible from every authenticated screen.
- **When to use:** Always present, exactly once, pinned to the viewport top.
- **When NOT to use:** Never duplicated inside a page; never scrolls away; never carries page-specific actions (those belong in the Page Toolbar, §1.5).
- **Visual hierarchy:** Logo/product mark (left) → Workspace Switcher (§1.3, left-center) → global search / command-palette trigger (center, low visual weight until focused) → notifications, help, profile menu (right, icon-only, equal weight, lowest visual weight in the Header).
- **Spacing rules:** Fixed height per P0 `space` scale (a single constant across both portals); internal horizontal padding at `space.6`; icon cluster gap at `space.4`.
- **Responsive behaviour:** Desktop shows full Workspace Switcher label + search field; tablet collapses search to an icon that expands on tap; phone collapses to logo + profile + a menu icon only, with switcher/search relocated behind it.
- **Accessibility:** Full keyboard reachability in tab order before Sidebar; visible focus ring on every icon button; search/command-palette trigger has a discoverable keyboard shortcut hint.
- **White-label compatibility:** Logo slot is the only branded element (P0 §25); Header background/text uses neutral tokens, never the accent color as a fill — an accent-colored header is exactly the kind of "loud" treatment P0 §3 rejects.

### 1.2 Sidebar
- **Purpose:** Primary, persistent top-level navigation for the current portal.
- **When to use:** Always present on authenticated screens at desktop/tablet width; the sole source of top-level section switching (P0 §10's two-tier rule).
- **When NOT to use:** Never used for record-level or in-page navigation (that's Secondary Navigation, §4.4, or in-page tabs); never nests a third menu level.
- **Visual hierarchy:** Icon + label per top-level item; the active item is the only place accent color is used inside the Sidebar (per P0's one-accent-per-screen rule extended to persistent chrome); grouped items use Collapsible Groups (§4.2), never unlabeled visual gaps alone.
- **Spacing rules:** Item height and internal padding on the 8pt scale (`space.3` vertical, `space.4` horizontal); group-to-group separation at `space.6`.
- **Responsive behaviour:** Desktop — full width with labels, user-collapsible to icon-only per P0 §10; tablet — collapsed to icon-only by default, expandable on hover/pin; phone — hidden behind a Header menu icon, presented as a full-screen overlay when opened, never an awkward squeezed rail.
- **Accessibility:** Landmark-role navigation region; current item exposed via an accessible "current page" state, not color alone; fully operable via arrow-key/tab navigation.
- **White-label compatibility:** Structure and icon set are fixed platform-wide; only the active-item accent color is brand-driven.

### 1.3 Workspace Switcher
- **Purpose:** Make the current organizational context (Organization in Super Admin; active company/Project scope in Builder Portal) unmistakable and quickly changeable.
- **When to use:** Always visible in the Header for any authenticated user whose account can access more than one context; still present (but static/non-interactive) for single-context accounts, so its position never shifts.
- **When NOT to use:** Never used to switch between unrelated top-level sections (that's the Sidebar's job) — this switches *scope*, not *destination*.
- **Visual hierarchy:** Current context name is the loudest element in the control; a chevron affordance signals it opens a list; the list itself is a Composite dropdown (elevation level 3, P0 §8), not a full navigation change.
- **Spacing rules:** Matches Header's internal rhythm (`space.4` internal padding); dropdown list rows use the same row height as Sidebar items for visual family resemblance.
- **Responsive behaviour:** Desktop/tablet — inline in Header; phone — becomes the first item inside the Header's collapsed menu overlay, never squeezed into the visible bar.
- **Accessibility:** Implemented as an accessible listbox/combobox pattern; keyboard-typeable filtering for accounts with many contexts (relevant for Super Admin operators across many Organizations).
- **White-label compatibility:** Presentation is platform-neutral; per-context branding (if ever surfaced here, e.g. a small builder logo next to its name in the list) is additive only, never replacing the platform's own Header identity.

### 1.4 Breadcrumb
- **Purpose:** Show the full ancestor path for any nested record and make every ancestor level a one-click jump (P0 §10, "context never gets lost").
- **When to use:** Every Detail-template and Master/Detail-template page (§2.7, §2.8), and any page reached by drilling more than one level deep.
- **When NOT to use:** Never shown on top-level list pages that have no ancestor (e.g. the Projects list itself) or on Dashboard/Analytics/Settings templates, which are not nested.
- **Visual hierarchy:** Lowest visual weight of any Content Area chrome — small text, subdued color — deliberately quiet since it's a wayfinding aid, not primary content; the current (final, non-clickable) segment is visually distinct (not a link) from its clickable ancestors.
- **Spacing rules:** Sits directly above the Page Toolbar with a tight `space.2` gap to it (they read as one header block), `space.8` below before Content Area begins.
- **Responsive behaviour:** Desktop — full path shown; tablet — full path shown, wraps if needed; phone — collapses to "← Parent name" (one level back) plus a tap-to-expand affordance for the full path, never truncated with no way to see the rest.
- **Accessibility:** Marked up as an accessible breadcrumb landmark with ordered links; current page marked `aria-current`.
- **White-label compatibility:** Fully neutral — no brand-specific styling ever applies here.

### 1.5 Page Toolbar
- **Purpose:** Page-specific header: title, status/metadata, and the page's own actions (primary + secondary) — the transition zone between global Shell and page Content.
- **When to use:** Every page, every Layout template (§2) — the one required piece of chrome besides Header/Sidebar.
- **When NOT to use:** Never carries global actions (notifications, profile) — those stay in the Header, keeping a hard boundary between "global" and "this page."
- **Visual hierarchy:** Page title (`text.heading.page`) is dominant; exactly one primary action button (P0 Enterprise Rule #1); secondary actions are visually subordinate (outlined/ghost buttons or an overflow menu once more than 2 secondary actions exist).
- **Spacing rules:** `space.8` below separating it from Content Area, consistent with P0 §5's "major section" gap; primary and secondary actions cluster with `space.3` between them.
- **Responsive behaviour:** Desktop — title left, actions right, single row; tablet — same, actions may wrap to a second row if 3+; phone — title on its own row, primary action full-width or as a Header-adjacent floating action, secondary actions collapse into an overflow menu.
- **Accessibility:** Title is a real heading element at the correct semantic level (page `h1` equivalent); primary action is reachable early in tab order.
- **White-label compatibility:** Structure fixed; primary action button uses the brand accent color per P0 §7/§25.

### 1.6 Content Area
- **Purpose:** The one region that changes per page — hosts exactly one Layout template (§2) at a time.
- **When to use:** Always, directly below Breadcrumb + Page Toolbar.
- **When NOT to use:** Never hosts its own competing navigation or duplicate Shell chrome.
- **Visual hierarchy:** Entirely determined by whichever Layout template is placed inside it — the Content Area itself carries no independent visual weight (background matches page-level neutral, `elevation.0`).
- **Spacing rules:** Outer padding at `space.6`–`space.8` depending on portal density preference (Builder Portal comfortable, Super Admin compact — P0 §16); inner rhythm is owned by the Layout template.
- **Responsive behaviour:** Its max-width and padding scale down per P0 §17's three tiers; never introduces its own breakpoint logic independent of the Layout inside it.
- **Accessibility:** Marked as the main landmark region; receives programmatic focus on route change so screen-reader/keyboard users land at new page content, not at a stale Header focus point.
- **White-label compatibility:** Fully neutral background/container; all brand expression happens inside the Composites it hosts, never at this container level.

### 1.7 Footer
- **Purpose:** Minimal, low-emphasis platform information (version, support link, copyright) — not a navigation surface.
- **When to use:** Present but deliberately unobtrusive on all authenticated screens; may be omitted entirely on dense operational screens (Super Admin tables, Builder Portal workspace pages) where vertical space is at a premium — an explicit exception, not an oversight.
- **When NOT to use:** Never carries navigation links that duplicate the Sidebar; never competes visually with Content Area.
- **Visual hierarchy:** Smallest text size in the system (`text.caption` or smaller), lowest-contrast neutral color permitted by accessibility floors.
- **Spacing rules:** `space.6` padding, sits at natural document end (not fixed/sticky) so it never steals space from data-dense screens.
- **Responsive behaviour:** Same treatment at all breakpoints; on phone it may be omitted by default given limited vertical space.
- **Accessibility:** Marked as a contentinfo landmark when present.
- **White-label compatibility:** Platform-owned only — never carries an organization's own branding, since it represents the platform vendor, not the tenant.

---

## 2. Layout System

Every page selects exactly one of these eight Layouts (P0 §23's seven Page Templates, plus Analytics split out as its own distinct layout here since its chart-and-KPI arrangement rules differ enough from Dashboard's triage focus to warrant a separate entry).

### 2.1 Page (base layout)
- **Purpose:** The minimal skeleton every other Layout extends — Breadcrumb (optional) + Page Toolbar + single Content region.
- **When to use:** As the structural parent of every other Layout in this section; occasionally standalone for genuinely simple single-panel screens (e.g. a static informational page).
- **When NOT to use:** Never used directly for list, form, or dashboard content — those always select their own more specific Layout below.
- **Visual hierarchy:** Defined entirely by whatever Composite fills its Content region.
- **Spacing rules:** Establishes the outer page padding and header-to-content gap (§1.5, §1.6) inherited by all other Layouts.
- **Responsive behaviour:** Defines the base breakpoint container widths every other Layout inherits.
- **Accessibility:** Establishes the landmark structure (header/main) every other Layout inherits.
- **White-label compatibility:** Fully neutral — the base layout carries no brand expression itself.

### 2.2 Dashboard
- **Purpose:** Triage-first landing page per P0 §11 — KPI strip, attention zone, activity zone, quick actions.
- **When to use:** Portal home pages (Super Admin overview, Builder Portal overview) and any per-Project or per-Organization "home" summary.
- **When NOT to use:** Never for a screen whose job is deep analysis over time (that's Analytics, §2.5) — Dashboard answers "what needs attention now," Analytics answers "what happened over time."
- **Visual hierarchy:** Strict top-to-bottom order fixed by P0 §11 (context header → KPI strip → attention zone → activity/portfolio zone → quick actions) — this order is never rearranged per-page.
- **Spacing rules:** `space.8` between each of the five zones; `space.5` internal padding within each zone's cards.
- **Responsive behaviour:** Desktop — KPI strip in a single row (3–5 tiles), two-column activity zone; tablet — KPI strip may wrap to two rows, activity zone single-column; phone — every zone stacks single-column, KPI tiles become a horizontally swipeable strip rather than wrapping awkwardly.
- **Accessibility:** Each zone is a labeled region so screen-reader users can jump between KPI/attention/activity sections directly.
- **White-label compatibility:** Zone structure fixed; only accent-colored elements within (trend indicators' positive-direction color remains semantic §P0 §7, not brand-driven).

### 2.3 Wizard
- **Purpose:** Guided, strictly-ordered multi-step creation flow per P0 §14.
- **When to use:** Only when steps have genuine sequential dependency (e.g. Project creation before Unit assignment).
- **When NOT to use:** Never for a flow whose steps could be completed in any order — that indicates a Form/CRUD layout with grouped sections instead (P0 §14's explicit anti-pattern warning).
- **Visual hierarchy:** Persistent stepper is the dominant navigational element; step content area below it carries normal Form-layout hierarchy; the final step is always visually distinguished as a Review step (P0 §14).
- **Spacing rules:** Stepper sits directly under Page Toolbar at `space.6`; step content inherits Form Section Card spacing (§5.3).
- **Responsive behaviour:** Desktop/tablet — full horizontal stepper with step labels; phone — stepper collapses to a compact "Step 3 of 8" indicator with a progress bar, while the step-jump capability moves into a tap-to-expand step list.
- **Accessibility:** Stepper exposes current/completed/upcoming step state programmatically, not by color alone; each step is a distinct, announced region on advance.
- **White-label compatibility:** Structure fixed; active-step indicator uses brand accent.

### 2.4 CRUD
- **Purpose:** The general list ⇄ create/edit ⇄ detail loop that makes up the majority of both portals' screens (Projects, Buildings, Units, Owners, Documents).
- **When to use:** Any entity with a standard create/read/update/(archive or delete) lifecycle and no special sequential-step or analysis requirement.
- **When NOT to use:** Never for genuinely sequential creation (use Wizard) or for read-only analysis (use Analytics).
- **Visual hierarchy:** Composed from List/Table Layout (implicit combination of Page + Table composites, §6) transitioning to Form Layout (§2.4's create/edit state) or Detail Layout (§2.7) on row selection — the three states share identical Page Toolbar and Breadcrumb treatment so the transition feels like one continuous surface, not three different apps.
- **Spacing rules:** Inherits Table (§6) and Form (§5) spacing rules directly — CRUD introduces no spacing rules of its own.
- **Responsive behaviour:** Follows Table's and Form's responsive rules independently per state.
- **Accessibility:** Route changes between list/create/detail states move focus and announce the new page title, consistent with §1.6.
- **White-label compatibility:** Inherits Table/Form compatibility rules directly.

### 2.5 Analytics
- **Purpose:** Deeper, time-oriented, comparative data exploration — portfolio performance, financial trends, construction progress over time.
- **When to use:** Reporting-oriented screens where the primary content is charts (§9) with supporting KPI context, intended for review rather than same-session action.
- **When NOT to use:** Never as a substitute for Dashboard's daily-triage job — Analytics screens are visited deliberately and periodically, not glanced at every login.
- **Visual hierarchy:** A filter/date-range control bar (top, secondary in weight to Page Toolbar) governs the entire page; charts are the dominant visual element; supporting KPIs are smaller and positioned as chart annotations/legends, not a competing KPI strip.
- **Spacing rules:** Chart cards use the largest internal padding in the system (`space.6`) to give dense visualizations breathing room; `space.8` between chart groups.
- **Responsive behaviour:** Desktop — multi-chart grid (2–3 columns); tablet — single or two-column; phone — charts stack fully, and any chart too dense to read at phone width (e.g. a wide time-series with many series) shows a simplified/aggregated variant rather than a horizontally-scrolled miniature.
- **Accessibility:** Every chart (§9) ships a data-table fallback view (toggleable) so chart content is never available only visually.
- **White-label compatibility:** Chart categorical palette is a fixed, accessibility-validated set (not the single brand accent, since charts need multiple distinguishable series) — see §9's governing rule.

### 2.6 Settings
- **Purpose:** Configuration screens per P0 §16 — organization management, builder onboarding, feature flags, personal/account preferences.
- **When to use:** Any low-frequency, higher-consequence configuration screen.
- **When NOT to use:** Never for high-frequency operational data entry (that's CRUD) — Settings deliberately runs at a slower visual pace.
- **Visual hierarchy:** Left-hand or top-tab sub-navigation between settings groups (a Secondary Navigation instance, §4.4) + grouped Section Cards (§5.3) per group, each with its own explicit Save/Discard state — more generously spaced than CRUD forms per P0 §16.
- **Spacing rules:** `space.6` between settings groups' Section Cards (one step up from Form's `space.5`, deliberately slower pace).
- **Responsive behaviour:** Desktop — side sub-navigation + content two-column; tablet — sub-navigation becomes a top tab strip; phone — sub-navigation becomes a stacked accordion-style list, one group open at a time.
- **Accessibility:** Each settings group is a labeled region; unsaved-changes state is announced, not just visually indicated, before navigation away.
- **White-label compatibility:** The Settings layout is itself where white-label configuration (§10, logo/accent upload) lives for Builder-tier admins — this layout must therefore render correctly under a not-yet-saved, in-progress brand preview.

### 2.7 Detail
- **Purpose:** Single-record deep view — entity header, key metadata, tabbed sub-sections (P0 §23).
- **When to use:** Any record with enough related sub-data to warrant tabs (a Project's Overview/Buildings/Units/Documents; a Handover's stage/document/inspection views).
- **When NOT to use:** Never for a record simple enough to show everything in one un-tabbed view — forcing tabs onto a 4-field record is unnecessary structure.
- **Visual hierarchy:** Entity header block (name, status badge, key metadata, primary/secondary actions) is visually heaviest; tabs sit directly below at a clear, distinct band; each tab's content reuses List/Table or Form patterns as appropriate, never inventing new patterns per tab.
- **Spacing rules:** Entity header internal padding `space.6`; `space.5` gap from header to tab strip; tab content inherits whichever composite it hosts.
- **Responsive behaviour:** Desktop — tabs as a horizontal strip; tablet — same, condensed labels/icons-only if many tabs; phone — tabs become a dropdown/select-style switcher rather than a horizontally scrolling strip, to avoid ambiguous partial-tab-visible states.
- **Accessibility:** Tabs implement the standard accessible tab pattern (roving tabindex, `aria-selected`); entity header status is never conveyed by color alone.
- **White-label compatibility:** Entity header's primary action uses brand accent; status badge remains semantic-only (P0 §7's non-overridable rule).

### 2.8 Master/Detail
- **Purpose:** Side-by-side list-and-preview pattern for high-frequency scanning workflows (e.g. reviewing many Documents' approval status, or triaging many pending Handovers) without a full page navigation per item.
- **When to use:** Only when a user's real workflow is "scan many, act on several in sequence" — the master list and the detail preview are both needed simultaneously.
- **When NOT to use:** Never as a default replacement for Detail (§2.7) — most single-record deep dives (e.g. a Project's full detail) have too much content for a side panel and belong in Detail instead. Master/Detail is reserved for genuinely lightweight per-item review.
- **Visual hierarchy:** Master list (left, narrower, uses Table/List row patterns at compact density) is the primary scanning surface; Detail panel (right, wider) shows the selected item using the same header/section conventions as §2.7 but scoped smaller.
- **Spacing rules:** A single `space.px`-scale vertical divider (not a heavy border) separates the two panes; each pane keeps its own internal rhythm consistent with Table/Detail rules respectively.
- **Responsive behaviour:** Desktop/large-tablet only — this pattern requires width. Below that breakpoint it degrades explicitly to a standard List → Detail navigation flow (select a row, navigate to a full Detail page) rather than attempting a cramped stacked version.
- **Accessibility:** Selecting a master row updates the Detail pane and moves/announces focus into it for screen-reader users, without a full page navigation event.
- **White-label compatibility:** Inherits Table and Detail compatibility rules.

---

## 3. Card System

Cards are the primary content-grouping Composite across every Layout. All eight share a base shape (elevation level 1 at rest, per P0 §8; radius from the Theme Layer, §10.2) and differ only in internal content structure and purpose.

### 3.1 Metric Card
- **Purpose:** Display one KPI — a number, its trend, and its label — the atomic unit of a Dashboard's KPI strip (§2.2).
- **When to use:** Any single-number-plus-trend fact worth surfacing at a glance.
- **When NOT to use:** Never for a value with no meaningful trend/comparison — a static, non-comparative number is better as plain text in a header, not a Metric Card, to avoid KPI-strip inflation (P0 §11's "earns its place" rule).
- **Visual hierarchy:** Number is dominant (`text.display`-adjacent weight at card scale), trend indicator (icon + percentage, semantic color) is secondary, label is smallest (`text.label.field`).
- **Spacing rules:** `space.5` internal padding; number-to-trend gap `space.2`; label sits above the number at `space.1` gap (tight, reads as one grouped unit).
- **Responsive behaviour:** Fixed minimum width on desktop/tablet grid; on phone, cards become a horizontally swipeable strip (§2.2) rather than shrinking illegibly.
- **Accessibility:** Trend direction is conveyed with both an icon (up/down) and semantic color, plus a text-readable percentage — never color/arrow alone.
- **White-label compatibility:** Card surface neutral; trend colors are semantic (success/danger), never brand-driven.

### 3.2 Insight Card
- **Purpose:** Surface a short, system-generated observation or recommendation (e.g. "3 units have been vacant 30+ days") that combines a fact with light interpretation.
- **When to use:** Dashboard or Analytics contexts where a plain metric isn't enough context to act on.
- **When NOT to use:** Never for raw data with no interpretive value-add — that's just a Metric Card or table row.
- **Visual hierarchy:** A small icon denoting insight type, one short headline sentence (the insight itself), an optional single follow-up action link — never a paragraph.
- **Spacing rules:** `space.4` internal padding (more compact than Metric Card, since content is textual not numeric-display).
- **Responsive behaviour:** Stacks full-width below KPI strip on all breakpoints; text wraps naturally, never truncated with ellipsis (an insight must remain fully readable).
- **Accessibility:** Insight text is real content (not an image/icon-only card); follow-up action is a real link/button, not a bare "click card" affordance.
- **White-label compatibility:** Neutral surface; icon uses informational semantic color, not brand accent.

### 3.3 Action Card
- **Purpose:** A single, clearly-scoped call-to-action presented as a card (distinct from a Quick Action Card's compact grid item, §3.8) — used when the action needs more explanatory context than a button alone provides.
- **When to use:** Onboarding-style prompts (e.g. "Complete your Organization profile") or a single prominent recommended next step.
- **When NOT to use:** Never used in quantity — more than one or two Action Cards on a page dilutes the "one primary action" rule (P0 Enterprise Rule #1); a page needing many actions should use Quick Action Cards (§3.8) instead.
- **Visual hierarchy:** Short headline, one supporting sentence, one button — button is the loudest element in the card, using the sole page accent.
- **Spacing rules:** `space.5` internal padding; `space.3` between headline/body/button.
- **Responsive behaviour:** Full-width on all breakpoints when used as a dismissible prompt banner-style card; never shrunk into a KPI-strip-sized tile.
- **Accessibility:** Dismissible Action Cards expose a labeled close control; the action button is real, keyboard-operable.
- **White-label compatibility:** Button uses brand accent; card surface neutral.

### 3.4 Timeline Card
- **Purpose:** Show a chronological sequence of events for one record (e.g. a Handover's stage history, an Audit Log excerpt on a Detail page).
- **When to use:** Any Detail-template page needing an at-a-glance activity/history view, and Stage-Tracker layouts' historical section (P0 §14/§23).
- **When NOT to use:** Never for more than roughly 5–7 visible events without pagination/expansion — a Timeline Card is a summary, not a full audit log browser (that's a Table, §6).
- **Visual hierarchy:** Vertical connector line with one node per event; each node shows a small icon (entity-consistent per P0 §9), a one-line description, and a timestamp in `text.caption`/tabular figures.
- **Spacing rules:** `space.4` between nodes; node icon-to-text gap `space.3`.
- **Responsive behaviour:** Identical layout at all breakpoints (a vertical timeline degrades gracefully to narrow widths without structural change) — one of the few Composites with no breakpoint-specific rearrangement.
- **Accessibility:** Marked up as an ordered list semantically; timestamps use a real, unambiguous absolute-time format available on focus/hover even if relative time ("2 hours ago") is shown by default.
- **White-label compatibility:** Neutral except entity icons (fixed platform-wide per P0 §9).

### 3.5 Warning Card
- **Purpose:** Surface a specific, named risk or required attention item (e.g. "Document approval overdue by 4 days") distinct from a generic error.
- **When to use:** Attention zones (Dashboard, §2.2) and Detail pages where a specific condition needs flagging before the user proceeds.
- **When NOT to use:** Never for a system/technical error (that's an Error feedback state, §8.5) — Warning Cards communicate a *business* condition, not a *system failure*.
- **Visual hierarchy:** Warning-semantic color used only as a left accent bar or icon tint (never a full-card color fill, which would be too loud per P0 §3); headline names the specific condition; optional resolving action.
- **Spacing rules:** `space.4` internal padding; icon-to-text gap `space.3`.
- **Responsive behaviour:** Full-width stacking on all breakpoints; text never truncated.
- **Accessibility:** Warning icon always paired with the word "Warning" or equivalent in accessible text, not conveyed by color/icon alone.
- **White-label compatibility:** Warning color is semantic and non-overridable (P0 §7/§25).

### 3.6 Status Card
- **Purpose:** Summarize a record's or process's current state and the small set of facts that explain it (e.g. a Handover's overall stage status, a Document's approval state) — more structured than a Warning Card, used regardless of whether the state is good or bad.
- **When to use:** Detail-page headers and Stage-Tracker summary regions.
- **When NOT to use:** Never for a simple list-row status — that's a Status Chip (§6.6), a much smaller unit; Status Card is for a dedicated summary block.
- **Visual hierarchy:** A prominent Status Chip (§6.6) at the top, 2–4 key supporting facts below in a compact label/value grid, optional single action.
- **Spacing rules:** `space.5` internal padding; supporting facts use `space.4` row gaps in a compact grid.
- **Responsive behaviour:** Desktop — facts may lay out 2-column within the card; phone — facts stack single-column.
- **Accessibility:** Status Chip's semantic color always paired with text label (inherits §6.6's rule).
- **White-label compatibility:** Neutral surface; status color semantic only.

### 3.7 Progress Card
- **Purpose:** Show completion/progress toward a defined multi-step or multi-item goal (e.g. inspection checklist completion %, handover pipeline overall progress).
- **When to use:** Any place a single "how far along is this" fact needs its own visual weight beyond a plain percentage number.
- **When NOT to use:** Never for a binary done/not-done state — that's a Status Chip, not a progress visualization.
- **Visual hierarchy:** A progress bar/ring as the dominant element, percentage or "X of Y" as supporting text, label beneath.
- **Spacing rules:** `space.4` internal padding; progress-indicator-to-label gap `space.2`.
- **Responsive behaviour:** Identical at all breakpoints — progress indicators are inherently scale-flexible.
- **Accessibility:** Progress value exposed as a real accessible progress-role value (percentage announced), not conveyed by bar width alone.
- **White-label compatibility:** Progress-fill color may use brand accent when representing a neutral "in-progress" concept, but must switch to semantic danger/warning color if the progress represents something overdue/at-risk (§P0 §7's status-takes-precedence rule).

### 3.8 Quick Action Card
- **Purpose:** One item in a small, fixed grid of common shortcuts (P0 §11's Quick Actions zone) — icon + short label, nothing more.
- **When to use:** Dashboard quick-actions zone only; a bounded set of 3–4 items.
- **When NOT to use:** Never expanded into a dumping ground for every possible action (P0 §11's explicit rule) — if a sixth "quick action" seems needed, that's a sign the Sidebar/navigation is missing an entry point, not that this grid should grow.
- **Visual hierarchy:** Icon (entity-consistent, §P0 §9) above or beside a short label; entire card is the click target; no secondary text.
- **Spacing rules:** `space.4` internal padding; grid gap between cards `space.4`.
- **Responsive behaviour:** Desktop — row of 3–4; tablet — may wrap to 2×2; phone — stacks as a compact 2-column grid, never single-column (which would waste the "quick" framing by pushing them below the fold).
- **Accessibility:** Whole card is a single accessible button/link with a clear label, not an icon-only unlabeled target.
- **White-label compatibility:** Icon fixed; hover/active state may use brand accent at low opacity.

---

## 4. Navigation Components

Beyond the Shell's persistent Sidebar (§1.2), five navigation behaviors recur across pages and are specified once here for reuse.

### 4.1 Sidebar (behavioral extension of §1.2)
- **Purpose:** Documents Sidebar-specific interaction behaviors (expand/collapse, pin, active-state propagation) not already covered under Shell.
- **When to use:** N/A — behavior spec only, always active wherever §1.2 is present.
- **When NOT to use:** N/A.
- **Visual hierarchy:** Active-state highlight must propagate to a parent group when a child route is active, so a collapsed group never hides the fact that one of its children is the current page.
- **Spacing rules:** Inherits §1.2.
- **Responsive behaviour:** Inherits §1.2; additionally, the user's manual collapse/expand and pin preference persists per-session, not reset on navigation.
- **Accessibility:** Expand/collapse state is announced; pinned state is a real toggle with a labeled control, not an ambiguous icon-only gesture.
- **White-label compatibility:** Inherits §1.2.

### 4.2 Collapsible Groups
- **Purpose:** Organize related Sidebar or Settings sub-navigation items under a named, expandable group header without introducing a third menu tier.
- **When to use:** When a Sidebar or Settings sub-navigation would otherwise exceed roughly 7 flat items — grouping restores scannability.
- **When NOT to use:** Never nested (a group inside a group) — that recreates the "too many menus" problem P0 exists to fix. One level of grouping, maximum.
- **Visual hierarchy:** Group header uses `text.label.field` styling with a chevron affordance; children indent slightly and use standard item styling.
- **Spacing rules:** `space.2` between group header and first child; `space.5` between distinct groups.
- **Responsive behaviour:** Identical collapse/expand behavior at all breakpoints; default expand/collapse state may differ (phone defaults more groups collapsed to reduce initial scroll length).
- **Accessibility:** Implemented as an accessible disclosure pattern (`aria-expanded`), keyboard-toggleable.
- **White-label compatibility:** Neutral; no brand-specific treatment.

### 4.3 Context Navigation
- **Purpose:** Navigation scoped to "within the current record's hierarchy" — e.g. jumping between sibling Units within the same Building without leaving the Building's context.
- **When to use:** Detail-template pages where sibling records are a common next step (P0 §15's drill-down model).
- **When NOT to use:** Never a replacement for Breadcrumb (ancestor navigation) or Sidebar (top-level navigation) — this is strictly sibling/lateral movement.
- **Visual hierarchy:** A compact prev/next or dropdown-style control near the entity header, visually subordinate to the Page Toolbar's primary action.
- **Spacing rules:** `space.3` gap from the entity header block.
- **Responsive behaviour:** Desktop/tablet — inline prev/next controls; phone — collapses to a single "Switch [Unit]" dropdown to save horizontal space.
- **Accessibility:** Prev/next controls are labeled with the target record's name (not bare arrow icons alone) for screen-reader clarity.
- **White-label compatibility:** Neutral.

### 4.4 Secondary Navigation
- **Purpose:** In-page tab or sub-section navigation within a single Detail or Settings page (P0 §10's "in-page tabs" tier).
- **When to use:** Detail template's tab strip (§2.7); Settings template's group sub-navigation (§2.6).
- **When NOT to use:** Never for top-level section switching (Sidebar's job) — Secondary Navigation never causes a Breadcrumb change, only a tab/section change within the same record.
- **Visual hierarchy:** Clearly subordinate to Page Toolbar in visual weight; active tab uses brand accent underline/indicator, inactive tabs neutral.
- **Spacing rules:** `space.5` gap above and below the tab strip.
- **Responsive behaviour:** Inherits Detail/Settings responsive rules (§2.7/§2.6) directly.
- **Accessibility:** Standard accessible tabs pattern (§2.7's rule restated here as the general case).
- **White-label compatibility:** Active-indicator uses brand accent; inactive state neutral.

### 4.5 Top Actions
- **Purpose:** The cluster of secondary, page-scoped actions living in the Page Toolbar (§1.5) alongside the one primary action.
- **When to use:** Any page needing 1–3 secondary actions (export, duplicate, print, share) beyond the single primary action.
- **When NOT to use:** Never grows past 3 visible actions — a 4th+ action moves into an overflow ("more") menu rather than crowding the toolbar, preserving the primary-action-dominance rule.
- **Visual hierarchy:** Outlined or ghost-button styling, distinctly quieter than the primary (filled) action; icon-only variants are allowed here if universally recognizable (e.g. print, export) and always carry a tooltip.
- **Spacing rules:** `space.3` between each Top Action; `space.4` gap to the primary action.
- **Responsive behaviour:** Desktop/tablet — inline; phone — collapses entirely into a single overflow menu icon, leaving only the primary action visible inline.
- **Accessibility:** Icon-only actions always have an accessible label beyond the visual tooltip.
- **White-label compatibility:** Neutral styling; never uses brand accent (reserved for the one primary action per screen).

---

## 5. Forms

### 5.1 Page Header (form context)
- **Purpose:** Establishes the form's identity — what record/action this form represents (specialization of §1.5 for Create/Edit states).
- **When to use:** Every Form/Wizard-step screen.
- **When NOT to use:** N/A — always present.
- **Visual hierarchy:** Title reflects Create vs Edit phrasing explicitly (§5.7); no ambiguity about which mode the user is in.
- **Spacing rules:** Inherits §1.5.
- **Responsive behaviour:** Inherits §1.5.
- **Accessibility:** Inherits §1.5; additionally the page title changes (and is announced) the moment Create transitions to a saved Edit state, so screen-reader users get positive save confirmation via the title itself, not only a toast.
- **White-label compatibility:** Inherits §1.5.

### 5.2 Sticky Actions
- **Purpose:** Keep Save/Cancel (and Save-and-exit for wizards, P0 §14) reachable regardless of scroll position on long forms.
- **When to use:** Any form whose content exceeds roughly one viewport height.
- **When NOT to use:** Never on short forms (under one viewport) — a sticky bar with nothing to scroll past is unnecessary chrome.
- **Visual hierarchy:** A distinct, elevated (`elevation.2`) bar pinned to viewport bottom (not top, to avoid competing with Page Toolbar); primary Save action retains its filled/dominant styling.
- **Spacing rules:** `space.4` internal padding; matches Page Toolbar's action spacing conventions (§4.5).
- **Responsive behaviour:** Full-width on phone with Save as the visually dominant full-width control; desktop/tablet keep it right-aligned within the content max-width.
- **Accessibility:** Does not obscure focused form fields when a keyboard user tabs to the bottom of the form (sufficient bottom padding reserved in the scroll area).
- **White-label compatibility:** Save button uses brand accent.

### 5.3 Section Cards
- **Purpose:** Group related fields under a named heading (P0 §12's grouping rule) — the atomic structural unit of every form.
- **When to use:** Always — no form field exists outside a Section Card.
- **When NOT to use:** A Section Card is never used for a single, unrelated field — if a field doesn't belong to a named group, the grouping itself needs rethinking, not an exception.
- **Visual hierarchy:** Section heading (`text.heading.section`) at the card top; fields follow in Grouped Fields pattern (§5.4); a section never exceeds 6 fields (P0 §12) before splitting into another Section Card.
- **Spacing rules:** `space.5` internal card padding; `space.6` between consecutive Section Cards.
- **Responsive behaviour:** Identical structural rules at all breakpoints; only the Grouped Fields column count (§5.4) changes.
- **Accessibility:** Section heading is a real heading element enabling screen-reader section-jumping (`fieldset`/`legend` semantics where applicable).
- **White-label compatibility:** Neutral surface and heading styling.

### 5.4 Grouped Fields
- **Purpose:** The field-layout rule within a Section Card — single column by default, paired short fields only where genuinely related (P0 §12).
- **When to use:** Every field in every form.
- **When NOT to use:** Multi-column layout is never used for unrelated fields purely to save vertical space (P0 §12's named anti-pattern).
- **Visual hierarchy:** Label above field always (never inline-left labels); required-field indication is a small, consistent marker next to the label, never color-only.
- **Spacing rules:** `space.4` label-to-field gap; `space.5` between distinct field groups within a section.
- **Responsive behaviour:** Desktop — paired fields (e.g. City/State) may sit side by side; tablet — same, if width allows; phone — every field forces single-column regardless of pairing.
- **Accessibility:** Every field has a programmatically associated label (not placeholder-as-label); helper/error text is associated via `aria-describedby`.
- **White-label compatibility:** Neutral; focus-ring color uses brand accent.

### 5.5 Validation Pattern
- **Purpose:** Consistent inline, on-blur validation feedback (P0 §12, §20).
- **When to use:** Every required or format-constrained field.
- **When NOT to use:** Never a page-top banner listing every error as the primary error-communication method (P0 §12's explicit rejection) — a summary banner may *additionally* appear on submit-attempt-with-errors to direct focus, but never replaces inline messaging.
- **Visual hierarchy:** Error state uses danger-semantic color on the field border/icon plus specific inline text below the field; success/valid state is quiet (a subtle checkmark at most), never as loud as the error state.
- **Spacing rules:** `space.1` gap between field and its helper/error text.
- **Responsive behaviour:** Identical at all breakpoints.
- **Accessibility:** Error state is announced to assistive technology at the moment of validation, not only shown visually; on submit with errors, focus moves to the first invalid field.
- **White-label compatibility:** Error/success colors are semantic and non-overridable.

### 5.6 Readonly Pattern
- **Purpose:** Present a field or section as view-only (e.g. system-computed values, fields locked post-approval) without it looking like a broken/disabled input.
- **When to use:** Any value the current user cannot edit but needs to see in its normal field position (preserves layout consistency between editable and locked states of the same form).
- **When NOT to use:** Never uses the same visual treatment as a temporarily-disabled-pending-another-field input — disabled (temporary) and readonly (permanent-for-this-context) must look distinguishably different so users don't assume a readonly field will "unlock."
- **Visual hierarchy:** No input chrome (border/shadow) — presented closer to plain text with a subtle background tint to indicate "this is still a field," label styling unchanged.
- **Spacing rules:** Identical to Grouped Fields (§5.4) — a readonly field must not shift the form's rhythm when toggled from editable.
- **Responsive behaviour:** Identical at all breakpoints.
- **Accessibility:** Exposed with a real readonly/disabled-appropriate ARIA state, distinguishable from an interactive field to assistive technology.
- **White-label compatibility:** Neutral.

### 5.7 Create vs Edit Pattern
- **Purpose:** Ensure a single form definition serves both creation and editing without divergent behavior or confusing copy (P0 §12).
- **When to use:** Every entity with both create and edit capability (nearly every entity in the platform).
- **When NOT to use:** Never maintained as two separately-designed forms — Create and Edit are the same Section Card/Grouped Field structure with different Page Header copy (§5.1), different initial field state (empty vs. pre-filled), and — where relevant — a reduced field set for Create (e.g. a Draft can be created with only required fields, non-essential fields appear once editing).
- **Visual hierarchy:** Identical between the two modes except Page Header title/action label ("Create Project" vs. "Edit Project") and Sticky Actions label ("Create" vs. "Save changes").
- **Spacing rules:** Identical between modes — this is precisely what prevents the layout "jump" a user would otherwise notice moving from create to edit.
- **Responsive behaviour:** Identical between modes.
- **Accessibility:** Mode is reflected in the page title/heading (§5.1) so it's identifiable without relying on visual memory of which button was clicked.
- **White-label compatibility:** Identical between modes.

---

## 6. Tables

### 6.1 Toolbar
- **Purpose:** The table's own action/search/density controls, sitting between Page Toolbar and the table itself.
- **When to use:** Every table with more than a trivial, unfiltered row count.
- **When NOT to use:** Omitted only for a genuinely small, static, unfilterable list (rare) — default assumption is every table gets one.
- **Visual hierarchy:** Search field (left or leading position), Filters trigger (§6.2) adjacent, density/column-visibility controls trailing right — all visually subordinate to the Page Toolbar above it.
- **Spacing rules:** `space.4` internal padding; `space.3` between individual controls.
- **Responsive behaviour:** Desktop — full row of controls; tablet — same, may wrap; phone — search remains visible, remaining controls collapse into a single filter/settings icon.
- **Accessibility:** Search field has a persistent visible label (not placeholder-only); all icon-only controls carry accessible labels.
- **White-label compatibility:** Neutral.

### 6.2 Filters
- **Purpose:** Narrow table rows by field-based criteria, persistently visible per P0 §13 (never hidden behind a settings page).
- **When to use:** Any table with more than one meaningfully filterable dimension (status, date range, entity type).
- **When NOT to use:** Never presented as a full-page or full-modal experience for simple 1–2 criteria filtering — that belongs in the Toolbar directly; a dedicated Filter Drawer (extension of §7.6) is reserved for genuinely complex, many-criteria filtering.
- **Visual hierarchy:** Active filters are shown as removable chips directly below/beside the Toolbar, so current filter state is always visible, never just "set and forgotten" in a closed panel.
- **Spacing rules:** `space.2` between filter chips; `space.3` gap from Toolbar above.
- **Responsive behaviour:** Desktop/tablet — chips flow inline; phone — chips wrap to their own row beneath the collapsed filter icon.
- **Accessibility:** Each filter chip has a labeled remove control; filter changes announce the resulting row count.
- **White-label compatibility:** Neutral; active-filter chip may use a low-opacity brand accent tint.

### 6.3 Bulk Actions
- **Purpose:** Contextual action bar appearing only when ≥1 row is selected (P0 §13).
- **When to use:** Any table supporting multi-row operations (archive, export, reassign).
- **When NOT to use:** Never a persistent floating toolbar visible with zero rows selected — its appearance is itself the signal that a selection is active.
- **Visual hierarchy:** Replaces or overlays the Toolbar's position (never a separate floating element that obscures table rows); shows selection count prominently, actions as a compact button group, a clear "Clear selection" affordance.
- **Spacing rules:** Matches Toolbar's padding/height so the transition feels like a state change, not a layout shift.
- **Responsive behaviour:** Desktop/tablet — inline bar; phone — condenses to selection count + a single overflow action menu.
- **Accessibility:** Selection count change is announced; bulk actions are reachable via keyboard immediately after selecting rows.
- **White-label compatibility:** Neutral; primary bulk action (if one is dominant) may use brand accent.

### 6.4 Row Actions
- **Purpose:** Per-row secondary actions (edit, archive, view) distinct from the row's primary click-to-open-detail behavior (P0 §13).
- **When to use:** Any row needing more than the default "click opens detail" behavior.
- **When NOT to use:** Never more than one icon-button + one overflow ("more") menu per row — a row with 5 visible action icons has failed the density/clarity balance.
- **Visual hierarchy:** Icon button(s) trailing the row, lowest visual weight in the row (rows are about data, not chrome).
- **Spacing rules:** `space.2` between row action icons; `space.4` from the last data column.
- **Responsive behaviour:** Desktop/tablet — icons visible on row hover or always-visible depending on density setting; phone (card-row conversion, P0 §17) — actions become a single trailing overflow icon on each card.
- **Accessibility:** Every icon action has an accessible label naming the specific row (e.g. "Edit Sunrise Towers," not just "Edit").
- **White-label compatibility:** Neutral.

### 6.5 Expandable Rows
- **Purpose:** Reveal additional detail for a row inline without full navigation to a Detail page — used when the extra detail is glance-only, not a full workflow.
- **When to use:** E.g. expanding a Handover row to preview its stage summary without leaving the list.
- **When NOT to use:** Never as a substitute for a real Detail page when the expanded content itself needs further actions/sub-navigation — that content belongs on a Detail page instead.
- **Visual hierarchy:** A chevron/expand affordance leading or trailing the row; expanded content is visually nested (subtle indent or background tint) so it's unambiguous which row it belongs to.
- **Spacing rules:** `space.4` internal padding for expanded content, consistent with Card internal padding since expanded content is effectively an inline card.
- **Responsive behaviour:** Identical behavior at all breakpoints, including the phone card-row conversion (expansion works the same way on a stacked card).
- **Accessibility:** Standard accessible disclosure pattern per row (`aria-expanded`).
- **White-label compatibility:** Neutral.

### 6.6 Status Chips
- **Purpose:** The single, consistent way any status is displayed anywhere in a table (P0 §7, §13) — tinted background, icon, label.
- **When to use:** Every status-bearing column in every table, and reused wherever a Status Card (§3.6) needs its headline chip.
- **When NOT to use:** Never a colored table row or colored raw text as a substitute (P0 §13's explicit rule).
- **Visual hierarchy:** Small pill shape, low-opacity semantic-color background, matching-color icon + label text — never a solid, high-saturation fill (too loud for repeated table use).
- **Spacing rules:** `space.1` icon-to-label gap internally; `space.2` horizontal padding within the pill.
- **Responsive behaviour:** Identical at all breakpoints, including inside phone's stacked card-row conversion.
- **Accessibility:** Icon + text label always paired (P0 §7's non-negotiable rule); sufficient contrast between tint and label text at the chosen opacity.
- **White-label compatibility:** Semantic colors only — entirely non-overridable regardless of white-label tier (P0 §25).

### 6.7 Pagination
- **Purpose:** Navigate large row sets without loading everything at once.
- **When to use:** Any table whose typical row count exceeds a single comfortable screen (a fixed page-size threshold, decided at implementation time).
- **When NOT to use:** Never combined with infinite-scroll on the same table (pick one paradigm per table to avoid inconsistent scroll-position/state-restoration behavior) — traditional numbered pagination is the platform default given its operators' "find a specific record" use pattern.
- **Visual hierarchy:** Page indicator + prev/next controls, row-count summary ("Showing 1–20 of 214"), page-size selector — all low visual weight, right-aligned or centered below the table.
- **Spacing rules:** `space.4` gap from the last table row.
- **Responsive behaviour:** Desktop/tablet — full control set visible; phone — condenses to prev/next + current page only, page-size selector moves into the Toolbar's overflow menu.
- **Accessibility:** Current page is announced; prev/next controls disable (not just visually gray out, but programmatically disable) at the first/last page.
- **White-label compatibility:** Neutral; current-page indicator may use brand accent.

### 6.8 Empty States (table-specific)
- **Purpose:** Apply P0 §19's three empty-state variants specifically within the table region, without collapsing the Toolbar/Filters chrome around it.
- **When to use:** Zero-data (true zero-state), zero-filtered-results, and scoped-empty (e.g. no Units under this Building yet) — all three within a table's body region.
- **When NOT to use:** Never a bare "No data" text string with no icon, headline, or action — that fails P0 §19's structure requirement.
- **Visual hierarchy:** Centered within the table's content area, replacing rows entirely (Toolbar/Filters/Pagination chrome remains visible and interactive so a user can immediately clear filters that caused a zero-result state).
- **Spacing rules:** `space.10` vertical rhythm (matches P0 §19's empty-state page-level rhythm) even though it's table-scoped, so it doesn't feel cramped inside a large content area.
- **Responsive behaviour:** Identical structure at all breakpoints, text/icon scale down modestly on phone.
- **Accessibility:** Announced as a live-region update when a filter change results in zero rows, so screen-reader users aren't left wondering if the table simply failed to load.
- **White-label compatibility:** Icon fixed platform-wide; action button (if present) uses brand accent.

---

## 7. Dialogs

### 7.1 Confirmation
- **Purpose:** Low-to-medium-consequence yes/no confirmation before an action proceeds.
- **When to use:** Reversible-but-not-trivial actions (e.g. "Discard unsaved changes?").
- **When NOT to use:** Never for genuinely trivial, instantly-reversible actions (that would create confirmation fatigue) and never for high-consequence destructive actions, which require the more specific Delete Dialog (§7.4) instead.
- **Visual hierarchy:** Short headline naming the action, one supporting sentence, two buttons (confirm as primary/filled, cancel as secondary) — confirm button is never styled as danger unless the action truly is destructive.
- **Spacing rules:** `space.6` dialog internal padding; `space.5` between headline/body/actions.
- **Responsive behaviour:** Desktop/tablet — centered modal at a constrained max-width; phone — full-width bottom sheet or full-width centered modal with the same content, actions stack full-width if needed.
- **Accessibility:** Focus moves into the dialog on open and returns to the triggering element on close; dialog is announced and trap-focused; `Esc` dismisses (mapped to Cancel).
- **White-label compatibility:** Confirm button uses brand accent unless the action is destructive (then danger-semantic, §7.4).

### 7.2 Wizard Dialog
- **Purpose:** A modal variant of the Wizard layout (§2.3) for shorter, lightweight multi-step flows that don't warrant a full page (e.g. a 2–3 step quick-create shortcut).
- **When to use:** Short (2–3 step), low-complexity sequential flows launched from within another page without full navigation away.
- **When NOT to use:** Never for anything approaching the complexity of a full Wizard layout (§2.3) — beyond roughly 3 steps or any step with substantial field count, use the full-page Wizard instead so Sticky Actions/save-and-exit are available.
- **Visual hierarchy:** Same stepper-at-top convention as §2.3, scaled to modal width.
- **Spacing rules:** Matches Confirmation Dialog's internal padding conventions, scaled for step content.
- **Responsive behaviour:** Desktop/tablet — centered modal; phone — this pattern is explicitly discouraged below tablet width per P0 §17 (complex creation flows redirect to full-page Wizard or a "please use a larger screen" notice rather than cramming a stepper into a phone-width modal).
- **Accessibility:** Same focus-trap/return rules as Confirmation; step changes are announced.
- **White-label compatibility:** Inherits §2.3.

### 7.3 Preview Dialog
- **Purpose:** Show a read-only preview of content (a document, a certificate, an image) without leaving the current page/context.
- **When to use:** Document Management previews, handover certificate preview (P0 §15).
- **When NOT to use:** Never includes editing controls — a Preview Dialog that needs editing should instead navigate to a full Detail/Form page.
- **Visual hierarchy:** Content fills the majority of the dialog; minimal chrome (a close control, and where relevant a download/print action) — the previewed content is the star, dialog chrome recedes.
- **Spacing rules:** Minimal internal padding around the preview content itself (`space.4`) to maximize preview area; standard `space.6` around any surrounding controls.
- **Responsive behaviour:** Desktop/tablet — large centered modal, near-fullscreen for document previews; phone — genuinely fullscreen (not a small modal) given limited viewport.
- **Accessibility:** Focus-trap rules as §7.1; previewed non-text content (images, certificates) has meaningful alt/label text.
- **White-label compatibility:** Neutral chrome; the previewed content itself may carry a builder's own branding (e.g. a certificate) — the dialog frame around it must not visually compete with that.

### 7.4 Delete Dialog
- **Purpose:** The specific, high-consequence confirmation for permanent or hard-to-reverse actions (P0 §20's named consequence rule).
- **When to use:** Delete, deactivate, or any action explicitly flagged as irreversible/high-blast-radius in its owning Feature spec.
- **When NOT to use:** Never for reversible actions (archive-with-restore, draft discard) — those use the plain Confirmation Dialog (§7.1) so danger-styling is reserved and stays meaningful.
- **Visual hierarchy:** Danger-semantic color on the confirm button and a warning icon in the header; headline and body **name the specific record and specific consequence** verbatim (P0 §20's example: "Archive Project 'Sunrise Towers'? Its 3 active buildings and 42 units will be archived with it.") — never generic phrasing.
- **Spacing rules:** Identical to Confirmation Dialog (§7.1).
- **Responsive behaviour:** Identical to Confirmation Dialog (§7.1).
- **Accessibility:** Same focus rules as §7.1; the danger button is never the dialog's initially-focused element (default focus lands on Cancel, so an accidental `Enter` keypress can't trigger a destructive action).
- **White-label compatibility:** Danger color entirely non-overridable (P0 §7/§25's strongest rule, restated here at the dialog level).

### 7.5 Approval Dialog
- **Purpose:** Capture an explicit approve/reject decision with optional reasoning (e.g. Handover approval, Document approval, Builder onboarding approval) — distinct from Confirmation because it often requires a reason on rejection.
- **When to use:** Any workflow-gating decision point across Super Admin or Builder Portal (P0 §15's handover approval, §16's builder onboarding).
- **When NOT to use:** Never for a simple accept-with-no-alternative-path action — if there's no meaningful reject/reason path, it's a Confirmation Dialog.
- **Visual hierarchy:** Two clearly distinct actions (Approve — brand/success-leaning primary; Reject — secondary styling that reveals a required reason field, per the existing Reject-with-reason pattern already used in the Handover flow); reason field appears only after Reject is chosen, keeping the default view uncluttered.
- **Spacing rules:** Matches Confirmation Dialog; reason field (when revealed) follows Grouped Fields spacing (§5.4).
- **Responsive behaviour:** Same as Confirmation/Delete Dialog responsive rules.
- **Accessibility:** Reason field is required and validated per §5.5 before Reject can be submitted; the reveal of the reason field is announced.
- **White-label compatibility:** Approve action may use brand accent or success-semantic color depending on context; Reject/reason chrome stays neutral.

### 7.6 Drawer Pattern
- **Purpose:** A side-anchored panel (rather than centered modal) for content that benefits from remaining contextually beside the triggering page — complex filter panels, quick-view of a record without full navigation, or a lightweight create form launched from a list.
- **When to use:** Complex multi-criteria Filters (extension of §6.2), or a "quick view" of a row's detail from a Table without full Master/Detail (§2.8) commitment.
- **When NOT to use:** Never for flows requiring the user's full attention away from the underlying page (those are Dialogs, §7.1–§7.5, which dim/block the background) — a Drawer keeps the triggering page visible and is inherently a lighter-weight interruption.
- **Visual hierarchy:** Slides in from the trailing (right, in LTR) edge; own header with a close control; content follows whichever pattern it hosts (Form Section Cards, a filter list, a Detail summary).
- **Spacing rules:** `space.6` internal padding; consistent with Dialog padding conventions.
- **Responsive behaviour:** Desktop/tablet — fixed-width panel over a dimmed but visible background; phone — becomes a full-width bottom sheet or fullscreen panel, same as Dialog's phone treatment.
- **Accessibility:** Same focus-trap and `Esc`-to-close rules as Dialogs; the underlying page remains in the DOM but is `aria-hidden` while the Drawer is open.
- **White-label compatibility:** Neutral chrome; content inside follows whatever Composite it hosts.

---

## 8. Feedback

### 8.1 Loading
- **Purpose:** Communicate an in-progress async operation per P0 §21's three-tier timing model.
- **When to use:** Any operation exceeding roughly 300ms.
- **When NOT to use:** Never for sub-300ms operations (P0 §21 — showing and immediately hiding a spinner reads as a flicker, worse than nothing).
- **Visual hierarchy:** Localized to the specific region affected (a button's own inline spinner, a table's overlay) — never a full-page blocker for a partial update.
- **Spacing rules:** No additional layout shift — loading indicators occupy the space their eventual content will occupy (ties directly to Skeleton, §8.2, for the >2s case).
- **Responsive behaviour:** Identical treatment at all breakpoints, scaled to the affected region's size.
- **Accessibility:** Loading regions carry a live-region "busy" state; a button mid-action is disabled and labeled as busy, not just visually spinning.
- **White-label compatibility:** Spinner uses neutral or brand-accent color (a subtle brand touch is acceptable here since it's a low-emphasis, transient element).

### 8.2 Skeleton
- **Purpose:** Shape-matching placeholder for operations exceeding roughly 2 seconds, or first full page load (P0 §22).
- **When to use:** Initial page/data load, and any Composite with a well-known final shape (table rows, cards, detail headers).
- **When NOT to use:** Never for the persistent Shell chrome (Header/Sidebar/Breadcrumb) — those populate instantly from known state, not from a data fetch (P0 §22's explicit rule).
- **Visual hierarchy:** Mirrors the real content's grid/card/text-line shape exactly, single shared shimmer/pulse animation platform-wide.
- **Spacing rules:** Identical spacing to the real content it replaces — this is the entire point of a skeleton, so no separate spacing rule exists.
- **Responsive behaviour:** Skeleton shape adapts to whatever breakpoint-specific layout the real content would use.
- **Accessibility:** Announced as "loading" to assistive technology; replaced content takes over the announcement once loaded rather than leaving a stale "loading" state.
- **White-label compatibility:** Neutral-only — skeletons never carry brand color, since they represent absence of content.

### 8.3 Empty
- **Purpose:** The general (non-table-specific) application of P0 §19's three empty-state variants — e.g. an empty Dashboard attention zone, an empty Timeline Card.
- **When to use:** Any Composite or Layout region that can legitimately have zero items.
- **When NOT to use:** Never conflated with an Error state (§8.5) — empty means "successfully loaded, genuinely nothing here," not "failed to load."
- **Visual hierarchy:** Inherits P0 §19's structure (small icon, headline, context sentence, optional action) scaled to the hosting region's size.
- **Spacing rules:** Scales down from the full-page `space.10` rhythm to a region-appropriate `space.6`–`space.8` when nested inside a smaller Composite (e.g. an empty Timeline Card).
- **Responsive behaviour:** Icon/text scale modestly on phone; structure unchanged.
- **Accessibility:** Announced as a live-region update when it appears as the result of a user action (e.g. clearing selection resulting in an empty state).
- **White-label compatibility:** Icon fixed; action button uses brand accent.

### 8.4 Success
- **Purpose:** Positive confirmation that an action completed (P0 §21's "explicit success confirmation" rule).
- **When to use:** Every data-mutating action — save, submit, approve, upload.
- **When NOT to use:** Never the only signal of success when the action also has a clear in-place state change available (e.g. a button transitioning to a checkmark) — but even then, a toast/inline confirmation should still fire for actions with consequence beyond the immediate control (e.g. a full form submission, not just a single toggle).
- **Visual hierarchy:** A transient toast (elevation level 3) using success-semantic color as an accent (icon + left border), neutral surface otherwise — never a full-color success banner, which is too loud for a frequent, repeated event.
- **Spacing rules:** Toast internal padding `space.4`; positioned consistently (e.g. bottom-center or top-right, one position chosen platform-wide) with `space.4` offset from viewport edge.
- **Responsive behaviour:** Desktop/tablet — fixed-position toast; phone — full-width toast anchored to top or bottom, never obscuring Sticky Actions (§5.2) if both are present simultaneously.
- **Accessibility:** Announced via a live region; auto-dismisses after a duration long enough to be read, but is also manually dismissible and pausable on hover/focus.
- **White-label compatibility:** Success color is semantic; toast surface neutral.

### 8.5 Error
- **Purpose:** Communicate a failed operation or system-level problem per P0 §20's three-tier model (field/section/system).
- **When to use:** Any failed data operation, network failure, or unhandled condition.
- **When NOT to use:** Never for a business-state warning that isn't actually a failure (that's a Warning Card, §3.5) — Error is reserved for genuine failures.
- **Visual hierarchy:** Field-level — inline per §5.5; section-level — replaces only the affected region with a retry action, Shell remains usable; system-level — a distinct full-context state, still with an explicit next step, never a bare "Something went wrong."
- **Spacing rules:** Section-level error blocks use the same `space.10` empty-state rhythm (structurally an empty-state variant with a retry action instead of a create action).
- **Responsive behaviour:** Identical structure at all breakpoints.
- **Accessibility:** Errors are announced via a live region immediately, not just visually rendered; retry actions are keyboard-reachable immediately.
- **White-label compatibility:** Danger-semantic color, non-overridable.

### 8.6 Offline
- **Purpose:** Communicate loss of network connectivity distinctly from a generic error, since recovery is automatic (reconnect) rather than an action the user takes.
- **When to use:** Any point the application detects it has lost network connectivity, particularly relevant for tablet-based on-site use (P0 §17 — inspections, handover sign-off in the field).
- **When NOT to use:** Never conflated with a server-side error (§8.5) — offline is a connectivity fact, not an application failure, and should say so plainly.
- **Visual hierarchy:** A persistent, low-height banner at the top of the Content Area (below Header, so global navigation remains usable), neutral/informational color, auto-dismisses the moment connectivity returns (paired with a brief success confirmation, §8.4, that reconnection succeeded).
- **Spacing rules:** `space.3` internal padding — deliberately compact, a status strip rather than a card.
- **Responsive behaviour:** Full-width at all breakpoints, identical treatment.
- **Accessibility:** Announced via a live region on both loss and recovery of connectivity.
- **White-label compatibility:** Neutral, informational-semantic only.

### 8.7 Permission
- **Purpose:** Communicate that the current user lacks access to a specific action or view — distinct from a 404/not-found and distinct from a generic error, since the resolution path is different (request access / contact admin, not retry).
- **When to use:** Any screen or action gated by role/permission (RBAC) that the current user's role doesn't satisfy, and specifically the Super Admin Support Access boundary (P0 §16) when a restricted-financial or similarly walled-off resource is attempted.
- **When NOT to use:** Never disguised as a generic error or a silent disabled control with no explanation — a user should always understand *why* something is unavailable to them.
- **Visual hierarchy:** A dedicated state (full-page for a blocked route, inline for a blocked action) naming the specific restriction plainly ("You don't have permission to view Owner financial records") without exposing sensitive detail about what exists behind the restriction beyond what the user is already entitled to know.
- **Spacing rules:** Full-page variant uses the same `space.10` rhythm as Empty/Error states; inline variant is compact, matching the disabled control it replaces.
- **Responsive behaviour:** Identical structure at all breakpoints.
- **Accessibility:** Announced clearly; never relies on a merely grayed-out, unexplained control as the sole signal.
- **White-label compatibility:** Neutral; never brand-colored, since it represents a platform-level security boundary.

---

## 9. Charts

Charts always live inside the Analytics layout (§2.5) or as a single supporting visualization within a Dashboard/Detail Composite — never as a page's sole content with no surrounding KPI/context.

**Governing rule for all five families below:** categorical chart colors are drawn from a **fixed, accessibility-validated multi-color palette distinct from the single brand accent** — a chart needs several mutually distinguishable series, which the one-accent-color rule (P0 §3/§7) cannot satisfy alone; this is the one deliberate, documented exception to that rule, scoped strictly to chart series encoding.

### 9.1 Portfolio
- **Purpose:** Aggregate, cross-project view of the builder's or organization's overall holdings — unit counts by status, occupancy trend, project distribution.
- **When to use:** Builder Portal / Super Admin top-level Analytics views summarizing the whole portfolio.
- **When NOT to use:** Never for single-project or single-unit detail — that belongs in a Detail page's own supporting chart, not a Portfolio-family chart.
- **Visual hierarchy:** Aggregate totals/composition (donut, stacked bar, or distribution chart) as the primary form; a supporting trend-over-time line beneath.
- **Spacing rules:** Follows Analytics layout's `space.6` chart-card padding.
- **Responsive behaviour:** Desktop — full detail with legend beside the chart; tablet — legend moves below; phone — simplified/aggregated view per §2.5's rule, legend below, touch-friendly tap targets on chart segments.
- **Accessibility:** Data-table fallback view available (§2.5); legend never relies on color alone (pattern/label pairing).
- **White-label compatibility:** Uses the fixed categorical palette (not brand accent); the surrounding chart card itself carries no brand styling.

### 9.2 Builder
- **Purpose:** Builder-specific operational metrics — project velocity, handover throughput, staff activity — relevant primarily to Super Admin's oversight view of a given builder, and to a builder's own self-view of their team's output.
- **When to use:** Super Admin's per-Organization Analytics; Builder Portal's own team/operations Analytics.
- **When NOT to use:** Never mixed with Financial-family charts (§9.3) on the same visualization — operational throughput and financial figures are different literacies and should be visually and contextually separated.
- **Visual hierarchy:** Typically comparative bar or line charts (throughput over time, per-project comparison); avoid donut/pie forms here since Builder metrics are usually about comparison/trend, not composition.
- **Spacing rules:** Inherits §2.5.
- **Responsive behaviour:** Inherits §2.5.
- **Accessibility:** Inherits §2.5's data-table fallback rule.
- **White-label compatibility:** Fixed categorical palette; a Builder's own name/branding may label a series but never recolors the palette itself.

### 9.3 Financial
- **Purpose:** Revenue, collections, loan/expense trend visualization — the highest-scrutiny chart family given the platform's Restricted-Financial data boundary (carried from the existing architecture series).
- **When to use:** Only within screens already cleared to display financial data under the platform's existing RBAC/Restricted-Financial rules — this document does not alter that boundary, only specifies the visual treatment for wherever it's already permitted.
- **When NOT to use:** Never rendered for a user/context not already authorized for financial data — this chart family carries no independent access logic of its own; it strictly inherits whatever the page's data boundary already enforces.
- **Visual hierarchy:** Precision-first — tabular figures on axes, exact values on hover/tap (never rounded-only), currency formatting consistent platform-wide; the calmest, least decorative chart family (closest to Stripe Dashboard's reference language, P0 §3).
- **Spacing rules:** Inherits §2.5, with slightly increased internal padding (`space.6`+) reflecting the "slow down for high-consequence data" principle already established for Settings (§2.6) and Delete Dialogs (§7.4).
- **Responsive behaviour:** Inherits §2.5; on phone, exact figures remain available via tap (not hover-only, which doesn't exist on touch).
- **Accessibility:** Data-table fallback is especially important here (§2.5) given the precision this data demands; never conveys a financial trend through color alone (paired with explicit +/- values).
- **White-label compatibility:** Fixed categorical/semantic palette only — financial charts are the last place a brand-accent substitution should ever be considered, given precision and trust are paramount here.

### 9.4 Construction
- **Purpose:** Physical progress visualization — construction milestone completion, inspection readiness trends, stage-pipeline throughput across units/buildings.
- **When to use:** Builder Portal Analytics tracking physical/operational progress (distinct from Financial and from the Owner/Handover-specific Progress Card, §3.7, which is per-record rather than aggregate).
- **When NOT to use:** Never for financial interpretation of construction cost — that crosses into Financial (§9.3) and should be a separate, clearly labeled chart even on the same page.
- **Visual hierarchy:** Progress-oriented forms (stacked/cumulative bar showing stage completion across many units, Gantt-adjacent timeline views for milestone tracking) — favor cumulative/comparative forms over simple line charts, since the underlying data is inherently staged/discrete (the same 8-stage model as the Handover pipeline).
- **Spacing rules:** Inherits §2.5.
- **Responsive behaviour:** Inherits §2.5; Gantt-adjacent timeline forms specifically require the "simplified aggregate view" fallback on phone (§2.5) since a full multi-row timeline is not viable at phone width.
- **Accessibility:** Data-table fallback especially important for timeline-form charts, which are the hardest chart type to convey non-visually.
- **White-label compatibility:** Fixed categorical palette; stage-status coloring reuses the same semantic colors as Status Chips (§6.6) for cross-recognition between the chart and the underlying record list.

### 9.5 Operations
- **Purpose:** Day-to-day operational throughput not covered by the other four families — document approval turnaround time, support-access session activity (Super Admin), general activity volume.
- **When to use:** Operational Analytics views for internal process health, typically Super Admin-facing.
- **When NOT to use:** Never used as a catch-all for metrics that actually belong to one of the four more specific families above — Operations is reserved for genuinely cross-cutting process metrics (e.g. turnaround time, activity volume) rather than becoming a dumping ground.
- **Visual hierarchy:** Typically time-series line/area charts showing volume or duration trends; simplest visual form of the five families, reflecting its supporting/monitoring role rather than a headline analysis.
- **Spacing rules:** Inherits §2.5.
- **Responsive behaviour:** Inherits §2.5.
- **Accessibility:** Inherits §2.5's data-table fallback rule.
- **White-label compatibility:** Fixed categorical palette; this family is the least likely to ever need brand-specific treatment, being an internal operations concern.

---

## 10. Theme Layer

The substrate every Shell, Layout, and Composite above consumes via semantic tokens only (P0 §4's rule, restated and elaborated here at the architecture level — never bypassed by a Shell/Layout/Composite reaching for a raw/core token directly).

### 10.1 Spacing
- **Purpose:** The single 8pt scale (P0 §5) every Shell/Layout/Composite spacing rule in this document references by name (`space.1`…`space.12`).
- **When to use:** Every spacing decision anywhere in the system, without exception.
- **When NOT to use:** Never an off-scale value "just this once" — every §1–§9 entry above cites this scale precisely so that a implementer has zero ambiguity about which of the 8 legal values applies.
- **Visual hierarchy:** N/A (a substrate layer, not a visible component) — its "hierarchy" is expressed entirely through which components use the larger vs. smaller values (P0 §5's "related things sit closer" rule).
- **Spacing rules:** Is the spacing rule; see P0 §5 for the full scale and its governing rules.
- **Responsive behaviour:** The scale itself does not change per breakpoint; what changes is which token a given Composite selects at a given breakpoint (documented per-component above).
- **Accessibility:** Adequate spacing is itself an accessibility contributor (touch target spacing, visual grouping for cognitive accessibility) — the 44px minimum touch target rule (P0 §17) is expressed using this scale.
- **White-label compatibility:** Never themeable — spacing is structural, not brand expression (P0 §25).

### 10.2 Radius
- **Purpose:** Corner-rounding scale applied consistently to Cards, Dialogs, Chips, Buttons, and Inputs.
- **When to use:** Every surface with a defined edge — no component invents its own radius value.
- **When NOT to use:** Never a fully sharp (zero-radius) or fully circular treatment used inconsistently — establish one small scale (e.g. sm/md/lg/full) and assign each Composite type to exactly one step, permanently.
- **Visual hierarchy:** Larger surfaces (Cards, Dialogs) typically use a slightly larger radius than small controls (Chips, Buttons, Inputs) — a consistent, gentle "larger surface = slightly softer corner" relationship, never dramatic per-component variation.
- **Spacing rules:** N/A — radius is independent of the spacing scale, though both contribute to the same "engineered, precise" visual language (P0 §3).
- **Responsive behaviour:** Unchanged across breakpoints.
- **Accessibility:** No direct accessibility implication; radius must never be so aggressive it clips focus-ring visibility.
- **White-label compatibility:** Non-themeable — radius is a structural brand-neutral decision, not part of the bounded white-label surface (P0 §25).

### 10.3 Elevation
- **Purpose:** The five-level shadow/layering scale (P0 §8) governing every Card, Dropdown, Toast, and Dialog's sense of depth.
- **When to use:** Every surface that needs to communicate "this sits above the page" or "this is temporary/floating."
- **When NOT to use:** Never a shadow used purely decoratively on a flat, non-interactive surface — elevation always maps to one of the five defined meanings (P0 §8's table), never applied arbitrarily.
- **Visual hierarchy:** Directly encodes hierarchy — higher elevation always means "more temporary / more interruptive" (Dialogs highest, resting page content lowest), never the reverse.
- **Spacing rules:** N/A.
- **Responsive behaviour:** Unchanged across breakpoints — elevation is a depth cue independent of viewport size.
- **Accessibility:** Elevation differences should not be the *only* cue distinguishing interactive from static surfaces — always paired with a real interaction affordance (cursor, focus state).
- **White-label compatibility:** Non-themeable — shadow color/opacity is neutral (a cool-neutral tint per P0 §8), never brand-tinted.

### 10.4 Motion
- **Purpose:** The duration/easing tokens (`duration.fast/base/slow`, `ease.standard`) governing every transition in the system.
- **When to use:** State transitions that benefit from being perceptible rather than instantaneous — hover states, panel/drawer open-close, dropdown reveal, tab switch.
- **When NOT to use:** Never for content that should feel instant (typing feedback, drag operations) — those bypass eased duration entirely and track input directly.
- **Visual hierarchy:** Faster durations for small/frequent interactions (hover, focus); slower for large/spatial transitions (Drawer slide-in, Dialog open) — a consistent "bigger movement, slightly longer duration" relationship.
- **Spacing rules:** N/A.
- **Responsive behaviour:** Durations remain constant across breakpoints; respects the user's OS-level "reduce motion" preference by substituting a cross-fade or instant-state-change for any spatial animation, platform-wide, no exceptions.
- **Accessibility:** Reduced-motion compliance (previous bullet) is a hard requirement, not an enhancement.
- **White-label compatibility:** Non-themeable.

### 10.5 Animation
- **Purpose:** The small, fixed library of *named* animated patterns built from the Motion tokens (§10.4) — skeleton shimmer (§8.2), toast enter/exit (§8.4), success-checkmark transition, drawer/dialog enter/exit — as opposed to §10.4's raw timing values.
- **When to use:** Exclusively the named patterns enumerated in this system (P0 §1's "motion only to communicate state change, never spectacle") — skeleton shimmer, toast transitions, dialog/drawer transitions, expandable-row reveal, tab-switch indicator movement.
- **When NOT to use:** Never a bespoke, one-off animation invented for a single feature screen — if a new state-change genuinely needs motion, it is added to this named library first, exactly mirroring the Composite-tier discipline (P0 §18, this document §0).
- **Visual hierarchy:** Motion itself never becomes the focal point of an interaction — it supports the state change (something appeared, something completed) without drawing attention to its own cleverness (P0 §1's "quiet confidence").
- **Spacing rules:** N/A.
- **Responsive behaviour:** Identical across breakpoints, subject to the same reduced-motion override as §10.4.
- **Accessibility:** Every named animation has a reduced-motion equivalent defined alongside it, not added later as an afterthought.
- **White-label compatibility:** Non-themeable — the animation library itself is platform-owned, structural infrastructure.

---

## Appendix: Traceability to P0

Every rule cited above by section number (P0 §1–§25) is inherited, not restated in full — this document assumes P0 as read and approved. Where this document makes a decision P0 left open (e.g. the specific chart-palette exception in §9's governing rule, or the reduced-motion requirement in §10.4/§10.5), that decision is scoped narrowly to the component it appears under and does not alter any P0 rule elsewhere.

**Recommended next step, not part of this document's scope:** an implementation-phase pass that assigns literal token values (actual spacing pixels beyond the named scale, actual color hex/HSL values, actual duration milliseconds) and produces the per-Composite technical spec sheet Cursor would consume directly — this document defines *what must exist and the rules it must obey*, the next phase defines *the exact values*.
