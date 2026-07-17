# UI-REBIRTH-01 — Complete Product UX Reimagination
### MyPropertyAsset — Product UX Blueprint

**Status:** Draft — Reimagination (no implementation)
**Voice:** Written as the Head of Product Design would present it to the founders — opinionated, evidence-based, unwilling to soften a verdict to spare feelings.
**Explicitly out of scope:** Angular, HTML, CSS, component code. Every recommendation here is a design decision for a future implementation phase to execute.
**Relationship to prior documents:** `P0_ENTERPRISE_PRODUCT_DESIGN_SYSTEM.md` (visual language, tokens, principles) still holds — nothing here contradicts its color/spacing/typography rules. `P0_1_ENTERPRISE_DESIGN_SYSTEM_ARCHITECTURE.md` (component/layout inventory) mostly still holds, but this document was explicitly asked to "forget the current layouts, forget the current pages" and reimagine from first principles — where that reimagination changes an information-architecture decision P0.1 assumed (e.g. how many tabs a Detail page needs, whether a page should exist at all), **that delta is called out by name in §20**, not silently contradicted.
**Method:** Before writing a single recommendation, the current Builder Portal and Super Admin Portal were audited page-by-page — shell, dashboard, list, detail, and form/wizard patterns, in both portals. §19 is built entirely from that audit; every other section's recommendations trace back to a specific thing that audit found.

---

## 1. Product Design Philosophy

The honest one-line diagnosis: **this product currently has excellent bones and no posture.** The engineering underneath — a real component library, real shared shells, real tokens starting to appear (`var(--mpa-spacing-lg)` shows up in the shared dashboard grid) — is further along than most Series A products. But the pages built on top of it read as a demo of what PrimeNG can do, not as a product with a point of view. Two entities in the *same portal* (Projects and Organizations) don't even agree on whether their list page has a card view. That's not a visual polish problem. That's the absence of a design philosophy being enforced.

A billion-dollar SaaS company does not win on feature count. Stripe, Linear, and Vercel all under-build relative to their competitors and out-*feel* them. The philosophy for this rebirth:

1. **Every screen has a point of view about what matters most on it.** Not "here is all the data related to this record" — "here is the one thing you came here to check, and everything else is one click away."
2. **Consistency is non-negotiable, even when it's inconvenient.** If Projects gets a card/table toggle, Organizations gets one too — or neither does. The current product breaks this constantly, and it's the single fastest way to make an enterprise buyer distrust the product ("did two different teams build this without talking to each other?").
3. **Confidence over caution.** The current UI hedges — six plain-text "Go to X" links standing in for a Handover's tabs, an aside panel with a hard-coded `20rem` width because nobody decided on a real proportion. A premium product commits to decisions and applies them everywhere.
4. **Emotion is allowed, sparingly.** A completed handover, a successfully onboarded builder, a fully-reconciled financial period — these are milestone moments that deserve a beat of delight (motion, a well-composed success state). Everything else stays quiet. Reserve emotion for the 5% of moments that are actually momentous; that scarcity is what makes it land.

---

## 2. Navigation Philosophy

**The current audit finding that matters most here:** the sidebar's "second level" is decorative, not functional. Under Projects, "Buildings" and "Units" appear as nested children — but both route to the exact same `/builder-portal/projects` destination as their parent. It looks like navigation. It behaves like a broken promise. A user who has learned "this app has a Buildings section" will click it, land somewhere that doesn't obviously answer that expectation, and quietly lose a small amount of trust every time. This is worse than not having the nesting at all.

Similarly, the "Workspace" indicator in the sidebar looks like a context switcher (an avatar, a name, an eyebrow label) but has no click handler — it's a label pretending to be a control.

**Reimagined navigation philosophy:**

- **Nothing in navigation is decorative.** If it looks clickable, it does something. If a hierarchy is shown, every level of that hierarchy is a real, distinct destination. Buildings and Units earn their nav placement only when they have their own detail views to route to — otherwise they're accessed via the parent Project's own page (a tab or section), not the sidebar.
- **One real workspace switcher, not a label.** The organization/workspace identity in the sidebar becomes an actual control: click it, get a searchable list of every organization/builder context the current user can access, switch instantly. For a Super Admin operator moving between dozens of builder accounts a day, this single fix is worth more than any visual polish pass.
- **Command palette as the real second navigation system.** Given how deep this entity hierarchy goes (Organization → Project → Building → Unit → Owner → Document → Handover), no sidebar tree will ever make every destination reachable in one click. Solve it with search, not with ever-deeper nesting: `⌘K` opens a palette that jumps straight to "Unit 4B, Sunrise Towers" or "Handover #HX-2291" by typing, bypassing the tree entirely. The sidebar's job shrinks to "the 6-8 things I visit constantly"; the palette's job is "the one specific record I need right now."
- **Breadcrumbs replace fake tabs as the wayfinding mechanism**, and real tabs replace fake breadcrumbs where the audit found the reverse mistake (see §5) — each pattern used for the job it's actually good at, never swapped for the other out of convenience.

---

## 3. Dashboard Philosophy

**The audit found the opposite of the original brief's complaint.** The Builder Portal dashboard isn't under-filled with too much empty space — it's stacking a welcome banner, a KPI strip, four 2-card summary sections (Portfolio, Branding, Communication, Subscription), and a 9-widget grid, for a possible 17–21 cards on one screen. That's not "too much whitespace." That's the opposite failure: a dashboard trying to be everything's front door at once, so it ends up being nothing's clear front door.

**Reimagined dashboard philosophy — triage, not table-of-contents:**

- **A dashboard answers exactly one question: "what needs me today?"** Not "here is a tile for every module that exists." Branding status, Communication status, and Subscription status are configuration/account facts, not daily-operational facts — they don't belong on the operational dashboard at all. They belong in Settings, surfaced via a single unified "Account health" indicator (one line, one click through) if they need any dashboard presence whatsoever.
- **A hard ceiling: one KPI strip (3–5 tiles), one attention list, one activity feed, one quick-actions row.** That's four zones, not eight. If a fifth zone is proposed, something existing has to be demoted to earn its place, not simply added.
- **The dashboard is allowed to feel sparse on a quiet day.** A builder with no overdue handovers, no pending approvals, and no stalled projects should see a calm, mostly-empty attention zone — that emptiness *is the good news*, and design should let it read that way (a small reassuring "You're all caught up" state, not a forced filler widget).
- **Different portals, different rhythms:** the Builder Portal dashboard is operational and reassuring (are my projects healthy); the Super Admin dashboard is platform-health and exception-driven (which builders need intervention) — they should not share the same 9-widget grid template even though today they share the identical shell component.

---

## 4. Page Composition Rules

Five rules, derived directly from the audit's most repeated failure mode (inconsistency between visually-identical-seeming pages that actually behave differently):

1. **If one entity's list page gets a capability (card/table toggle, saved searches, advanced filters), every comparable entity's list page gets the same capability, or an explicit, documented reason it doesn't.** Today, Projects has a full card/table toggle and Organizations doesn't, with no visible reason — that's an inconsistency an enterprise buyer will notice within their first hour of a trial.
2. **A page's chrome (header shape, action placement, status treatment) is drawn from a fixed template, never invented per-entity.** The audit found Organization detail using a hard-coded `20rem` aside and three different avatar sizes not used anywhere else — evidence that this page's layout was designed in isolation rather than inheriting a system.
3. **One action idiom, everywhere.** Buttons are buttons; links are links; a Handover detail page rendering its section-navigation as six plain "Go to Documents / Go to Inspection…" links, in an app that otherwise uses a proper button/tab component vocabulary everywhere else, reads like two different hands built two different pages.
4. **Every page has exactly one primary action.** The audit's Projects list surfaces four competing top-level affordances (Create, Import, Advanced Filters toggle, plus bulk actions) with no visual hierarchy separating "the thing you're here to do" from "the things you occasionally need." Fixed by strict visual demotion: one filled primary button, everything else outlined/ghost or tucked into an overflow.
5. **Cards earn their place by information, not by habit.** A summary card containing one fact ("Branding: 60% complete") is not a card — it's a line of text pretending to need a container. Reserve the Card composite for genuinely multi-fact, visually-distinct groupings; a single stat gets a Metric tile, not a full card shell with border/shadow/padding overhead.

---

## 5. Detail Page Blueprint

**The audit's sharpest finding lives here.** Project Detail and Handover Detail — two Detail pages in the *same portal*, one click apart in the information architecture — use two structurally different patterns. Project Detail has no tabs at all (a single 2-column page: overview/location/summary on one side, map/gallery placeholders on the other). Handover Detail fakes tabs with six plain navigation links in the header. Neither is wrong in isolation; having *both patterns exist for the same job* is the actual defect.

**Reimagined, single Detail Page Blueprint — used by every entity, no exceptions:**

- **A record header, always the same shape:** entity name + status (a real status chip, never plain text) + 2–3 key facts + exactly one primary action + an overflow menu for the rest. This is what a user sees in the first 200ms regardless of whether they're looking at a Project, a Handover, an Organization, or a Unit.
- **Real tabs when — and only when — a record has genuinely distinct sub-domains of information a user visits selectively**, not sequentially. A Handover's stages (Documents, Inspection, Signature, Completion) *are* sequential — a user progresses through them, doesn't randomly jump. That's not a tab pattern at all; it's the **Stage Tracker** pattern (a persistent horizontal pipeline visualization with the current stage expanded below it) — the same pattern already correctly identified in the architecture layer, just not the pattern the current Handover Detail page actually uses. Fix: replace the six "Go to X" links with a real Stage Tracker.
- **A Project, by contrast, genuinely has non-sequential sub-domains** (its Buildings, its Units, its Documents, its Owners aren't visited in a fixed order) — that *is* a legitimate tabs case, and today's Project Detail has no tabs at all, forcing everything onto one long scrolling page. Fix: give Project Detail real tabs (Overview / Buildings / Units / Documents / Owners), each tab reusing the List Page Blueprint (§6) for its content, and let the "Overview" tab alone carry the map/summary/gallery content that currently makes up the entire page.
- **One consistent aside-panel width and one consistent avatar scale, system-wide** — not the three different avatar sizes and one bespoke `20rem` measurement the audit found in Organizations alone. These become Theme Layer decisions (P0.1 §10), never a per-page judgment call.

---

## 6. List Page Blueprint

- **Every entity list gets the same toolbar anatomy:** search, then filters-as-visible-chips (not buried in a panel), then a view-mode toggle (table/card) where the entity benefits from a visual card view (Projects, Units — anything with a meaningful thumbnail/visual identity) and table-only where it doesn't (Organizations, Users — anything that's fundamentally a directory of names and metadata). The rule isn't "give everything a toggle" — it's "decide per entity type whether card view adds value, then apply that decision consistently to every entity of that type," which is the opposite of today's unexplained Projects-has-it/Organizations-doesn't split.
- **Status is always the same chip component**, never a colored row and never plain colored text (the audit confirms Projects already does this correctly via a dedicated status-badge component — that's the standard, not the exception, and should be mechanically enforced everywhere else).
- **The toolbar has one primary action, full stop.** Import, advanced filters, and saved searches are real, valuable power-user features — they get demoted to a secondary row or a "..." overflow, not equal visual billing with Create.
- **Bulk actions only appear once something is selected**, replacing the toolbar's default state rather than floating alongside it.
- **Row density is a user preference, not a fixed decision** — comfortable by default in the Builder Portal, compact by default in Super Admin (P0 §16's already-correct instinct, restated here as a list-page mandate).

---

## 7. Form Blueprint

**Good news from the audit:** the Project creation flow already does several things right — a real 4-step wizard, named section headers per step ("Basics," "Location & timeline"), a proper review step. This is the single best-executed pattern found anywhere in the current product and should be the *template* other forms are brought up to, not rebuilt from scratch.

**What still needs reimagining:**

- **Distinguish Wizard from Form more deliberately.** Not every entity needs 4 steps. A Unit, edited after creation, doesn't need to re-walk a wizard — editing should always be a single-page grouped Form (Section Cards, per P0.1 §5), reserving the multi-step Wizard exclusively for the *first-time creation* of records with genuine sequential dependency. The current Project form already seems to understand this distinction implicitly; it should become an explicit, named rule applied to every entity (Building, Unit, Owner, Document) rather than each one separately reinventing whether it's a wizard.
- **A 2-column field grid is fine for genuinely paired fields (city/state, lat/long) and wrong for everything else.** Audit note: Step 2 of the Project wizard shows 8 fields at once in a 2-column grid — that's dense, not generously composed. Reimagined: only demonstrably paired fields share a row; everything else reverts to single column, even if that means a slightly longer scroll. Density is not the same as quality.
- **The Review step becomes richer, not just a definition list.** A premium creation flow's last step should visually preview *what the record will look like once created* (a small rendering of the record card/header it's about to generate) — turning "review your inputs" into "see what you're about to make," which is a meaningfully more confidence-building final beat.

---

## 8. Analytics Blueprint

The current product has no dedicated Analytics surface yet distinct from the dashboards audited — this is a green-field opportunity, not a fix.

- **Analytics is a destination, not a dashboard widget graveyard.** Financial trend, construction progress, handover throughput, and portfolio composition each get their own focused Analytics view (per P0.1 §2.5/§9's five chart families), reachable from the sidebar as its own top-level item — not scattered as a ninth dashboard widget nobody scrolls to.
- **Every Analytics view leads with one dominant chart and one clear question it answers** ("Is my handover pipeline speeding up or slowing down?"), with supporting charts arranged as secondary, smaller companions — never a wall of 6 equally-sized charts competing for attention.
- **A persistent date-range/comparison control governs the whole page**, so "this quarter vs last quarter" is a single interaction, not a per-chart setting repeated six times.
- **Every chart has a one-line, plain-English takeaway printed above it** ("Collections are up 12% from last month") — an enterprise buyer evaluating this product in a demo should never have to squint at a chart to figure out what it's telling them.

---

## 9. Workspace Blueprint

"Workspace" here means the entire feeling of *being inside* the product during a working session — not one page, but the ambient experience across all of them.

- **Persistent identity, always visible, never re-established per page.** The real workspace switcher (§2) plus a consistently-placed record breadcrumb means a user dropped onto any URL always knows instantly: which organization, which record, how deep they are.
- **State survives interruption.** A half-finished Project wizard, a filtered Units table, a scrolled-to position on a long Handover timeline — none of it should evaporate because the user got pulled into a meeting and came back to the tab an hour later. This is a workspace-level promise, not a per-form feature.
- **The workspace feels fast even when the network isn't.** Optimistic UI for common mutations (archiving a row, toggling a filter chip) with a graceful rollback-and-toast if the request actually fails — this is a large part of what makes Linear feel instantaneous, and it's an achievable standard here given the entity operations are mostly small, well-scoped mutations.
- **Notifications belong to the workspace, not to a page.** A single, consistent notification center (icon in the Header, per P0.1 §1.1) surfaces cross-entity events (a document was approved, a handover stage completed) regardless of which page the user happens to be on when it happens.

---

## 10. Builder Experience

The Builder Portal is the product's demo stage — the screen a builder shows their own investors. The audit's findings here are the most consequential because this is the highest-stakes surface in the entire platform.

- **The Project → Building → Unit → Owner → Handover chain should feel like one continuous story, not five separately-built modules stitched together.** Today it mostly does, structurally — but the Detail-page inconsistency (§5) and the ad-hoc dashboard summary cards (§3) puncture that illusion at exactly the moments (opening a Project, checking overall health) a demo would linger on longest.
- **The Handover experience is this portal's proof-of-premium and deserves the single largest design investment of any flow in the product** — its Stage Tracker, its signature moment, its completion certificate should be built and polished to a noticeably higher bar than ordinary CRUD screens, consistent with P0 §15's original instinct, now made concrete: replace its current six-plain-links header with a genuine Stage Tracker (§5) as the flagship execution of that pattern.
- **Kill the ad-hoc account-status cards from the daily dashboard** (§3) — a builder's daily view should be about their *properties*, not a running scoreboard of their own subscription/branding/communication setup, which reads as the platform reminding the customer about the platform, not helping them run their business.
- **Multi-project builders need the workspace switcher (§2) more than any other user segment** — this is the single highest-leverage fix for a portfolio operator managing 8+ active projects.

---

## 11. Super Admin Experience

- **This is an operator's cockpit, not a lighter version of the Builder Portal** — yet the audit found it sharing the identical dashboard shell, layout components, and even close-to-identical detail-page shape as the Builder Portal, down to reusing the same aside-panel pattern. Structural component reuse is good (P0.1's entire point); *identical information architecture for two different jobs* is not — Super Admin needs an exception-first, cross-organization view that the Builder Portal, correctly, has no reason to show.
- **The organization list's missing card view isn't a gap to fill — it's correct, and should stay that way, explicitly documented as intentional** (per §6's per-entity-type rule): a directory of business accounts doesn't benefit from a visual card grid the way a portfolio of physical Projects does. The fix here isn't "add the toggle to match Projects" — it's "write down why Organizations is table-only on purpose," so a future contributor doesn't either arbitrarily add it or arbitrarily remove Projects' equivalent, absent a stated reason.
- **Support Access needs the unmissable visual mode indicator P0 §16 already called for** — the audit didn't find evidence this exists yet; it should be treated as a Phase-1 priority alongside the Handover Stage Tracker, not a nice-to-have, given its audit/trust function.
- **Bring the Organization detail page's one-off spacing (§5) under the same Theme Layer as everything else** — this is the fastest, lowest-risk fix in this entire document (a token-alignment pass, not a redesign) and should happen early precisely because it's cheap and removes a visible inconsistency an internal ops team notices every day.

---

## 12. Mobile Experience

Both portals remain desktop-primary operational tools (P0 §17's tiered commitment stands), but two audit-driven refinements:

- **The Handover Stage Tracker (§5, §10) is the one flow most likely to be used on a tablet on-site** (inspection, digital sign-off) — it should be the first thing tested and polished at the tablet breakpoint, not an afterthought discovered late.
- **The current Projects toolbar's density (search + chips + saved searches + advanced filters + import, per §4) will not survive a phone-width collapse gracefully as built today** — the reimagined toolbar (one primary action, everything else demoted) is also, not coincidentally, the version that collapses cleanly to a phone-width single icon + search bar. Simplifying for desktop clarity and simplifying for mobile survivability turn out to be the same fix here.

---

## 13. White-label Strategy

No change to P0 §25's bounded surface (logo, primary accent, one reserved secondary accent) or its non-overridable list (status/semantic colors, spacing, typography, structure). One addition driven by this reimagination's Handover focus:

- **The Handover completion certificate and owner-facing package (§10) are the single piece of this product most likely to be physically printed or forwarded outside the app** — these deserve their own slightly wider white-label allowance (e.g. a builder's full letterhead-style branding on the certificate document itself) even though the in-app chrome around it stays within P0's bounded surface. This is a deliberate, narrow exception, not a loosening of the general rule — call it out explicitly wherever the certificate is eventually speced so it isn't mistaken for scope creep.

---

## 14. Visual Hierarchy

Restated as the operating test for every screen in this rebirth, since the audit's failures were almost all hierarchy failures, not palette or type failures:

- **The "first 200ms" test:** cover the screen, glance for 200ms, uncover it. What did the eye land on first? It must be the single most important fact on the page (a status, a KPI, a name) — never a border, a card shadow, or a button that happens to be red.
- **The "delete everything and add back only what earns its place" test**, applied literally to the current dashboard's 17–21 cards (§3) and the Projects toolbar's four competing actions (§4) — both fail this test today, and both are named, addressed fixes in this document, not abstract principles.
- **Weight follows consequence, not habit.** A destructive action is never visually quieter than a routine one merely because "that's how the button component defaults."

---

## 15. Typography System

No revision to P0 §6's scale or rules. One reimagination-specific addition:

- **Record identity (a Project's name, a Handover's ID, an Organization's name) gets a deliberately larger, more confident treatment than P0's original `text.heading.page` size suggests when it's the sole subject of a Detail page header** — think of it the way Linear renders an issue title: large, unmistakably the point of the page, everything else visibly secondary. This is a controlled exception (one size step up, reserved for exactly this one context — the Detail page header's primary name) rather than a general loosening of the "no more than 4 sizes per screen" rule.

---

## 16. Spacing System

No revision to P0 §5's 8pt scale. The audit gives this section its clearest mandate: **the current product does not actually follow the scale it already has tokens for.** `_organizations.scss` alone contains roughly fifteen distinct one-off rem values where a disciplined implementation would show perhaps five, repeated. This isn't a design decision to make — it's a design decision (P0 §5) that already exists and simply hasn't been enforced. Flagged here because a "reimagination" pass that only proposes new patterns, without also naming that the *existing* system is being silently bypassed, would miss the single most mechanical, highest-value fix available.

---

## 17. Motion Principles

Extending P0.1 §10.4/§10.5 with reimagination-specific moments worth naming explicitly (motion as emotion, used sparingly per §1):

- **The Handover completion moment** (§10) deserves a real, designed motion beat — not a bespoke animation, but the platform's existing named "success" pattern (P0.1 §8.4) played at slightly higher visual confidence than a routine save-toast, since this is one of the 5% of moments §1 reserves emotion for.
- **View-mode toggles (table ⇄ card, §6) and tab switches should cross-fade, never hard-cut** — a small, consistent motion signature that makes the product feel considered rather than assembled.
- **Loading states never compete with motion for attention** — a skeleton shimmer (P0.1 §8.2) and a success checkmark (§8.4) never play simultaneously in the same view; sequence them.

---

## 18. Interaction Principles

- **Every list-to-detail transition preserves scroll position and filter state on back-navigation** — a user filtering Units by status, opening one, and pressing back should return to exactly where they left off, not a reset list. This is a small technical promise with an outsized trust payoff.
- **Hover states exist everywhere a click does; nothing is clickable-but-inert-looking, and nothing looks clickable but isn't** — this is the direct fix for the audit's "workspace indicator that looks like a switcher but isn't" finding (§2), generalized into a system-wide rule.
- **Keyboard parity for every primary flow** — the command palette (§2), form field tabbing (already implicitly present in the current wizard's step structure), and table row selection should all be fully operable without a mouse, not as an accessibility bolt-on but as the standard a power user actually adopts daily.
- **Confirm-before-consequence scales with the consequence**, per P0 §20/§7.4 — restated here because the audit didn't surface evidence either way and it's worth an explicit re-check during implementation that every archive/delete/deactivate action actually names its specific consequence rather than defaulting to a generic PrimeNG confirm dialog.

---

## 19. UX Anti-patterns Currently Found

The complete, evidence-based list — every item below was directly observed in the current codebase, not inferred:

1. **Decorative navigation that doesn't navigate.** Sidebar "Buildings" and "Units" children under Projects both route to the exact same URL as their parent. *Why it's bad:* trains users to distrust the nav tree the first time they notice it.
2. **A workspace switcher that isn't one.** The sidebar's workspace/organization indicator has the visual affordance of a control (avatar, label, chevron-adjacent styling) with no click behavior wired to it. *Why it's bad:* looks broken, not minimal.
3. **Two Detail-page patterns for one job.** Project Detail has no tabs; Handover Detail fakes tabs with six plain links. *Why it's bad:* the same product teaching two different mental models for "how do I explore a record," one page apart.
4. **Inconsistent list-page capability.** Projects has a card/table toggle, saved searches, and advanced filters; Organizations has none of it, with no stated reason. *Why it's bad:* reads as unfinished, not as an intentional design distinction (even where a distinction might be justified, per §11).
5. **A dashboard that tries to be a table of contents.** 17–21 cards across a welcome banner, KPI strip, four summary sections, and a 9-widget grid. *Why it's bad:* nothing on it reads as *the* priority; everything competes.
6. **Ad-hoc "account status" cards masquerading as operational insight.** Branding/Communication/Subscription summary cards sit on the daily operational dashboard as inline object literals, not a shared typed pattern. *Why it's bad:* conflates "things about your subscription to us" with "things about your properties," and does so with bespoke, non-reusable card instances.
7. **One-off spacing values undermining an already-defined token system.** `_organizations.scss` alone carries roughly fifteen distinct hard-coded rem values (and a hard-coded hex color fallback sitting next to a design token in the same declaration) where a system with real spacing tokens should show a handful, repeated. *Why it's bad:* it's not a missing capability — the tokens already exist — it's simply not being followed, which is the fastest kind of drift to compound silently.
8. **Three unrelated avatar sizes on one page** (`2.75rem`, `2rem`, `4rem` in Organizations) with no evident system governing which context gets which. *Why it's bad:* a viewer's eye has to work out a hierarchy the design should have already resolved.
9. **A hard-coded aside width** (`20rem`) with no equivalent token anywhere else in the audited pages. *Why it's bad:* the moment a second page needs an aside, someone either copies the magic number or invents a different one — both bad outcomes, both currently possible.
10. **Mixed action idioms on the same page family.** Handover Detail uses six plain anchor-style links for primary section navigation while the rest of the audited product uses a proper button/component vocabulary. *Why it's bad:* undermines the "one system, many surfaces" promise P0 §1 opens with — a user can feel, even if they can't articulate, that this page was built differently.
11. **Competing top-level actions with no visual primary.** The Projects toolbar presents Create, Import, and an Advanced Filters toggle at equal visual weight. *Why it's bad:* directly violates P0 Enterprise Rule #1 ("exactly one primary action per screen") — and it's the single most demo-visible violation of that rule in the product today.
12. **PrimeNG default-adjacent table styling reached via `::ng-deep` overrides rather than the theming API.** *Why it's bad:* not a user-visible defect today, but a maintainability trap that will make the actual visual system (once specified) harder to apply consistently — worth flagging to whoever executes the next phase, even though it's implementation-adjacent rather than a pure design finding.

---

## 20. Complete Redesign Recommendations

Consolidated, in the order a design lead would actually present them — biggest perception impact first:

1. **Unify the Detail page pattern**: real tabs for non-sequential entities (Projects), a real Stage Tracker for sequential processes (Handovers) — eliminate the "no tabs" and "fake tab links" patterns entirely. *(Delta from P0.1: P0.1's Detail template §2.7 assumed tabs were already the norm; the audit shows they aren't built yet — this is an acceleration of an already-planned pattern, not a contradiction.)*
2. **Cut the dashboard from 17–21 cards to four fixed zones** (KPI strip, attention list, activity feed, quick actions) and relocate Branding/Communication/Subscription status entirely out of the daily dashboard into Settings.
3. **Replace the fake workspace switcher with a real one**, and make every nested nav item route somewhere genuinely distinct or remove the nesting.
4. **Decide, name, and document the card/table-toggle rule per entity type** (visual portfolio entities get it; directory entities don't) and apply it consistently — fixing Organizations' omission not by copying Projects blindly, but by making the underlying rule explicit for the first time.
5. **Enforce one primary action per toolbar/page**, starting with the Projects list (the most visibly cluttered offender found).
6. **Bring existing one-off spacing/color values under the token system that already exists** — the cheapest, least risky, highest-integrity fix in this entire document, and a strong candidate for the very first implementation sprint precisely because it requires no new design decisions, only enforcement of ones already made.
7. **Build the Handover Stage Tracker and completion-moment motion as the flagship execution of this entire rebirth** — it is simultaneously the highest-visibility Builder Portal moment (§10), the clearest current anti-pattern (§19 #3, #10), and the best single showcase of "this is now a premium product" to put in front of an investor demo.
8. **Introduce the command palette** — the single feature most likely to make the product *feel* like Linear rather than feel improved-CRUD, independent of any other visual change.
9. **Give Super Admin its own dashboard shape**, distinct from the Builder Portal's, built around cross-organization exceptions rather than reusing the identical widget-grid template.
10. **Stand up the Analytics surface as its own destination**, not scattered dashboard widgets, using P0.1's five chart families.

---

## Prioritized Implementation Roadmap

Ordered by (perceived-quality impact × how cheaply it can be fixed given what already exists), not by feature novelty — the fastest way to change how this product *feels* is rarely the biggest engineering lift.

**Phase 0 — Foundation Integrity (days, not weeks; no new design decisions required)**
- Enforce the existing spacing/color token system across all feature SCSS; eliminate one-off rem values and hard-coded hex fallbacks (§16, §19 #7, #8, #9).
- Replace `::ng-deep` table style hacks with proper theming-API usage (§19 #12) — a technical-debt fix with a design-integrity payoff (this is what makes every later phase's visual changes actually stick platform-wide instead of fighting overrides).
- Wire the workspace switcher to a real control (§2, §19 #2).
- Fix or remove decorative nav nesting (§2, §19 #1).

**Phase 1 — The Demo-Critical Fixes (highest visible impact)**
- Unify Project Detail and Handover Detail onto the correct patterns — real tabs for Projects, a real Stage Tracker for Handovers (§5, §20 #1).
- Collapse the Builder dashboard to four zones; relocate account-status cards to Settings (§3, §20 #2).
- Enforce one primary action on the Projects toolbar and every other multi-action toolbar found in the audit (§4, §20 #5).
- Design and ship the Handover completion motion beat (§17, §20 #7) — pairs naturally with the Stage Tracker work already underway in this phase.

**Phase 2 — Systemic Consistency**
- Decide and document the per-entity-type card/table-toggle rule; apply it to Organizations and every other list page (§6, §20 #4).
- Align Super Admin's dashboard and detail-page shapes to their own exception-first model rather than the Builder Portal's reused template (§11, §20 #9).
- Roll out the unified Detail-page header/aside/avatar-scale tokens platform-wide, closing the Organization-detail one-off gap for good (§5, §11).

**Phase 3 — Power and Delight**
- Ship the command palette (§2, §20 #8).
- Stand up the Analytics destination and its five chart families (§8, §20 #10).
- Add optimistic-UI and state-preservation-on-back-navigation across list/detail transitions (§9, §18).

**Phase 4 — White-label Readiness**
- Extend the bounded white-label surface to the Handover completion certificate specifically (§13), once the certificate itself has been redesigned under Phase 1's Stage Tracker work.
- Full brand-swap QA pass across every screen touched in Phases 1–3, using P0 §25's "brand swap test" as the literal acceptance criterion.

**What this roadmap deliberately does not include:** any new business module, any database change, any net-new page that doesn't already exist in some form in the audited product. This is a rebirth of experience, exactly as scoped — the entities, the data, and the workflows stay exactly what they are today.
