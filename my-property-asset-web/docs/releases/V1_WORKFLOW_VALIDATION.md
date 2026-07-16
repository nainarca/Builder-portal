# V1 Business Workflow Validation

Manual / demo validation of the six V1 scenarios.  
Automation status: checklist only (no Playwright suite in V1).

## Scenario 1 — Builder onboarding + subscription

| Step | Expected | Status |
|---|---|---|
| Super Admin creates builder | Builder record appears | PASS (demo store) |
| Activate builder | Status → active | PASS |
| Assign subscription plan | Plan admin / billing | PASS (P15) |

## Scenario 2 — Project hierarchy

| Step | Expected | Status |
|---|---|---|
| Builder login | Portal loads | PASS |
| Create project | Project created or limit prompt | PASS (enforcement + mock) |
| Create building | Building under project | PASS |
| Create units | Units under project | PASS (mock store) |

## Scenario 3 — Buyer → handover

| Step | Expected | Status |
|---|---|---|
| Assign buyer/owner | Assignment record | PASS (UI/mock) |
| Upload documents | Document draft | PASS |
| Digital handover | Handover package | PASS (UI); SQL apply BLOCKED |
| Invitation generated | Token/invitation | PASS (UI/contract) |

## Scenario 4 — Owner activation (Flutter)

| Step | Expected | Status |
|---|---|---|
| Owner accepts invitation | Flutter flow | N/A (external app) |
| Property linked | Owner app | Contract only |

## Scenario 5 — Branding → Flutter payload

| Step | Expected | Status |
|---|---|---|
| Builder updates branding | Profile saved | PASS |
| Branding API / payload | Flutter contract object | PASS |
| SA reset/disable/restore | Oversight actions | PASS |

## Scenario 6 — Communications

| Step | Expected | Status |
|---|---|---|
| Builder publishes communication | Published + deliveries prepared | PASS |
| Notification contract | Delivery payload | PASS (contract) |
| SA disable/archive | Moderation | PASS |

## Overall Workflow Verdict

| Mode | Verdict |
|---|---|
| Demo / mock | **PASS** |
| Production / live DB | **FAIL** until schema + repo wiring |
