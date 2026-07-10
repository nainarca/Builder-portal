# AI Development Guide — MyPropertyAsset Web Platform

**Companion to:** [`NG-000_Web_Platform_Technical_Governance.md`](NG-000_Web_Platform_Technical_Governance.md)
**Purpose:** Standards for every AI tool involved in this platform's development. Written with an awareness that this entire document series (A-001 through A-009, and this document itself) is itself a product of exactly the process being governed here — this section is not abstract policy, it describes what has already been practiced and makes it explicit and binding going forward.

## Tool Roles

| Tool | Named in this project's actual toolchain? | Role |
|---|---|---|
| **Claude** | Yes — has produced every document in this series | **Architecture & Documentation.** Produces business/technical architecture, reviews, and gap analyses. Never writes production code directly (every prompt in this series, without exception, has carried an explicit "Generate Code: ❌ NO" instruction, and this guide makes that a standing rule, not a per-prompt coincidence) |
| **Cursor AI** | Yes — named as the implementation engine throughout A-001–A-009 | **Implementation.** Generates actual Angular/TypeScript code, but only from *approved* architecture documents — never from a Draft-status document, and never by inventing architecture Claude (or a human) hasn't already specified |
| **ChatGPT** | Not currently part of this project's toolchain | Not governed by a specific role today; if introduced, it is bound by the same rules as any AI tool below — no tool gets an implicit exception |

## Responsibilities

| Responsibility | Owner |
|---|---|
| Business architecture (what the platform is, does, and for whom) | Human product/business stakeholders, documented by Claude |
| Technical architecture (how it's built) | Human technical stakeholders, documented by Claude |
| Implementation (actual code) | Cursor AI, from approved architecture, reviewed by a human |
| Approval of any document or code | **Always a human** — no AI tool self-approves its own output at any stage of this pipeline |

## Allowed Outputs

- Claude: Markdown documentation only, exactly as every prompt in this series has specified — diagrams (as Mermaid/text), matrices, structured analysis.
- Cursor AI: Angular components/services/modules, tests, configuration — generated strictly from an **approved** document's specifications.

## Not Allowed Outputs

- Claude generating Angular code, SQL, API contracts, or any implementation artifact under the guise of "architecture" — every document in this series has explicitly forbidden this, and it remains forbidden here.
- Cursor AI inventing business rules, permission logic, or screen behavior not already specified in an approved A-series/NG-series document — if a document is silent or explicitly flagged as a gap (e.g., the story-less screens from A-004 §14), Cursor AI does not fill that silence with its own judgment; it stops and the gap gets escalated back to architecture, the same way this series has escalated every gap it found in itself.
- Any AI tool merging its own generated code without human review (`CODING_STANDARDS.md` §30).

## Review Process

1. Claude-produced documents are reviewed against their own Review Checklist (a section every A-series/NG-series document has carried since A-001).
2. Cursor-AI-generated code is reviewed against `QUALITY_GATES.md`, with no reduced bar relative to human-written code.
3. Both review types are logged — not as a separate audit trail, but as the same PR-review/document-approval-checklist mechanism this whole series already uses.

## Approval Process

**No document or code is "approved" by an AI declaring it so.** Every document in this series has carried an Approval Checklist with unchecked boxes awaiting a human — A-009 found that zero of eight documents have had that checklist actually run. This guide makes explicit what was already implicit: an AI's own confidence in its output (however thoroughly cross-checked against prior documents) is not approval. Approval is a human act, always.

## Prompt Standards

Every prompt in this series to date has followed a consistent shape (Read First → Mandatory Pre-Check → Project Facts → Project Context → Scope → Output Requirements → Deliverables → Quality Rules → Task) — this shape is itself now a governed standard, not an accident of habit. A prompt that skips the Mandatory Pre-Check, or that asserts a fact contradicted by existing documents (as has happened more than once in this series — the "Schema V2 Already Completed" claim in A-001, the missing A-006 in A-007 onward), should be treated the same way this series has always treated it: flagged, not silently accepted, and not silently "fixed" without surfacing the discrepancy.

## Code Generation Rules

- Cursor AI generates code only against a document whose Approval Status is **Approved**, not Draft — per this guide's Approval Process above, this currently applies to none of A-001–A-009, which is a deliberate, correct consequence of this governance model, not an oversight.
- Generated code must cite which architecture document and section it implements (a traceable comment or PR description reference) — extending this series' own traceability discipline (A-009 §4) into the codebase itself.
- Generated code touching a permission boundary (`PERMISSION_MATRIX.md`) must include the corresponding negative test (`QUALITY_GATES.md` §24) in the same change — not as a follow-up.

## Ownership

| Layer | Owner |
|---|---|
| Architecture Ownership | Human stakeholders; Claude documents on their behalf, does not own the decisions |
| Documentation Ownership | Whoever maintains `ARCHITECTURE_INDEX.md` and `docs/adr/ADR_INDEX.md` — currently a human/AI collaboration with the human holding final say |
| Implementation Ownership | Human engineering team; Cursor AI is a tool within that ownership, not an independent owner |
