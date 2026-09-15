# INAIARAM WEB-APP PROTOTYPE — FORENSIC AUDIT

**Date:** 6 September 2026 · **Method:** full source read (4,276 LOC across store/screens/shell/data) + live browser interaction testing of every journey
**Scope:** `/app/*` authenticated prototype + auth screens. No modifications were made during this audit.
**Status legend:** WORKING · PARTIAL · SIMULATED · VISUAL · DEAD · BROKEN · PLACEHOLDER · UNKNOWN

---

## 1. EXECUTIVE SUMMARY

The prototype is a **coherent, largely functional single-user simulation** of the InaiAram product: one fictional case (`IA-DEMO-0001`), real SHA-256 receipt chaining, working consent/shares/ledger/role gating, an honest 9-state result model, and consistently excellent product copy. The primary journeys (signup → onboarding → create → consent → mutual invitation → simulate → evidence/report → share → receipts) all complete.

However, live testing surfaced **6 genuine defects** (3 of them state-integrity bugs), one unreachable core flow (dispute), a dead nav item, and roughly 40% of the interactive surface is single-instance demo scaffolding rather than multi-case product logic. The single most dangerous defect is a **receipt-ID collision that silently drops ledger events** — in a product whose core promise is "every action is receipted."

**Health: 7/10 — strong product architecture, 5 concrete bugs to fix before it can be called complete.**

---

## 2. COMPLETE SITEMAP (as implemented)

| Route | Screen | Accessible from | Purpose | Status |
|---|---|---|---|---|
| `/` | Landing (public) | Nav, footer | Marketing site | WORKING (separate surface) |
| `/signup` | Create account | Landing "Start Verification" CTAs ×5 | Signup | WORKING |
| `/login` | Log in | Landing "Log in", signup link, logout redirect | Login | WORKING |
| `/onboarding` | 3-slide onboarding | Auto after signup/login | Philosophy + path choice | WORKING |
| `/app` | Overview dashboard | Sidebar "Overview", onboarding enter | Attention-first home | WORKING |
| `/app/verifications` | Verifications list | Sidebar | Case list | WORKING (single case only) |
| `/app/verifications/:id` | Verification detail | List card, dashboard, breadcrumbs | Case detail | WORKING |
| `/app/verifications/:id/evidence` | Evidence thread | Detail "Evidence thread" btn, sidebar Evidence | 7-node chain viewer | WORKING |
| `/app/verifications/:id/report` | Report | Detail "Report" btn, deep link | Evidence document | WORKING |
| `/app/verifications/:id/*` (other) | — | — | Redirects to detail | WORKING |
| `/app/new-verification` | Scope wizard (5 steps) | Empty states, onboarding-path users (no sidebar/nav link!) | Create case | WORKING but **UNLINKED from shell nav** |
| `/app/trust` | Trust Profile | Sidebar | Role-switchable summary | WORKING |
| `/app/evidence` | Evidence (top-level) | Sidebar | Same component as nested | WORKING (duplicate route) |
| `/app/reports` | — | Sidebar "Reports" | **Silent redirect** → `/app/verifications` | DEAD NAV ITEM |
| `/app/reports/:id` | Report | Deep link only | Same as nested report | WORKING |
| `/app/consent` | Consent centre | Sidebar "Consent & Privacy", dashboard, privacy link | Per-category consent | WORKING |
| `/app/privacy` | Grants/Shares/Ledger | Sidebar "Grants, Shares & Ledger", dashboard, user menu | Privacy center | WORKING |
| `/app/invitations/:id` | Invitation | Consent CTA, dashboard attention, mutual gate | Send/track/simulate invite | WORKING |
| `/app/account` | Account | User menu, sidebar | Profile + controls | WORKING |
| `/app/*` (unknown) | — | — | Redirect → `/app` | WORKING |
| `/demo/*` | — | — | Redirect → `/app` (legacy) | WORKING |
| `*` (unknown public) | — | — | Redirect → `/` | WORKING |

**States Reference screen (9 result states + coverage): DOES NOT EXIST.** Spec required it; the only traces are `en.states.*` copy shown in an optional `StateChip` expansion (used in exactly one place — Evidence screen header).

### Navigation graph (actual)

```text
LANDING ──Start Verification──▶ SIGNUP ──▶ ONBOARDING (3 slides) ──Enter──▶ DASHBOARD
   └──Log in──▶ LOGIN ────────────────────────┘                        │
                                                                       │
DASHBOARD ├─(no case)──▶ EmptyState ──Start──▶ NEW VERIFICATION ◀── (ONLY entry: empty states)
          │                                              │
          │   1.Who → 2.Categories → 3.Can/Cannot → 4.Confirm → 5.Created
          │                                              │
          │        myself ──▶ /app/consent   other ──▶ /app/verifications/IA-DEMO-0001
          │
          ├─(case exists)─▶ Attention items ──▶ consent | detail | invitation | privacy
          ├─ ACTIVE VERIFICATION card ──▶ Details | Evidence
          ├─ Recent activity (last 3 receipts, read-only) ──▶ Consent ledger
          └─ Simulation controls ──▶ Advance | Invitation pending | Send invitation

VERIFICATION DETAIL ──▶ Evidence thread │ Report │ Manage consent(→privacy)
       │  category rows (expand) ─▶ ClaimDisclosure + EvidenceItems (+DisputeEntry if primary=conflicting)
       │  Coverage section (expandable jurisdiction list)
       └─ Simulation Reset / Advance

SIDEBAR: Overview · Verifications · Trust Profile · Evidence · Reports(→redirect, dead)
         · Consent & Privacy · Grants, Shares & Ledger · Account
USER MENU: Account · Consent & Privacy · Log out
```

---

## 3–4. SCREEN-BY-SCREEN FORENSIC INVENTORY + BUTTON FORENSICS

### SCR-001 `/signup` — Signup
**Role:** public. **Reached:** 5 landing CTAs. **Layout:** centered card, emblem, 3 fields, honest footer.
**Form:** NAME (required ≥2 chars), EMAIL (regex), PHONE (optional, `[\d\s+()-]{6,15}`). Validation live-on-submit; `role="alert"` errors; 700 ms simulated delay; then SIGNUP + navigate `/onboarding`.

| # | Control | Actual behaviour | Persistence | Status |
|---|---|---|---|---|
| B-01 | NAME / EMAIL / PHONE inputs | Controlled inputs, `aria-invalid` + `aria-describedby` wired | — | WORKING |
| B-02 | "Continue to onboarding" | Validates → sim delay → SIGNUP → `/onboarding`. Blank submit: 2 errors shown (verified). Creates `user{onboarded:false}`; **wipes any previous case? No — SIGNUP only replaces `user`, case stays** | Persists via localStorage | WORKING |
| B-03 | "Log in" link | → `/login` | — | WORKING |
| — | `failed` ErrorBar | State exists; **nothing ever sets it true** | — | DEAD CODE |

### SCR-002 `/login` — Login
| # | Control | Actual behaviour | Status |
|---|---|---|---|
| B-04 | EMAIL/PASSWORD | Any well-formed pair accepted; honest prototype note | WORKING |
| B-05 | "Log in" submit | LOGIN → `/onboarding`. **Bug L-1: LOGIN resets `onboarded:false`, so returning users are forced through onboarding again every login** | WORKING/FLAW |
| B-06 | "Forgot access?" | Sets error text explaining recovery not configured | WORKING (honest) |
| B-07 | "Create an account" | → `/signup` | WORKING |

### SCR-003 `/onboarding`
| # | Control | Actual behaviour | Status |
|---|---|---|---|
| B-08 | Next / Back | Steps 0→1→2, progress bars `i<=step` | WORKING |
| B-09 | Path radios (verify-self / someone / invited) | Select-only; `aria-checked` correct; **path is stored but NEVER used by any logic** (no branch anywhere reads `user.path`) | WORKING / data unused |
| B-10 | "Enter workspace" | Disabled until selection (verified); COMPLETE_ONBOARDING → `/app` | WORKING |

### SCR-004 `/app` — Dashboard
**Layout:** greeting header + primary action → NEEDS YOUR ATTENTION list → ACTIVE VERIFICATION card (status pill, per-category chips, findings count, Details/Evidence) → RECENT ACTIVITY (last 3 receipts) → simulation panel.
**Attention engine (verified):** consent-needed → conflicting/clarification claims → invitation sent/declined → in-progress → active/expired shares, priority-sorted. **Sidebar Overview badge shows live count (observed "2" with consent + conflict present).**

| # | Control | Actual behaviour | Status |
|---|---|---|---|
| B-11 | "Start a verification" (header + empty state) | → `/app/new-verification` | WORKING |
| B-12 | "Open verification" | → detail | WORKING |
| B-13 | Attention cards (whole card = Link) | Navigate per `item.to`; verified: "Employment: sources conflict" appears when conflict exists | WORKING |
| B-14 | "Details" / "Evidence" | → detail / **BUG N-1: `/app/evidence` top-level route renders Evidence screen for the default case — works only because single-case; uses non-nested route while detail page uses nested** | WORKING (fragile) |
| B-15 | "Advance verification" | ADVANCE_SIMULATION; disabled when `mutual && !mutualReleased` or phase 5 (verified both) | WORKING |
| B-16 | "Invitation pending" / "Send invitation" | → `/app/invitations/INV-001` | WORKING |
| B-17 | "Consent ledger →" | → `/app/privacy` | WORKING |
| — | Consent summary line | `complete / decided / pending for some categories` — logic verified correct | WORKING |
| — | StatusPill | awaiting-consent/awaiting-participant/in-progress/complete/draft | WORKING |
| — | Per-category chips on dashboard | `StateChip` directly — **BUG C-1: dashboard uses raw `StateChip state={claim?.certainty ?? 'requiresConsent'}`, so granted-but-not-started categories show canonical "Requires consent" here while the detail page correctly shows internal "Not started yet" — inconsistent with the fix applied to detail** | FLAW |

### SCR-005 `/app/new-verification` — Wizard
**Reachability problem N-2: no sidebar/nav link exists.** Reachable only via empty states or the dashboard header button. A user with an existing case can only create another case by... nothing (header switches to "Open verification"). Direct URL still works.

| Step | Contents | Controls | Status |
|---|---|---|---|
| 1 Who | Myself / Someone else + name input | `aria-pressed`; Continue disabled until valid (verified) | WORKING |
| 2 Categories | 8 pillar cards + health notice | Toggle; Continue shows count "Continue (3 selected)" (verified) | WORKING |
| 3 Can/cannot | WHAT WILL BE CHECKED / NEEDS PARTICIPATION / OUT OF REACH REGARDLESS | Continue | WORKING |
| 4 Confirm | Summary grid + before-you-begin list + mutual checkbox (only when "other") | Create verification | WORKING — **but step-4 "Mode" line shows `mode` state that is only set by the checkbox; selecting mutual here is fine, yet the checkbox label and the confirm row can disagree if user goes Back after toggling (minor)** |
| 5 Created | Success + "Start another" (resets wizard) / "Continue" → `create()` | myself → mutual mode forced; other → checkbox decides | WORKING |
| — | `create()` | CREATE_CASE (fresh case replaces old **without confirmation** — data loss of prior case receipts/shares) → navigate | WORKING / RISK |

### SCR-006 `/app/verifications` — List
| # | Control | Behaviour | Status |
|---|---|---|---|
| B-18 | Case card (whole Link) | → detail; shows mode/id/name/shares count | WORKING (single case only) |

### SCR-007 `/app/verifications/:id` — Detail
| # | Control | Behaviour | Status |
|---|---|---|---|
| B-19 | Breadcrumb "Verifications" | SPA Link (no reload) | WORKING |
| B-20 | Category row (whole button) | Expand/collapse `openPillar`; chevron rotates | WORKING |
| B-21 | ClaimDisclosure "View evidence and coverage" | Disclosure with EvidenceChain | WORKING |
| B-22 | "Evidence thread" / "Report" / "Manage consent" | → nested evidence / nested report / `/app/privacy` | WORKING |
| B-23 | "Show/Hide jurisdiction detail" | `aria-expanded` toggle; renders 8-jurisdiction list from `sampleCase.coverage` (static for all cases) | WORKING |
| B-24 | Reset (simulation) | RESET_SIMULATION — findings cleared, **consent kept (by design, copy says "Simulation reset")** | WORKING |
| B-25 | Advance | disabled at phase 5 or mutual-not-released (verified) | WORKING |
| B-26 | DisputeEntry "Dispute this finding" | Renders **only when the row's PRIMARY claim is `conflicting`**. Verified: with employment in scope, `employment-dates` (conflicting) is the SECONDARY claim → **button never renders; dispute unreachable for the case's only conflicting finding** (see §7 Journey F) | BROKEN (placement) |
| B-27 | Dispute form: reason input, context textarea, Cancel, Submit | Submit disabled <4 chars; dispatches SUBMIT_DISPUTE + toast; verified reachable only in principle — **could not render it live because primary-claim condition never true in any reachable scope** | PARTIAL |
| — | Not-found state | `/app/verifications/IA-DEMO-9999` → "Verification not found" + back link (verified) | WORKING |
| — | CategoryStateChip | granted-not-started → "Not started yet"; declined → "Requires consent" (verified both) | WORKING |

### SCR-008 `/app/.../evidence` (+ `/app/evidence`) — Evidence
| # | Control | Behaviour | Status |
|---|---|---|---|
| B-28 | Claim selector nav | One button per scoped pillar w/ StateChip; `aria-current`; resets claimIdx | WORKING |
| B-29 | EvidenceChain (7 nodes) | Verified: full 7-node path for Identity; **legal claim shows 2 "not applicable to this claim" nodes** (corroboration+result skipped, path from sample data) — per-claim paths genuinely differ | WORKING |
| B-30 | StateChip `showInfo` | Only here; expands meaning + does-not-mean panel | WORKING |
| B-31 | EvidenceItems | Per-evidence cards with hash + retrieved date + reasoning + demo disclaimer | WORKING |
| — | Role awareness | Subtitle says "as seen by the {role} view" but **the chain content is NOT filtered by role — evidence values render for any demoViewRole** (see §7 Journey D finding) | PARTIAL |

### SCR-009 Report (nested + `/app/reports/:id`)
| # | Control | Behaviour | Status |
|---|---|---|---|
| — | Not-ready empty state | phase<5 → "Verification is still in progress" + stage count + link out | WORKING |
| B-32 | Claim accordion rows | Expand/collapse; chevron rotates | WORKING |
| B-33 | "Share…" (subject only) | → `/app/privacy` | WORKING |
| — | Role gating | Verified: partner w/o active values-share sees "This finding has not been shared with you at value level…" per claim; family sees "Detailed values are not shown in the family view"; subject sees full detail grid | WORKING |
| — | "WHAT WE COULD NOT ESTABLISH" | 2 hardcoded items always shown | WORKING (static) |
| — | SAMPLE watermark | 4%-opacity rotated mono text; honest | WORKING |
| — | Download | None exists; copy explicitly says prototype does not generate files | WORKING (honest) |
| — | Breadcrumb "Reports" | → `/app/reports` → **redirect to verifications** (breadcrumb label lies) | FLAW |

### SCR-010 `/app/trust` — Trust Profile
| # | Control | Behaviour | Status |
|---|---|---|---|
| B-34 | RoleSwitcher (subject/partner/family) | radiogroup; dispatches SET_DEMO_ROLE; persists in store | WORKING |
| — | Subject rows | Full claim values (verified) | WORKING |
| — | Partner rows | Verified: Identity row showed the actual value (share active); Education/legal "Not shared with you" | WORKING — genuinely derived from grants |
| — | Family rows | Verified: "Status shown — value not shown in this view" for all | WORKING |
| — | Health row | Always present, candidateControlled chip, "Planned module" | WORKING |
| — | Role note footer | Correct per-role explanation | WORKING |
| — | **Bug C-2:** chip uses `claim?.certainty ?? 'requiresConsent'` even when the row text says "Not shared with you" — a non-shared category still displays its true state chip (Verified/No-match) to partner/family. Status leaks even where values are correctly hidden | PARTIAL |

### SCR-011 `/app/consent` — Consent centre
| # | Control | Behaviour | Status |
|---|---|---|---|
| B-35 | Grant (per pillar) | GRANT_CONSENT + toast; card border → sage; badge "Granted"; buttons swap to Withdraw | WORKING |
| B-36 | Decline (pending only) | DECLINE_CONSENT + toast; never reported as failed (copy verified) | WORKING |
| B-37 | Withdraw (granted only) | WITHDRAW_CONSENT + toast; card → taupe; **verified: share on that pillar auto-revokes; badge "— Withdrawn"; BUT see §13 — receipt often silently dropped by ID collision** | WORKING/BUG |
| B-38 | "Grant all" | Loops GRANT_CONSENT for all pending (verified — creates N receipts in one go; each gets unique id only if counter in sync) | WORKING |
| B-39 | "Send or track the invitation" | Only when mutual & invite not accepted | WORKING |
| B-40 | "Begin verification" | **BUG G-1: renders in mutual mode when `invitation==null` (path: mutual checkbox but wizard routes to detail before invitation UI seen; or invitation reset). Clicking it ADVANCES the simulation without the other side having participated — violates both-or-neither. Observed: simPhase 0→1 with no invitation in store** | BROKEN (gate hole) |
| — | Nothing-authorised state | all declined → honest "valid choice" panel + Back to overview (verified present) | WORKING |
| — | MutualGate | Shows your-side/their-side status; release locked/unlocked | WORKING |

### SCR-012 `/app/privacy` — Consent & Privacy center
| # | Control | Behaviour | Status |
|---|---|---|---|
| B-41 | "Manage consent →" | → `/app/consent` | WORKING |
| B-42 | "Create a share" (header + empty state) | Opens ShareDialog | WORKING |
| B-43 | ShareDialog: category select (granted only) / accessor toggle / granularity (partner only) / 1–30 day slider / Cancel | Family forces status-only (choice removed, verified); zero-consent state verified | WORKING |
| B-44 | "Review before sharing" | 2nd step: What/Whom/Why/How-long review rows (verified content) | WORKING |
| B-45 | "Share it" | CREATE_SHARE + toast + close; verified card appears w/ active badge | WORKING |
| B-46 | "Revoke" (active shares) | REVOKE_SHARE + toast; badge → revoked; verified | WORKING |
| B-47 | "Simulate their access →" | RECORD_ACCESS on active partner share; verified receipt lands in ledger ("Information accessed", actor Partner) | WORKING |
| B-48 | "Verify receipt chain" | Real `verifyLedger` — re-hashes + checks linkage; verified valid → sage banner | WORKING (real) |
| B-49 | "See what tampering looks like" | Arms tamper (flips 1 char); verified | WORKING |
| B-50 | "Re-verify after tampering" | Verified: terracotta "Chain verification failed" banner | WORKING |
| B-51 | "Request" (data rights) | Toast only | SIMULATED |
| B-52 | "Open verification" (dispute row) | → detail (dispute is there — but see B-26) | WORKING |
| B-53 | "Delete…" → Dialog → "Delete everything" | DELETE_ACCOUNT + hard redirect `/`; verified wipes user+case | WORKING |
| — | Grants list | Verified: Granted/Withdrawn/Requires-consent badges; withdrawn shows "No grant on record" subline | WORKING |
| — | Past-shares note | "N revoked · N expired shares listed above" | WORKING |

### SCR-013 `/app/invitations/:id` — Invitation
| # | Control | Behaviour | Status |
|---|---|---|---|
| B-54 | Recipient name input | Pre-filled from invitation | WORKING |
| B-55 | Language EN/हिन्दी/தமிழ் | Switches template; "pending native-speaker review" caveat present (verified) | WORKING |
| B-56 | "Send invitation" | SEND_INVITATION → status sent, receipt, badge "Awaiting response" (verified) | WORKING |
| B-57 | "Copy text" | `navigator.clipboard` + toast; **no clipboard-permission fallback (may silently fail on http)** | PARTIAL |
| B-58 | "Simulate: they accept" | accept → mutual-release receipts ×2 → auto-navigate to detail (verified, 900 ms) | WORKING |
| B-59 | "Simulate: they decline" | decline → honest copy; invite-again path | WORKING |
| B-60 | "Invite again" | RESET_INVITATION → draft (verified code) | WORKING |
| B-61 | "Open verification" (accepted state) | → detail | WORKING |
| — | Expired status | Badge map has `expired` but **nothing ever sets invitation.status='expired'**; expiry copy is prose-only | PLACEHOLDER |

### SCR-014 `/app/account`
| # | Control | Behaviour | Status |
|---|---|---|---|
| B-62 | "Open case" | → detail | WORKING |
| B-63 | "Open" (privacy) | → `/app/privacy` | WORKING |
| B-64 | "Delete…" | **No confirm dialog here (unlike privacy screen) — single click wipes everything** | FLAW |
| B-65 | "Sign out" | LOGOUT → navigate('/') — observed lands `/login` via guard; **wipes case too (see §6)** | WORKING/FLAW |

### Global chrome
| # | Control | Behaviour | Status |
|---|---|---|---|
| B-66 | Sidebar NavItems ×8 | NavLink active states; Overview badge = attention count | WORKING ("Reports" dead — see N-3) |
| B-67 | Theme toggle | data-theme light/dark, persists (verified) | WORKING |
| B-68 | User avatar menu | Outside-click close; Account/Consent/Logout | WORKING |
| B-69 | Hamburger → Drawer | Scroll locks; Escape/backdrop/close-btn all close; verified unlock | WORKING |
| B-70 | Footer "About InaiAram ↗" | → `/` | WORKING |

---

## 5. NAVIGATION AUDIT (matrix of findings)

| From | Interaction | To | Expected? | Result |
|---|---|---|---|---|
| Sidebar "Reports" | click | `/app/verifications` | NO | **N-3 DEAD ITEM** — silently redirects; nav label promises a Reports screen that does not exist |
| Sidebar "Evidence" | click | `/app/evidence` | ~ | Renders evidence of THE case (no :id) — only works because single-case |
| Dashboard Evidence btn | click | `/app/evidence` | ~ | same |
| Report breadcrumb "Reports" | click | verifications (via redirect) | NO | misleading |
| Any screen | browser Back | previous route | Y | React Router natural behaviour; scroll restored to top by ScrollToTop (verified) |
| Logout → Back button | back | `/app` | should redirect | guard redirects to `/login` (verified) |
| Deep link `/app/reports/IA-DEMO-0001` | direct | report | Y | WORKING (verified) |
| Deep link bad id | direct | not-found state | Y | WORKING (verified) |
| `/demo/*` legacy | direct | `/app` | Y | WORKING |
| Wizard | after case exists | — | — | **N-2: no nav path to wizard once a case exists** |
| Consent (mutual, invite=null) | Begin verification | advances sim | NO | **G-1 gate hole** |
| Login (returning user) | submit | `/onboarding` | NO | **L-1: forced re-onboarding** |

**No duplicate shells** — old `AppShell`/demo pages survive as orphaned files (see §26) but are not routed.

---

## 6. COMPLETE USER-JOURNEY TRACES (executed live)

**A — New user:** Landing "Start Verification" → signup (blank submit → 2 errors; valid → 700 ms → onboarding) → 3 slides (path radios; Enter disabled until chosen — verified) → dashboard. ✅ COMPLETE. Note: dashboard greeted "Good morning, Test" from signup name; after later login it showed "A." from the hardcoded LOGIN name — **two different name sources**.

**B — Invited person:** Only the *initiator* side exists. The "I was invited" onboarding path leads to the same dashboard with no pending invitation to accept — **the invited person's journey is not implemented** (no second-account view, no invite-redemption screen). The invitation screen simulates the *other side's response* from the initiator's chair. Status: MISSING BY DESIGN GAP.

**C — Subject:** Dashboard → detail → evidence (chain + items) → consent (grant/decline/withdraw all verified) → privacy (share → simulate access → receipt verified in ledger; revoke verified; chain verify + tamper verified). ✅ COMPLETE except withdrawal-receipt drops (§13).

**D — Partner:** Via RoleSwitcher (there is no separate partner login). Verified: with an active status-and-values share on Identity, partner sees the Identity value; without shares, every value hides ("Not shared with you"); report expansions show not-shared messages. **Gaps:** (1) Evidence screen shows full chain values regardless of role; (2) Trust Profile chips leak true state on unshared rows (C-2); (3) role is a demo toggle, not an account boundary — acceptable for prototype but must not be mistaken for enforcement.

**E — Family:** Verified: all rows "Status shown — value not shown in this view"; family share creation forces status-only at UI **and** reducer level; family access simulation produces receipt. ✅ Strongest-implemented role.

**F — Dispute:** **FAILS.** DisputeEntry renders only when a row's *primary* claim is `conflicting`. The only conflicting claim in the data model (`employment-dates`) is always the *secondary* claim of the Employment pillar → the dispute UI is unreachable in every reachable configuration (verified twice with two different scopes). The reducer + form + receipt action all exist and would work; the entry point is dead. Dashboard still surfaces "Employment: sources conflict" — so the user is told to act on a finding they cannot dispute.

**G — Withdrawal:** Consent Withdraw verified: state → withdrawn, Grant returns, related share auto-revoked, share badge → revoked. Ledger receipt: present only when receipt-ID counter is in sync (§13).

**H — Expiry:** `shareStatus()` computes expired vs PROTO_NOW. Verified via direct store manipulation (share date set to past → reload → badge "revoked/expired" logic and access-sim button correctly absent; footer counts updated). **No natural in-UI path reaches expiry** because the clock is frozen — expiry is code-real, demo-invisible.

---

## 7. ROLE & PERMISSION AUDIT

| Role | Screen | Can see | Cannot see | Can do | Verified |
|---|---|---|---|---|---|
| Subject | everything | own values, all controls | — | everything | ✅ |
| Partner (switcher) | trust/report | values ONLY where active partner status-and-values share | everything else | view-only | ✅ values / ⚠️ chips leak (C-2) / ❌ evidence screen unfiltered |
| Family (switcher) | trust/report | status only | all values (hard-blocked in report/trust; forced status-only shares at reducer) | view-only | ✅ |
| "Reviewer/admin" | — | — | — | — | DOES NOT EXIST |

**Direct-URL probes:** `/app/verifications/IA-DEMO-9999` → not-found ✅; unauthenticated `/app` → `/login` ✅; after logout, back to `/app` → `/login` ✅. Role boundary is a UI filter, not real authz — appropriate for prototype, and labelled as demo views.

---

## 8. CONSENT AUDIT

Per-pillar records with states `pending/granted/declined/withdrawn` (verified all four reachable). Consent occurs before any search (sim refuses to advance claims for non-granted pillars — verified in reducer). Withdrawal = one action, no reason, ends shares, attempts ledger event. Expiry of *consent* itself: **not implemented** (no expiry field on ConsentRecord) — shares expire, consent does not; the spec's "access expires" is satisfied only at share level.

**Contradiction check:** "No consent → no private result shown" holds in every observed surface EXCEPT the two chip-level leaks (dashboard C-1 mislabel; trust C-2 state leak) — neither exposes values, but both expose *state semantics* inconsistently.

---

## 9. EVIDENCE THREAD AUDIT

All 7 nodes implemented as a vertical chain; node order constant; per-claim `pathsThroughThread` genuinely varies (verified: legal claim renders 2 "not applicable" nodes). Node data populated for claim/source/identityMatch/coverage/result; corroboration and humanReview render fixed prose. Evidence items carry artifact hashes (`sha256:xxxx…xxxx` — illustrative, labelled). Established/expiry dates shown at Result. "What this does not mean" appears at Result node and again below the chain. Mobile: vertical by construction.

**Not role-filtered (D-gap), and `EvidenceChain` inside `ClaimDisclosure` has no `mode="progress"` caller anywhere — the "progress" variant is dead code.**

---

## 10. RESULT-STATE AUDIT

All 9 canonical states exist in `en.states` with label + description + doesNotMean, and `StateChip` renders each with distinct colour+glyph (no colour-only coding). Verified live: Verified ✓, Supported ◑, No matching record ○, Conflicting ⇄, Requires consent 🔑, Under review ◷, Candidate-controlled 🔒 (health row). Requires-clarification: reachable mid-simulation (legal pillar phases <4) — exists. Unavailable: **defined but nothing ever produces it** — no claim in the model ever settles to `unavailable`.

Coverage: Searched/Partial/Not-searched with reasons — implemented in detail-page coverage list and `CoverageIndicator` (with tooltip), coloured sage/gold/taupe.

Internal state "Not started yet" (ProgressChip) correctly distinguished from canonical "Requires consent" on detail page — but dashboard (C-1) doesn't use it.

No person-level scores anywhere; "no matching record" copy consistently carries "not a clean record" guard. ✅

---

## 11. DATA AUDIT

| Category | Content | Nature |
|---|---|---|
| User | name/email from signup; LOGIN hardcodes "A. Meera Krishnan" | localStorage-persisted |
| Case | IA-DEMO-0001, mode, scope, status, simPhase | simulated + persisted |
| Consents | per-pillar states + timestamps | persisted |
| Claims | from `sampleCase` (8 claims) + generated INCOME_CLAIM + placeholders | static fictional, labelled |
| Receipts | real SHA-256 chain (Web Crypto), ids AR-### | computed, persisted |
| Shares | id SH-####, purpose string, granularity, expiry | persisted |
| Invitation | INV-001 fixed id, 3 languages | persisted |
| Disputes | DP-#### | persisted (unreachable UI) |
| Identity data | "DOB 14 March 1998" etc. — fictional; identity pillar explicitly says only salted hash retained, and prototype shows no document numbers | ✅ safe |
| Health | "Planned module" candidate-controlled row only; no labs, no panels, no values | ✅ honest |
| Statistics | zero public stats; sample-case numbers (17 sources, 6/8 jurisdictions, 2–4 yr band) appear ONLY in fiction-labelled contexts | ✅ |
| Dates | single frozen clock PROTO_NOW=2026-06-20T10:00 IST, 17 usages — demo never drifts | ✅ |
| Sources | "Government identity registry", "EPFO payroll records", "MCA", "NAD" — real institution *types* inside fictional data, welded "Illustrative demonstration data — not a live provider connection" disclaimers | ⚠️ acceptable, monitor |
| Legal claims | "DPDP"/"certified"/"guaranteed" — none present | ✅ |

---

## 12. SAMPLE-DATA CONSISTENCY

Verified consistent across surfaces: case id, subject name (within a session), mode, scope, status pill vs chips, evidence = claims, consent chips vs store, receipt count vs ledger.

**Inconsistencies found:**
1. **Login name vs signup name:** LOGIN hardcodes "A. Meera Krishnan" regardless of the account created — signup as "Test Person", log in, and the workspace greets a different person while Account shows the signup email with the hardcoded name.
2. **Subject identity:** detail header shows `subjectName` ("Arun Krishnan" when verifying someone else) while every claim's value text still describes Meera ("A. Meera Krishnan, DOB 14 March 1998…") and Trust Profile/report render Meera's data under Arun's case header — the fictional person and the case subject can visibly diverge.
3. `sampleCase.summary` (sourcesReviewed: 17, etc.) is defined but rendered nowhere — the "17 sources" figure exists only in data, currently harmless.
4. Coverage jurisdiction list is static sampleCase data regardless of scope chosen (shows marriage-registration/MCA rows even when those pillars aren't in scope).
5. Report "could not establish" items are the same two strings for every scope.

---

## 13. CONSENT LEDGER / ACCESS RECEIPTS — with the critical defect

Receipt cards: actor / purpose / scope / expiry / position "N of M" / truncated sha256 + prev-hash / "Chain origin" marker. Readable, glanceable, per spec. Chain verification is REAL (re-hash + linkage + tamper demo all verified live).

### 🔴 DEFECT R-1: receipt-ID collision silently drops ledger events
`nextReceiptId()` uses a module-level counter starting at 100. It resets on every full page reload while old receipts persist in localStorage. `appendReceipt()` dedupes by id — so a new receipt that collides with an existing id is **silently discarded**. Observed live: 3 consent actions (2× withdraw, 1× grant) changed state with receipts.length stuck at 15; later actions (after ids advanced past the collision zone) appended fine. Consequences: (a) the ledger — the product's core trust artifact — can silently miss events; (b) the hash chain "verifies valid" over an incomplete history, i.e. verification proves integrity of what's there, not completeness; (c) ids in store are non-monotonic (observed AR-2V…AR-3I…AR-2U…AR-36). Fix direction (not applied, per audit rules): persist the counter in the store, or derive next id from max existing.

Related: `receiptCounter` also makes receipts added in the same render batch race-prone (GRANT_ALL loops dispatches) — the dedupe mask makes this worse.

### Ledger behaviour verified otherwise
Grant → receipt ✅ (when ids healthy) · Access → "Information accessed" receipt ✅ · Revoke → state + badge ✅ (receipt subject to R-1) · Withdraw → share auto-revoked ✅ (receipt subject to R-1) · Tamper → detected ✅.

---

## 14. SHARING AUDIT

Per-pillar, purpose-bound (single fixed purpose "Matrimonial evaluation"), granularity two-level, expiry 1–30 days slider, revocable, receipted, visible. Family status-only enforced in UI (choice removed) **and** reducer. No "share everything" surface exists — creation is per-pillar by construction. Purpose is a hardcoded constant (not user-editable) — acceptable prototype simplification, worth noting.

---

## 15. REPORT AUDIT

Gated at simPhase≥5 with honest in-progress empty state. Findings with source/established/expires/consent/coverage/does-not-mean per claim. Mandatory "WHAT WE COULD NOT ESTABLISH" section present (static 2 items). SAMPLE watermark. Explicit no-download copy. Share… routes to privacy (correct, sharing happens there). No certificate language anywhere. Role-gated expansion verified (partner-without-share and family both get honest explanatory text). ✅ EXCEPT breadcrumb/dead "Reports" nav (N-3) and static limitation list.

---

## 16. FORMS INVENTORY

| Form | Fields | Validation | Errors | Submission | Persistence |
|---|---|---|---|---|---|
| Signup | name*, email*, phone opt | regex + length, on submit | inline role=alert (verified blank-submit) | sim 700 ms → state | user persisted |
| Login | email*, password* | regex + length ≥4 | single ErrorBar | sim 700 ms → state | user persisted |
| Wizard step 1 | subject name (when "other") | ≥2 chars gates Continue | button-disabled only | — | case |
| Share dialog | select/buttons/slider | none needed | — | review step then create | case |
| Dispute | reason* (≥4), context opt | button-disabled | none shown | dispatch + toast | case (unreachable UI) |
| Invitation | recipient name | none (fallback to existing) | none | send | case |

No date pickers, no search/filter/sort/pagination anywhere. Phone field collected but never displayed (Account says "Not collected in this prototype" — **minor contradiction**: it IS collected at signup).

---

## 17. MODALS / DRAWERS / OVERLAYS

| Overlay | Trigger | Close paths | Focus | Verified |
|---|---|---|---|---|
| ShareDialog | Create a share | backdrop / Escape / X / Cancel | trap + restore; body scroll locked only while open (post-fix) | ✅ |
| Delete Dialog (privacy) | Delete… | same | same | ✅ |
| Drawer (mobile nav) | hamburger <lg | backdrop / Escape / X / route change | same; verified scroll lock/unlock cycle | ✅ |
| User menu | avatar | outside-click / item click | simple popup, no trap (acceptable) | ✅ |
| Toasts | actions | auto-dismiss | aria-live polite container | ✅ |

Note: account-screen Delete has **no** dialog (B-64) — inconsistent with privacy-screen delete.

---

## 18. RESPONSIVE AUDIT

Verified dynamically at 807px preview width (no horizontal overflow, zero edge offenders, footers reachable) on all 14 screens; static analysis confirms: sidebar `hidden lg:flex` (248px), drawer max-w-320, containers max-w-[1100px], no `w-screen`, no fixed-width content tables, evidence chain vertical by construction, wizard grids collapse `grid-cols-1 sm:grid-cols-2`. Attention rows hide CTA text on xs (`hidden sm:inline`).**Not directly rendered at 375/390/430 in this audit session** (preview viewport constraint) — classified: UNKNOWN at exact mobile widths; structural risk low.

---

## 19. ACCESSIBILITY AUDIT (concrete)

**Passes:** semantic landmarks (nav/main/footer/aside), h1 per screen, radiogroups with aria-checked, aria-expanded on all disclosures/toggles, aria-invalid+describedby on form errors, role=alert errors, aria-live toasts, labelled icon buttons (theme/nav/menu/close), Tooltip role=tooltip, focus-visible outline token + Button outline classes, focus trap + restore in Dialog/Drawer, Escape handling, skip… — **NO skip link exists in the app shell** (public landing has `#main-content` skip; AppShell main has the id but no skip link points at it), reduced-motion global media query present, state chips use glyph+text+colour (not colour alone), 36–44px class touch targets on primary controls (w-9 h-9 = 36px on theme/menu buttons — borderline).

**Concrete failures:** (1) missing skip-to-content link in AppShell; (2) 36px icon buttons below 44px guidance; (3) select in ShareDialog is a native select styled minimally — fine, but no aria-label beyond the label element (labelled via htmlFor — actually OK); (4) whole-card Links in attention list contain no visually-underlined affordance on mobile (CTA text hidden) — keyboard users still fine, discoverability reduced; (5) status communicated via toasts only for several actions (withdraw with toast failed → user could miss it).

---

## 20. ANIMATION AUDIT

Inventory: NavItem/Button/tab hover transitions (150 ms), consent card border-colour transitions, disclosure chevron rotate-180, progress-bar colour transitions in onboarding, theme transition via CSS, Drawer mount/unmount (no transition — appears instantly), toasts (aria-live, no fancy motion), skeleton component exists but **no screen ever shows it** (all data synchronous). No scroll-triggered animations in the app surface (viewport-trigger rule satisfied by absence). No counters/graphs. No animation observed to start early, repeat, or obscure content. **Verdict: restrained, appropriate; the only gap is Drawer/Dialog lack entrance transitions (jarring vs premium target).**

---

## 21. VISUAL CONSISTENCY AUDIT

Tokens: single source (tokens.css) — bg/surface/raised/line/strong-line/ink×3/terracotta/terracotta-deep/gold/gold-soft/sage/taupe; dark theme independently defined (verified light #FAF8F4 / dark #0F0D0B body bgs). Typography: Playfair (display classes, avatar initials), Inter (UI), JetBrains Mono (label-mono/meta-mono) — consistent. Buttons: one Button component, 4 variants + sizes; StatusPill/StatusBadge/InvitationBadge/CoveragePill are **four near-identical local implementations** of the same pill (duplication, slightly different paddings/typography). Cards consistent radius-xl/border-line. Chips consistent. Focus ring consistent. Dark/light both complete (screenshot verified dark; light verified via data-theme). Minor: dashboard "Evidence" ghost button vs detail "Evidence thread" secondary button — same destination family, different labels.

---

## 22. COPY / TERMINOLOGY AUDIT

Core vocabulary used consistently: claim, source, identity match, corroboration, human review, coverage, result, certainty, finding, consent (grant/decline/withdraw), receipt, ledger, purpose-bound, time-boxed, expiry, "No matching record found within the coverage searched", "What this does not mean", "Illustrative sample", "not a live provider connection", "Prototype". Decline/withdraw framing consistently non-judgmental ("information, not a verdict" — verified in invitation + gate + attention copy).

Flags:
- "Consent & Privacy" (sidebar) vs "Grants, Shares & Ledger" (sidebar) vs page title "Consent & Privacy" on BOTH `/app/consent` and `/app/privacy` — two sidebar items, near-identical names, one title duplicated. Confusing IA.
- "Reports" nav item + "Reports" breadcrumb vs no Reports screen.
- "Verification categories" vs "Categories in this verification" vs "category/pillar" — pillar never exposed to user (good) but "category" and "pillar" both appear in code comments only; UI consistent on "category".
- Login "Forgot access?" honest text — good.
- Phone collected at signup but Account claims "Not collected in this prototype" — contradiction.
- Simulation panel on both dashboard and detail says nearly the same copy — mild repetition.

---

## 23. CAPABILITY-HONESTY AUDIT

| Implied capability | Reality | Verdict |
|---|---|---|
| Government/EPFO/MCA/NAD searches | fictional claims with welded disclaimers | SIMULATED, labelled ✅ |
| Human reviewer | prose ("named reviewer before reporting") | SIMULATED, no reviewer entity exists — labelled-ish ⚠️ |
| Encryption/security | receipt SHA-256 is real Web Crypto | REAL crypto, honest "not a production security certification" ✅ |
| Authentication | any credentials work; prototype note on screen | SIMULATED, labelled ✅ |
| Email/invitation delivery | "Send invitation (simulated)" toast | SIMULATED, labelled ✅ |
| Deletion | actually clears localStorage | REAL within scope ✅ |
| Notification/expiry timers | frozen clock; expiry computed but never fires naturally | honest-by-invisibility ⚠️ |
| Download | explicitly refused | ✅ |
| Health | planned module only | ✅ |

No "live", "instant", "guaranteed", "government-connected" language found. **The prototype is unusually honest — no violation found.**

---

## 24. SECURITY / PRIVACY AUDIT (prototype-level)

**Observed issues:** (1) R-1 ledger drop — integrity system can be silently incomplete; (2) role views are client-side display filters; the store holds everything for any "role" (prototype-acceptable, must be stated); (3) `demoViewRole` persists across reloads — you stay in Family view after refresh (by design); (4) no raw Aadhaar/document numbers anywhere ✅; (5) no sensitive data in URLs (ids only: IA-DEMO-0001/INV-001) ✅; (6) logout/delete truly clear state (verified) ✅; (7) clipboard write without fallback (minor); (8) localStorage unencrypted — prototype-fine.

**Cannot be verified from prototype:** real authz, server consent enforcement, IDOR resistance, rate limiting, session security, backup/retention, real deletion downstream. Listed as backend requirements, not observed defects.

---

## 25. ERROR / EDGE-CASE AUDIT (what the user actually sees)

| Case | Handled? | Seen |
|---|---|---|
| No case yet | ✅ | empty state + CTA on dashboard/list/consent/evidence/trust/report/privacy |
| Unknown case id | ✅ | "Verification not found" |
| Unknown invitation id | ✅ | "Invitation not found" |
| No consent granted (all declined) | ✅ | "Nothing has been authorised… valid choice" panel |
| Declined invitation | ✅ | neutral panel + invite-again |
| Expired invitation | ❌ | status defined, never occurs |
| Revoked share | ✅ | badge + no access-sim button |
| Expired share | ⚠️ | logic real, unreachable naturally (frozen clock) |
| Conflicting finding | ✅ chips/attention — ❌ dispute unreachable |
| Requires clarification | ✅ | mid-sim legal claim (observed in phases <4) |
| Unavailable source | ❌ | state defined, never produced |
| Invalid form | ✅ | inline errors |
| Loading | ⚠️ | 700 ms auth "Creating…/Signing in…" text; no skeletons used anywhere |
| Network failure | n/a | fully client-side |

---

## 26. DUPLICATION AUDIT

1. **Orphaned legacy demo surface** — `src/components/demo/*` (5 files) + `src/components/interactive/*` (4 files) + `src/routes/demo.tsx` + `src/routes/demo-app.tsx` + old `layout/AppShell.tsx`: **not imported by any routed file** (verified). Dead weight, will confuse future work. Old shell still contains its own body-scroll-lock code (the bug class fixed this session).
2. Pill implementations: StatusPill (Dashboard), StatusBadge (Verifications), InvitationBadge (Views2), CoveragePill (Verifications), plus CoverageIndicator (domain) — 5 variants of one concept.
3. Two Evidence routes (`/app/evidence` and nested) — one component, two mount points, one ignores :id.
4. Two delete buttons (privacy with dialog, account without).
5. Simulation panels (dashboard + detail) near-identical.
6. `ConsentBadge` (domain) vs grants-list badges (Views2) — same states, different markup.

---

## 27. DEAD / FAKE / PLACEHOLDER / BROKEN — the list

### DEAD
- Sidebar "Reports" item (silent redirect) — N-3
- Breadcrumb "Reports" link inside report (same redirect)
- `failed` ErrorBar in Signup (never set)
- "path" chosen in onboarding (stored, never read)
- `sampleCase.summary` (rendered nowhere)
- `CoverageIndicator` tooltip component (only CoveragePill used on detail; domain version unused in app screens — used only in… verified: not mounted anywhere in app)
- `EvidenceChain mode="progress"` variant (no caller)
- Invitation "expired" status (never set)
- `unavailable` result state (never produced)
- All of `src/components/demo/*`, `src/components/interactive/*`, `src/routes/demo*.tsx`, old `layout/AppShell.tsx` (orphaned)

### FAKE
- None found — the prototype's fakeness is consistently labelled (rare and good). Toast-only actions (data-rights Request) are labelled "(prototype)".

### PLACEHOLDER
- States Reference screen (spec'd, absent; `en.states` copy exists as orphaned content surface)
- Invitation expiry
- `unavailable` state
- Data-rights Request (toast only, labelled)

### BROKEN
- **R-1** receipt-ID collision → silent ledger event loss (store logic)
- **G-1** "Begin verification" advances simulation in mutual mode with invitation==null — bypasses both-or-neither
- **F-1** Dispute UI unreachable (renders only for primary-claim conflicts; the only conflicting claim is always secondary)
- **L-1** returning users forced through onboarding (LOGIN resets onboarded)
- **C-1** dashboard chips show "Requires consent" for granted-not-started categories (detail page fixed, dashboard not)
- **C-2** Trust Profile shows true state chip on rows whose values are hidden from partner/family

### INCOMPLETE
- Partner evidence-screen role filtering
- Invitation Copy-text clipboard fallback
- Account delete without confirmation
- Create-case replaces existing case without warning (data loss of prior demo work)

### WORKING (prototype scope)
Signup, login (as sim), onboarding, wizard, case creation, consent grant/decline/withdraw+auto-revoke, grant-all, mutual invitation send/accept/decline/re-invite, mutual gate display, simulation phases 0–5 with per-pillar claim generation, evidence chain with per-claim paths, evidence items, trust profile with grant-derived role views, report with role gating + honest limitations, share create (with review step)/revoke/simulated-access receipts, real SHA-256 chain + verify + tamper demo, ledger cards, attention engine + badge, empty/not-found states, theme system, drawer/dialog a11y (post-fix), scroll behaviour (post-fix), deep links, auth guard, logout/delete wipe.

---

## 28. BUTTON MASTER INVENTORY (condensed — full enumerations in §3–4)

| ID | Screen | Control | Action | Persistence | Status |
|---|---|---|---|---|---|
| BTN-001–003 | Signup | inputs/submit/link | SIGNUP → onboarding | yes | WORKING |
| BTN-004–007 | Login | inputs/submit/forgot/create | LOGIN → onboarding | yes | WORKING (L-1 flaw) |
| BTN-008–010 | Onboarding | Next/Back/radios/Enter | step + COMPLETE_ONBOARDING | yes | WORKING |
| BTN-011–017 | Dashboard | header CTA/attention cards/Details/Evidence/Advance/Invitation/ledger link | navigate + ADVANCE_SIMULATION | yes | WORKING (C-1 flaw on chips) |
| BTN-018–031 | Wizard | who/categories/continue×4/back×3/mutual/create-another/create | CREATE_CASE | yes | WORKING (replace-risk) |
| BTN-032–039 | Detail | breadcrumb/rows/disclosure/evidence/report/manage-consent/coverage/reset/advance | expand + navigate + sim | yes | WORKING (F-1 dispute unreachable) |
| BTN-040–046 | Dispute form | open/reason/context/cancel/submit | SUBMIT_DISPUTE + receipt | yes | UNREACHABLE (F-1) |
| BTN-047–052 | Evidence | claim selector ×N | setPillar | no (view) | WORKING |
| BTN-053–057 | Report | accordion/Share… | expand / →privacy | no | WORKING |
| BTN-058–061 | Trust | role switcher ×3 | SET_DEMO_ROLE | yes | WORKING (C-2) |
| BTN-062–072 | Consent | grant×N/decline/withdraw/grant-all/send-or-track/begin | consent actions + toasts | yes | WORKING (G-1 on Begin) |
| BTN-073–085 | Privacy | create-share/dialog controls/revoke/simulate-access/verify/tamper/re-verify/request/delete-dialog ×4 | share + ledger actions | yes | WORKING (R-1 affects receipts) |
| BTN-086–093 | Invitation | name/lang×3/send/copy/accept/decline/invite-again/open | invitation actions | yes | WORKING |
| BTN-094–098 | Account | open case/open privacy/delete/sign out | navigate + wipes | yes | WORKING (no confirm) |
| BTN-099–104 | Chrome | sidebar×8/theme/avatar-menu/logout | navigate/toggle/menu | theme yes | WORKING (Reports dead) |
| BTN-105–106 | Drawer | open/close + nav items | menu | — | WORKING |

*(~106 distinct controls; grouped where identical behaviour repeats per pillar/category.)*

---

## 29. COMPLETE SCREEN INVENTORY

| ID | Route | Screen | Role | Entry points | Exit points | Primary action | Secondary | Status |
|---|---|---|---|---|---|---|---|---|
| SCR-001 | /signup | Signup | public | landing ×5 | login, onboarding | Continue | Log in | WORKING |
| SCR-002 | /login | Login | public | landing, logout | signup, onboarding | Log in | Create account | WORKING |
| SCR-003 | /onboarding | Onboarding | auth | post-auth | /app | Enter workspace | Back/Next | WORKING |
| SCR-004 | /app | Dashboard | subject-view | sidebar, onboarding | detail/consent/privacy/invitation/wizard | context-dependent | — | WORKING |
| SCR-005 | /app/new-verification | Wizard | subject-view | empty states only | consent/detail | Create | Start another | WORKING |
| SCR-006 | /app/verifications | List | subject-view | sidebar | detail | Open case | Start (empty) | WORKING |
| SCR-007 | /app/verifications/:id | Detail | subject-view | list/dashboard/breadcrumb | evidence/report/privacy | context-dependent | sim controls | WORKING |
| SCR-008 | …/:id/evidence (+/app/evidence) | Evidence | all demo roles | detail/sidebar/dashboard | detail | select claim | — | WORKING |
| SCR-009 | …/:id/report (+/app/reports/:id) | Report | all demo roles | detail/deep-link | privacy/detail | expand | Share… | WORKING |
| SCR-010 | /app/trust | Trust Profile | all demo roles | sidebar | — | switch role | — | WORKING |
| SCR-011 | /app/consent | Consent | subject-view | sidebar/dashboard/privacy | invitation/overview | Grant (context) | Grant all | WORKING |
| SCR-012 | /app/privacy | Privacy center | subject-view | sidebar/dashboard/user-menu | consent/detail | Create share | Verify chain | WORKING |
| SCR-013 | /app/invitations/:id | Invitation | subject-view | consent/dashboard/gate | detail/overview | Send / Respond | Copy text | WORKING |
| SCR-014 | /app/account | Account | auth | sidebar/user-menu | privacy/detail | — | Sign out | WORKING |

---

## 30. INTERACTION GRAPH (actual — see §2 diagram)

Key actual-flow notes: the wizard is orphaned from nav (only empty-state entries); Reports sidebar node is a decoy; consent↔invitation↔detail form a triangle; privacy is reachable from 5 surfaces; evidence has two mount points; the graph is a tree with no orphan screens, one dead node (Reports), and one unreachable sub-flow (dispute).

---

## 31. FINAL HEALTH CHECK

### A. Actually complete
Auth simulation, onboarding, wizard, case lifecycle (create→consent→mutual→phases→complete), consent CRUD + auto-revoke, shares CRUD + receipts + family enforcement, real hash chain + verify + tamper, evidence thread with per-claim paths, trust profile with grant-derived roles, gated report, attention dashboard with live badge, invitations incl. decline/re-invite, account controls, empty/not-found/error states, theme system, responsive structure, a11y baseline (post-scroll-fix), honesty labelling throughout.

### B. Partially complete
Dispute (backend of flow done, entry unreachable), partner role (values gated, chips + evidence screen leak), invitation expiry (status exists, never fires), Unavailable state (defined, never produced), coverage view (static regardless of scope), report limitations (static), loading states (text only, skeletons unused), clipboard copy (no fallback), beginning-verification gate (G-1 hole).

### C. Broken (repro)
1. **R-1:** create case → several actions → reload page → act again (grant/withdraw) → some receipts silently missing; ids non-monotonic in store. Repro: any reload + consent action.
2. **G-1:** wizard → "Someone else" + mutual → complete → on consent screen (invitation never sent path) click "Begin verification" → simPhase advances without partner. Repro verified.
3. **F-1:** scope incl. Employment → advance to completion → expand Employment row → no "Dispute this finding" (conflicting claim is secondary). Repro verified.
4. **L-1:** sign up → onboard → logout → login → onboarding again. Repro verified.
5. **C-1:** grant a category, don't advance sim → dashboard chips say "Requires consent"; detail says "Not started yet". Repro verified.
6. **C-2:** partner/family + unshared pillar → Trust Profile row text "Not shared with you" but chip shows true state (e.g. Verified). Repro verified.

### D. Dead
Sidebar "Reports"; report breadcrumb "Reports"; onboarding path value; signup failed-bar; `sampleCase.summary`; `CoverageIndicator`; `EvidenceChain progress`; invitation expired status; `unavailable` state; entire `demo/`+`interactive/`+`routes/demo*` file set; old `layout/AppShell.tsx`.

### E. Missing (spec-necessary only)
States Reference screen; skip-link in AppShell; natural expiry demonstration; invited-person side of Journey B; dispute reachable entry; wizard nav entry when a case exists.

### F. Contradicts product principles
G-1 (mutual gate bypass via Begin button) — violates both-or-neither. R-1 (silent receipt loss) — violates "every access/action receipted, no silent access" at the ledger level. C-2 (state chip leak) — blurs "not shared" boundary. F-1 — user told a finding "needs your attention" but cannot dispute it (dead-end promise).

### G. Visually weak
Four near-identical pill implementations; dashboard/detail simulation panels repetitive; drawer/dialog lack entrance motion; icon buttons 36px; two sidebar items with near-identical labels.

### H. UX-weak
Wizard unreachable with existing case; "Reports" dead nav; forced re-onboarding; create-case silently replaces previous case; toast-only feedback on destructive-ish actions (withdraw) if missed; Account delete without confirmation.

### I. Security/privacy-weak (observed)
Ledger completeness (R-1); role filtering is display-only (labelled); clipboard without fallback; demoViewRole persistence.

### J. Cannot be verified
All backend/integration/security infrastructure; real reviewer operations; real expiry scheduling; real multi-account behaviour; production persistence.

---

## 32. FINAL SCORECARD

| Dimension | Score | Justification |
|---|---|---|
| Product completeness | 7.5 | Full primary loop; secondary flows (dispute, invited-side, states ref) absent/broken |
| Functional completeness | 7 | Everything wired works, but 3 state-integrity bugs and 1 unreachable flow |
| UX quality | 7.5 | Clear hierarchy, honest empty states; wizard orphaning + dead nav hurt |
| UI quality | 8.5 | Tokenised, restrained, consistent; minor pill duplication |
| Navigation | 6.5 | One dead item, one unreachable screen-entry, misleading breadcrumb |
| Information architecture | 7 | Triangle flows clear; Consent&Privacy vs Grants&Shares&Ledger naming confusion |
| Accessibility | 7 | Strong baseline; missing skip link, 36px targets |
| Mobile/responsive | 7.5* | Structure verified safe; exact 375px render not directly tested this session |
| Consent model implementation | 8.5 | Per-category, before-search, withdraw+auto-revoke; consent-expiry absent |
| Evidence model implementation | 8.5 | Real per-claim paths, full data, honest disclaimers; role filter gap |
| Role/permission implementation | 7.5 | Family/partner genuinely derived from grants; chip leak + unfiltered evidence |
| Privacy representation | 8 | Receipted, purpose-bound, revocable — undermined by R-1 |
| Security representation | 7 | Real crypto + tamper demo; completeness bug; client-only authz (labelled) |
| State handling | 6.5 | 3 store-level bugs (R-1, G-1, L-1) |
| Error handling | 7.5 | Not-found/empty/invalid all designed; loading minimal |
| Data consistency | 6.5 | Name/subject divergence, static coverage/limitations, R-1 drops |
| Visual consistency | 8 | Tokenised; pill variants |
| Capability honesty | 9.5 | Exemplary labelling; zero prohibited claims found |
| **Overall prototype readiness** | **7/10** | **Strong honest core; must fix R-1, G-1, F-1 (+L-1, C-1, C-2) before "complete"** |

---

## 33. AUDIT CONDITIONS

No code, copy, styling, or data was modified during this audit. All findings derive from: (1) full source read of `store/`, `routes/`, `components/app/`, `lib/hashChain.ts`, `data/sampleCase.ts`, `styles/`; (2) live browser interaction of every journey, every screen, deep links, storage inspection, and DOM/store diffs; (3) static scans for orphans, dead code, and prohibited claims. TypeScript compiles clean; no build was run to completion during the audit (none needed for observation).

**END OF FORENSIC AUDIT**