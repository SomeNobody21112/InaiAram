# INAIARAM WEBSITE — COMPLETE PRODUCT AUDIT

**Audited:** the existing InaiAram website as built in this repository (React 19 + Vite 7 + TypeScript + Tailwind 4 + React Router 7). This audit covers the **current** state: the public marketing site, the three legal pages, the login stub, the **new `/app` web-app prototype** (built after the previous audit), and the **legacy `/demo` surface that still exists in code**. Confidence markers used throughout:

- **[EXPLICIT]** — directly stated/visible on the website
- **[OBSERVED]** — directly observed behaviour/UI
- **[INFERRED]** — reasonable inference, not stated
- **[UNKNOWN]** — cannot be determined from the website

---

## 1. EXECUTIVE SUMMARY

InaiAram is a **consent-first, evidence-first matrimonial verification concept for India**, published as a pre-launch marketing site plus a working single-case web-app prototype. Its identity is built on *deliberate refusal*: no scores, no verdicts, no "clean records", no credit data, no character judgment, no covert checks, and health screening designed so the platform never receives medical results. The philosophy is "certainty attaches to a claim, never to a person."

Since the previous audit, the site now has a **complete authenticated prototype** at `/app/*`: simulated signup/login, a 3-screen onboarding, a scope-builder wizard, per-category consent, a deterministic 5-phase verification simulation, a mutual both-or-neither gate with invitation flow, an interactive 7-node Evidence Thread, a role-switchable Trust Profile, an on-screen report with a mandatory "what we could not establish" section, a Consent & Privacy center with a real SHA-256 receipt chain, per-pillar purpose-bound expiring shares, disputes, and an account screen. All of it is honestly labelled as a local, fictional prototype.

Residual structural issues: the legacy `/demo` route is **dead code that still imports its components** (its router file is orphaned), landing-page "Start Verification" CTAs still point to `/demo` (redirect), there is no dedicated result-states reference screen, and the prototype is structurally single-case (the case ID is hard-coded as `IA-DEMO-0001` in several screens).

---

## 2. COMPLETE SITEMAP

### 2.1 Live routes [OBSERVED]

| Route | Shell | Purpose | CTAs | Forms | Interactive | Functional? |
|---|---|---|---|---|---|---|
| `/` | Nav+Footer | Public brand + product story, 16 sections | Start Verification → `/demo`; See how it works → `#how-it-works`; Log in → `/login`; Resources dropdown links | None submitted (email field in Scope Builder is never sent) | Theme toggle, mobile drawer, Trust Profile compact demo (6 tabs, 3 roles), Ask Kit, mutual gate, evidence chain expanders, pillar expanders, FAQ accordion, Scope Builder | Informational + demo |
| `/privacy` | Nav+Footer | Privacy Policy | Back to home | None | None | Informational, **draft** |
| `/consent-notice` | Nav+Footer | Consent model explainer | Back to home | None | None | Informational, **draft** |
| `/terms` | Nav+Footer | Terms of Verification | Back to home | None | None | Informational, **draft** |
| `/signup` | Standalone | Create account (prototype) | Continue → onboarding; link to login | name, email, phone (optional) | Validation, simulated loading, error states | Simulated locally |
| `/login` | Standalone | Login (prototype) | Log in → onboarding/dashboard; link to signup | email, password | Loading, error, locked messaging | Simulated locally |
| `/onboarding` | Standalone (auth required) | 3-screen philosophy + path choice | What InaiAram does / does not claim / choose path | Path radio + continue | 3 paths: verify-someone, invited, verify-self | Functional |
| `/app` (Overview) | AppShell | Attention-first dashboard | Start a verification / Open verification; per-item CTAs | None | Attention list, active-verification card, StateChips, recent activity, simulation controls | Functional |
| `/app/new-verification` | AppShell | 5-step scope wizard | Back / Continue / Create verification | subject name, mode, pillar selection | Per-step validation, "what cannot be established" summary | Functional |
| `/app/verifications` | AppShell | Cases list | Open case, new verification | None | Case cards | Functional (single demo case) |
| `/app/verifications/IA-DEMO-0001` | AppShell | Verification detail | Open evidence, dispute finding | None | Category rows → detail, expandable claim disclosure, dispute form, mutual gate | Functional |
| `/app/verifications/:id/evidence` | AppShell | Evidence thread deep-dive | Select claim, expand chain | None | Claim selector nav, EvidenceChain, evidence items | Functional |
| `/app/verifications/:id/report` | AppShell | On-screen report | Share…, open evidence | None | SAMPLE watermark, findings + "could not establish" | Functional when phase 5 |
| `/app/trust` | AppShell | Trust Profile | Role switcher | None | Subject/Partner/Family views | Functional |
| `/app/evidence` | AppShell | Evidence (standalone) | Select claim | None | Same chain component | Functional |
| `/app/reports` | AppShell | — | — | — | — | **Redirect** to `/app/verifications` |
| `/app/consent` | AppShell | Per-pillar consent controls | Grant / Decline / Withdraw / Grant all | None | ConsentControl cards per pillar | Functional |
| `/app/privacy` | AppShell | Consent & Privacy center | Create share, revoke, verify receipt chain, manage consent | Share dialog (accessor, purpose, granularity, expiry) | Grant summary, share cards, ledger, chain verification, data-rights dialog | Functional |
| `/app/invitations/INV-001` | AppShell | Mutual invitation flow | Send invitation, simulate accept/decline, copy text | Recipient name, language (EN/हिन्दी/தமிழ்) | Status badge, language switcher, copy | Functional |
| `/app/account` | AppShell | Account | Delete account, sign out | Delete confirmation dialog | Profile, data rights, disputes entry | Functional |
| `/demo/*` | — | — | — | — | — | **Redirect** to `/app` |

### 2.2 Dead code [OBSERVED]

- `src/routes/demo-app.tsx` (legacy `/demo` dashboard/verification/evidence/consent router) is **imported by nothing** — orphaned. Its four page components (`src/components/demo/DashboardPage.tsx`, `VerificationDetailPage.tsx`, `EvidencePage.tsx`, `ConsentPage.tsx`) are referenced only by the orphan.
- `src/routes/demo.tsx` is also orphaned as a route module, but **its imported components are still alive** (`TrustProfileFull` would be unused, but `TrustProfileCompact` from the same file renders inside the landing Hero, and `AskKit`, `ConsentLedger`, `ScopeBuilder`, `EvidenceThread` are used by landing sections).
- `src/routes/login.tsx` — the old honest login stub — is orphaned; `/login` is now the simulated prototype login in `screens/Auth.tsx`.
- An old `src/components/layout/AppShell.tsx` also exists alongside the active `src/components/app/AppShell.tsx`.

### 2.3 Landing-page section order [OBSERVED]

Hero → CorePromise → InformationAsymmetry → TheAsk → HowItWorks → EvidenceThreadSection → MutualTrust → Certainty/limitations rule → ConsentPrivacy → Limitations → EightPillars ("What can be verified") → Health → Dispute → WhyInaiAram → Packages → FAQ → FinalCta → Footer.

**Not present anywhere [OBSERVED]:** pricing page, blog/resources pages, contact page, sample-report page (the report exists only inside `/app`), family-delegate portal, dispute-filing surface outside the prototype, careers/contact/company info pages. Footer contains several plain-text non-links ("Certainty levels", "Health & lab protocol", "Operational boundaries", "Evidence provenance" render as `<span>`).

---

## 3. EXISTING PRODUCT DEFINITION

### What InaiAram is [EXPLICIT]
A consent-first, evidence-first matrimonial verification platform for India. Core line: **"Know what can be verified before you say yes."** It verifies specific claims using named source types, states every limitation, and never tells users whether to proceed.

### Who the users are [EXPLICIT]
- **Primary user:** a person considering a prospective matrimonial match ("you").
- **Verified person (subject):** the prospective match, who participates and consents.
- **Family delegate:** family members see **status-only** information, values hidden, no silent access [EXPLICIT].

### One-sided or mutual? [EXPLICIT]
Both. The site's signature mechanic is the **both-or-neither mutual gate**: both people participate; neither side's results release until both complete. Declining is treated as "information, not a verdict."

### Problem solved [EXPLICIT]
Information asymmetry in arranged/introduced matrimonial contexts — the gap between what is claimed and what can be evidenced — resolved through consented, evidence-backed checks rather than suspicion or covert inquiry.

### Before / during / after verification [EXPLICIT via site + app]
- **Before:** scope selection (which categories), consent per category, (mutual mode) invitation.
- **During:** source retrieval, identity matching, corroboration, human review, coverage enumeration.
- **After:** findings per claim with state + "what this does not mean", coverage statements, expiry dates, report, purpose-bound expiring shares, receipts.

### What each party receives [EXPLICIT]
- **Requesting user:** findings and a report view with evidence chain per claim.
- **Subject:** their own controls, ledger, and receipts; they see everything about their own case.
- **Family:** status-only shares.

### Roles of each actor [EXPLICIT]
- **Consent:** gate for every category; per-pillar; withdrawable; precedes any search.
- **Human review:** explicit Evidence Thread node; "reviewed by a named reviewer before reporting."
- **Technology:** deterministic retrieval/matching depicted in the prototype; no AI claims anywhere [OBSERVED — absence].
- **Laboratories:** future health module only — appointment logistics and consent; the lab holds samples and results [EXPLICIT, "Planned module"].

### Promised vs not promised
- **Promised:** claim-level findings within stated coverage; consent control; receipts; expiring shares; human review; coverage transparency.
- **Explicitly not promised:** certainty about a person; character/suitability judgment; universal or private-record access; credit data; medical results to the platform or partner; "clean record"; lifetime validity.

---

## 4. USER TYPES

| Type | Capability | Where represented |
|---|---|---|
| Subject | Full detail + controls: consent, withdrawal, shares, disputes, ledger | `/app` screens + Role Switcher "Subject" [EXPLICIT] |
| Partner | Only granted pillars/granularity; purpose-bound expiring access | Role Switcher "Partner — only what has been granted" [EXPLICIT] |
| Family delegate | Status-only, values hidden, grants visible | Role Switcher "Family — status only — values hidden" [EXPLICIT] |

**[OBSERVED]** The prototype enforces role differences in Evidence and Report screens (family view hides claim values: "Value not shown in this view"). **[UNKNOWN]** Whether Partner/Family views are computed from actual share grants or statically labelled — the switcher flips a display flag; it does not derive from the share list.

---

## 5. VERIFICATION CATEGORIES

Eight pillars, present identically in the public content (`src/data/pillars.ts`), the app store (`PILLARS` in `src/store/types.ts`), and the wizard. All names below are verbatim.

| # | Category | Can verify | Source types | Consent | Documents | Human review | Result states shown | Stated limitations |
|---|---|---|---|---|---|---|---|---|
| 1 | **Identity** | Name, DOB, identity-document consistency | Government-issued ID provided by person, verified offline; salted hash stored, never the number | Yes | Yes | Yes (thread) | verified | Confirms document + consistency, nothing else |
| 2 | **Education** | Degree, institution, year | Issuing institution or authorised digital credential (NAD) | Yes | Yes | Yes | verified | Older/manual records slow or impossible |
| 3 | **Employment** | Current employer, role, tenure band | Employer response + contribution records (EPFO-type) | Yes | Indirect | Yes | supported / conflicting | Recent joins invisible; unregistered employers untraceable |
| 4 | **Income band** | A verified **range**, never an exact figure | Voluntary salary slips / tax documents | Yes | Yes | Yes | supported | Non-salaried income frequently unverifiable; no credit data ever |
| 5 | **Marital status** | Marriage-registration records in **declared jurisdictions** | State-level registration databases; no federated national search | Yes | No | Yes | noMatchFound / verified | Registrations elsewhere (esp. abroad) won't appear |
| 6 | **Court & legal records** | Searches of available court systems for declared-address jurisdictions, name-based | Available court record databases | Yes | No | Yes | noMatchFound / requiresClarification (mid-sim) | Uneven digitisation, incomplete records, name collisions, missing DOB, false + missed matches |
| 7 | **Business & directorship** | Public corporate filings, registered roles | Public corporate filings / ministry records (MCA-type) | Yes | No | Yes | noMatchFound | Informal/unregistered involvement invisible |
| 8 | **Digital footprint** | Corroboration via self-published public professional profiles only | Public professional profiles | Yes | No | Yes | supported | No private social media, no personality/opinion/association profiling |

**Consent metadata per pillar [EXPLICIT]:** each stores `whatWillBeChecked`, `sourceTypes`, `whoMaySee`, `knownLimitation` — consent copy is generated from this, guaranteeing consistency.

**Categories asked about but genuinely ABSENT [OBSERVED]:** Age (only as part of identity DOB), Nationality (only inside the identity sample value "Indian Citizen"), Assets/property, Financial information beyond income band, Health as a *checking* category (health appears only as a planned, arm's-length module — see §8). **No corporate-directorship category was added by us — it is genuinely present** as pillar 7 [EXPLICIT].

---

## 6. EVIDENCE MODEL

The site's evidence architecture is the **7-node Evidence Thread** [EXPLICIT]:

**Claim → Source → Identity Match → Corroboration → Human Review → Coverage → Result**

[OBSERVED] Key mechanics as implemented:
- **Paths differ per claim.** `pathsThroughThread` enumerates which nodes a claim actually traverses; non-path nodes render as "not applicable to this claim" (e.g., legal-records claim skips Corroboration and Result nodes in the sample data).
- **Per-claim record** (`ClaimRecord`): id, pillar, stated value, source type, identity match + reasoning, certainty, coverage, established date, expiry, consent state, `doesNotMean`, evidence items, path.
- **Evidence items:** source type, retrieved-at timestamp, illustrative artifact hash (`sha256:…`), identity-match reasoning.
- **Coverage is a first-class node**, not a footnote: per-jurisdiction Searched / Partial / Not searched with reasons.

### Terminology captured verbatim [EXPLICIT]

| Concept | Exact vocabulary used |
|---|---|
| Result states | Verified · Supported · Requires consent · Candidate-controlled · No matching record found · Conflicting · Requires clarification · Unavailable · Under review |
| Negative-space language | "no matching record found **within the coverage searched**" + mandatory "This is not a clean record." |
| Certainty | "certainty" (claim-level), never confidence % |
| Evidence | "evidence", "evidence items", "evidence thread", "evidence-backed view" |
| Sources | "source types", "named source types", "Demonstration source" |
| Limitations | "what this does not mean", "known limitation", "coverage statement" |
| Consent | "consent ledger", "purpose-bound", "time-boxed", "expiring" |
| Integrity | "salted hash" (identity), "receipt", "access receipt", "verify receipt chain" |
| Review | "human review", "reviewed by a named reviewer" |

**[INFERRED]** The conceptual flow the site supports is exactly Claim → Source → Identity Match → (Corroboration) → (Human Review) → Coverage → Result, with Corroboration and Human Review conditional per claim. No "analysis", "score", or "confidence" vocabulary exists anywhere.

---

## 7. CONSENT & PRIVACY MODEL

### Explicitly stated [EXPLICIT]
- **Who:** the subject gives consent; in mutual mode both parties consent to what concerns them.
- **When:** before any search — consent precedes checks (copy: checks "cannot be checked until authorised").
- **Granularity:** per category (8 independent controls); no global checkbox anywhere.
- **Per-grant content:** what will be checked, source types, who may see it, purpose ("Matrimonial verification — this case only"), known limitation.
- **Withdrawal:** one action, ends active shares on that pillar, prevents further checks, creates a receipt ("Consent withdrawn — X. Related shares ended.") — [OBSERVED in the reducer: withdrawal revokes active shares and logs one receipt].
- **Expiry:** consents and shares are time-boxed; every receipt records `expiresAt`.
- **Sharing:** per-pillar, purpose-bound, granular (status-only vs status+values), expiring, revocable, every access receipted. Family shares are status-only by rule.
- **Audit:** the Consent Ledger records every action (grant, decline, withdraw, share-created, share-accessed, share-revoked, invitation events, mutual release, findings, disputes) as receipt cards with actor, purpose, scope, timestamp, expiry, and hash chain linkage. A "Verify receipt chain" action recomputes SHA-256 hashes and reports intact/broken.
- **Data rights surface:** the Privacy Center has Data rights, deletion request (dialog with confirm), account controls. [OBSERVED]

### Not specified [UNKNOWN]
- Actual deletion mechanics and timelines (the dialog exists; the backend behaviour is unknown).
- Retention periods beyond demo expiry dates.
- Whether consent expiry automatically re-prompts.
- Whether withdrawal erases established findings or only ends future sharing (the prototype keeps findings but ends access; the public site does not specify).
- Legal basis documentation (DPDP-specific compliance language deliberately absent).

---

## 8. HEALTH SCREENING MODEL

**Status: "Planned module — not offered at launch."** [EXPLICIT]

- **Who does what [EXPLICIT]:** InaiAram arranges the appointment and the consent; an **accredited laboratory** conducts the tests and holds samples and results; a **doctor** interprets results and counsels the individual privately; the **individual** receives their own results and may later choose to attest or discuss something with their partner.
- **What InaiAram receives:** scheduling information only [EXPLICIT].
- **What InaiAram never displays:** medical values, diagnostic results, infectious-disease results, health scores, compatibility, suitability opinions, flags [EXPLICIT as refusal inventory; OBSERVED absent in app UI — health appears in the wizard only as an excluded, candidate-controlled note].
- **Problematic wording check [OBSERVED]:** FAQ answer — "We arrange the appointment and the consent… We never receive them." This is clean. The consent-notice and health sections describe the arm's-length model without claiming any medical capability. No medical panels are named anywhere. **No problematic claims found.**

---

## 9. RESULT MODEL

Nine canonical result states [EXPLICIT], each carrying a mandatory "what this does not mean" [EXPLICIT], as rendered by `StateChip` from the content file:

| State | Meaning (site copy) | "What this does not mean" |
|---|---|---|
| Verified | Evidence supports the claim within the coverage searched | Not that everything about the person is verified |
| Supported | Supporting evidence exists but may be limited in scope | Not full confirmation |
| Requires consent | Check not performed; consent absent | Not a negative result |
| Candidate-controlled | Person controls the information; shared only if they choose | Not a refusal or finding |
| No matching record found | Nothing matched within coverage searched | **"This is not a clean record."** |
| Conflicting | Sources disagree | Platform does not resolve the conflict for you |
| Requires clarification | Process needs more information | Not a failure |
| Unavailable | Source may simply be inaccessible | Not a negative |
| Under review | Normal quality review in progress | Not a finding |

**Coverage states [EXPLICIT]:** Searched / Partial / Not searched, each with a reason (e.g., sample case: 3 of 4 court jurisdictions searched, one "not searched — no declared address history", NAD "partial — some institutions not yet enrolled").

**[OBSERVED]** The prototype additionally uses *case-level* status labels — Awaiting consent / Awaiting participant / In progress / Complete / Draft — which are UI statuses, not claim results; they do not collide with the canonical nine. **[OBSERVED]** The consent screen deliberately distinguishes "Declined" (with "no check will be performed") from "Awaiting consent" (pending), preventing declined from reading as pending. **[NOT PRESENT]** "Partially verified", "Pending verification", "Source unavailable" as result names — correctly absent.

---

## 10. SHARING MODEL

[EXPLICIT] Shares are: **per-pillar · purpose-bound · granular (status-only / status-and-values) · time-boxed with expiry · revocable · receipted · visible in the ledger.**

[OBSERVED in prototype] `CREATE_SHARE` dialog captures: pillar, accessor (Partner / Family delegate), purpose (free text), granularity, expiry in days. Every share card shows Access, Granularity, Purpose, Expires, and status (active/expired/revoked) with a Revoke action. Revocation and expiry both produce ledger receipts. Family grants are status-only by policy copy; the UI does not technically block status-and-values selection for family — a copy-level rule, not enforced [INFERRED gap].

**[EXPLICIT refusals]** No permanent sharing. No lifetime certificates. No silent access — "every grant visible, no silent access."

---

## 11. REPORT MODEL

[OBSERVED] The report is an **on-screen artifact** at `/app/verifications/:id/report`, available only when simulation reaches phase 5 ("The report becomes available when all checks and human review are complete"). It contains:

- Header: case ID, subject, issue date, current viewing role.
- Findings per claim: value, source type, identity match, certainty, coverage, established + expiry.
- **"What we could not establish"** — mandatory section, placed as a primary block, with reasons (sample: cross-border marital status blocked without the person's participation; one district court's incomplete 2019–2022 digitisation).
- A "Share…" action that opens consent controls rather than exporting.
- A diagonal **SAMPLE** watermark and "Illustrative" labels.

[EXPLICIT] The prototype does not generate downloadable files — this is stated in the spec and the Share action routes to consent configuration instead. [OBSERVED] No PDF, no download button, no fake certificate.

---

## 12. USER JOURNEY (as the site supports it)

| # | Step | Site support | Missing | Web app must | Should NOT invent |
|---|---|---|---|---|---|
| 1 | Discovery | Landing page narrative | — | — | Traffic claims |
| 2 | Understanding the problem | InformationAsymmetry section | — | — | Fraud statistics |
| 3 | Understanding InaiAram | CorePromise, refusals | — | — | — |
| 4 | Understanding verification | HowItWorks, Evidence Thread, Eight Pillars | — | — | Provider names as live partners |
| 5 | Understanding consent | ConsentPrivacy, Consent Notice page | — | — | Legal-compliance claims |
| 6 | Starting verification | CTA → `/demo` → redirect `/app`; wizard | Real account creation | Keep simulated auth honest | Real OTP/backends |
| 7 | Providing information | Wizard: who, categories, can/cannot, confirm | — | — | Document upload promises |
| 8 | Subject participation | Invitation flow, consent screen | Subject-side standalone portal experience (prototype uses role switcher instead) | Role switcher is sufficient for prototype | Coercive framing of declines |
| 9 | Verification | Deterministic 5-phase simulation with Advance control | Live provider calls (correctly absent) | Keep simulation labelled | Fake API calls |
| 10 | Evidence review | Evidence Thread per claim | — | — | — |
| 11 | Result | 9 states + doesNotMean | — | — | — |
| 12 | Report | On-screen report | Download (intentionally) | Keep on-screen | PDF certificates |
| 13 | Sharing | Share creation + receipts | Actual multi-account sharing | Simulate accessors | Silent/permanent access |
| 14 | Follow-up | Dispute entry point | Dispute status progression UI (statuses exist: submitted → under review → resolved; transition UI not built) | Minor: a status timeline | Case-management machinery |

---

## 13. UI/UX SYSTEM

### Typography [EXPLICIT]
- **Playfair Display** — display/editorial headings, hero, section titles.
- **Inter** — body, UI, navigation.
- **JetBrains Mono** — metadata: receipt IDs, hashes, case IDs, mono eyebrows (`label-mono`), timestamps. Deliberately rationed.

Hierarchy levels [OBSERVED]: `display-xl/m/s`, PageHeader (eyebrow + title + description), section `label-mono` overlines, card titles, body, `meta-mono` metadata. The app uses smaller, calmer sizes than the marketing page by design.

### Colour [EXPLICIT — tokens]
| Role | Light | Dark |
|---|---|---|
| Background | #FAF8F4 (warm cream) | #0F0D0B (near-black brown) |
| Background alt | #F3EFE8 | #151210 |
| Surface | #FFFFFF | #1A1714 |
| Raised | #FBF9F5 | #201C18 |
| Line | #E8E2D8 | #2A2520 |
| Strong line | #D4CBC0 | #363029 |
| Ink (primary) | #1C1917 | #F5EFE7 |
| Ink secondary | #44403C | #B4ABA2 |
| Ink tertiary | #78716C | #7A7168 |
| Terracotta | #B5522B (deep #93401F) | same values |
| Gold | #B8860B (soft #D4A843) | same |
| Sage (verified/consent) | #3D7A3A | same |
| Taupe (neutral/no-match) | #9A9186 | same |

Semantic mapping [OBSERVED]: sage = verified/granted/unlocked; gold = supported/requires-clarification/under-review/attention; terracotta = brand/consent-required/candidate-controlled; deep terracotta = conflicting/revoked; taupe = no-match/declined/expired/not-searched. Both themes are token-driven; no inversion artifacts observed.

### Components [OBSERVED]
Cards (rounded-xl, border-line, surface), Buttons (primary terracotta / secondary / ghost, 3 sizes, focus rings), StateChip (9 glyph states), CoverageIndicator, ConsentControl cards, VerificationRow, EvidenceChain (vertical ordered list with connector line), AccessReceiptCard, ShareGrantCard, MutualGate, RoleSwitcher (radio group), Tabs, SegmentedControl, Accordion/Disclosure, Dialog, Drawer, Toasts, Tooltip, EmptyState, Skeleton/LoadingState, Breadcrumb, PageHeader, Emblem (floral/garland mark), progress rings (Ask Kit).

### Layout system [OBSERVED]
Landing: 1200px max container, 4-based spacing scale, alternating section backgrounds with `SectionRule` diamond ornaments. App: fixed desktop sidebar (7 destinations) + top bar; mobile drawer nav; `max-w` constrained content; consistent page padding.

---

## 14. ANIMATION SYSTEM

[OBSERVED]
- **Scroll reveal:** IntersectionObserver-based (`useReveal`), fade/translate, once-only, viewport-triggered — respects "arrive then animate."
- **Hover:** color/border transitions only, 150–200ms.
- **Accordion/Disclosure:** height/opacity transitions.
- **Drawer:** slide-in with focus trap; **Dialog:** fade + scale.
- **Toasts:** slide + auto-dismiss.
- **Evidence chain:** static rendering; expansion is instant (no per-node sequential animation — deliberate restraint).
- **Ask Kit progress rings:** animate when in view, numbers and ring together.
- **Theme switch:** color transitions.

**Should NOT be carried into the app [OBSERVED — already correctly absent from the app]:** the landing page's larger hero entrances and decorative reveals. The app currently uses minimal motion; nothing bounces, floats, or parallaxes. `prefers-reduced-motion` is honoured by the reveal hook.

---

## 15. CONTENT INVENTORY (raw, by category)

- **Brand:** InaiAram; "Know what can be verified before you say yes."; garland/floral emblem; terracotta+gold identity; Indian, editorial, calm.
- **Problem:** information asymmetry between what people claim and what can be known in matrimonial contexts.
- **Solution:** consented, evidence-backed claim verification with visible coverage and limitations.
- **How it works:** scope → consent → sources → identity match → corroboration → human review → coverage → result → report → expiring shares.
- **Verification:** the 8 pillars (§5) with per-pillar limitations.
- **Health:** planned, arm's-length module (§8).
- **Consent:** per-category, before checking, granular, withdrawable, purpose-bound, expiring, receipted (§7).
- **Privacy:** ledger, receipts, status-only family access, no silent access, data rights + deletion entry.
- **Limitations:** jurisdiction limits, uneven digitisation, name collisions, non-federated marriage records, untraceable informal employment/business, non-verifiable non-salaried income, foreign registrations invisible, "no matching record ≠ clean record."
- **Pricing:** three tiers with **`price: null`** — features listed, prices intentionally unpublished [EXPLICIT: "unconfirmed"].
- **FAQ:** 8+ entries including refusals ("Do you check credit scores? No…").
- **Legal:** Privacy Policy, Consent Notice, Terms — all marked draft.
- **CTA copy:** "Start Verification", "See how it works", "Open full demo", "Log in", "Start a verification", "Grant", "Withdraw", "Verify receipt chain", "Advance verification".
- **Result terminology:** §9 table.

---

## 16. STATISTICS INVENTORY

**Public marketing site: ZERO statistics displayed.** [OBSERVED — grep for percentages in `src/content/en.ts` returns nothing; no fraud numbers, case counts, market size, success rates, or user counts appear anywhere on the landing page.] This restraint is deliberate positioning against competitors who display un-sourced statistics.

**All numbers are contained in the labelled fictional sample case** [EXPLICIT as sample data, not company claims]:

| Number | What it is | Where | Sourced? | Keep? |
|---|---|---|---|---|
| 17 | "sources reviewed" in sample case summary | `sampleCase.summary` | N/A — fictional | Only inside labelled demo |
| 6 of 8 | jurisdictions with coverage entries (8 rows: 5 searched, 2 partial, 1 not-searched) | sample coverage list | fictional | Yes, as demo |
| 2–4 years | employment tenure band | employment claim | fictional | Yes, as demo |
| 14 days | share expiry default | share creation + receipts | fictional/product parameter | Yes |
| 3, 1, 0 | supported / requires-clarification / unavailable counts in sample summary | sample summary | fictional | Yes, as demo |
| 28, 2020, etc. | subject age, degree year, dates | sample subject | fictional | Yes |
| Package turnarounds | described in tier features | `packages.ts` | **unconfirmed business facts** — flagged in prior audit, still present | Flag: keep behind unconfirmed-config framing |

**No statistic should be promoted to company-level claims.** The sample-case numbers must stay inside labelled demo context.

---

## 17. SECURITY REQUIREMENTS (implied by UX — prototype scope)

The prototype must *represent* these in UX; a production build must *implement* them.

**Represented in the prototype [OBSERVED]:** honest labelling ("Prototype — accounts are simulated. Nothing leaves this device."), localStorage-only state, real SHA-256 receipt chain with a verify action and tamper demonstration, consent enforcement gating checks, role-gated value display (family sees no values), expiry and revocation logic, no network calls.

**Required for production later [INFERRED from product promises]:**
- Real authentication/session handling (the prototype simulates).
- **IDOR protection is existential here:** case/claim/share/receipt access must be authorization-checked per user — the entire product is access control.
- Consent enforcement server-side (client gating is insufficient by definition for this product).
- Receipt/ledger immutability at rest; append-only event store.
- Purpose-bound share tokens with server-side expiry and one-time access logging.
- Family/partner access computed from grants, never from client state.
- Rate limiting + brute-force protection on auth; input validation; standard XSS/CSRF/injection hygiene.
- Secure handling of any uploaded documents (income slips): encryption at rest, access logging, deletion.
- Health data: **the platform must not receive it** — architecture must keep lab/doctor systems separate (this is a design constraint, not just a policy).
- Sensitive-info exposure controls: identity number stored as salted hash only (already the stated design).

---

## 18. MOBILE REQUIREMENTS

[OBSERVED current behaviour]
- App shell: sidebar → compact top bar + **drawer** with focus trap and body scroll lock; bottom-of-shell "About InaiAram" link.
- Evidence Thread: already a vertical ordered list at all widths (the rebuild replaced the horizontal timeline; the old horizontal variant is gone).
- Trust Profile: stacked role switcher; rows stack.
- Consent controls: cards stack; buttons remain touch-sized (~36–44px).
- Ledger: single-column receipt cards; hash rows wrap.
- Tables: none site-wide requiring transformation (comparison table on landing stacks).
- **No horizontal overflow** detected in the rebuilt layout (fixed in the previous rebuild pass; the horizontal evidence variant was the last offender and was replaced).

**Web app must keep [INFERRED]:** vertical chains, stacked cards, full-width primary actions, drawer nav, no desktop tables compressed.

---

## 19. CURRENT STRENGTHS (specific)

1. **The refusal inventory is the brand.** "No scores. No verdicts. No clean records." (onboarding screen 2), "This is not a clean record" (legal pillar), "We never receive them" (health). Each refusal is *specific and testable*, not vague humility — this is what makes trust feel earned [EXPLICIT].
2. **"What this does not mean" is welded to every result state** — the single strongest trust device on the site; it prevents the exact misreadings (no-match → clean) that plague this category [EXPLICIT].
3. **The Evidence Thread with per-claim paths** — showing *which nodes a claim did not traverse* ("not applicable to this claim") is honest in a way most verification UIs never attempt [OBSERVED].
4. **The mutual gate's handling of decline** — "information, not a verdict," "nothing was released, and no interpretation is attached" — is a genuinely novel, humane product stance [EXPLICIT].
5. **A working, honest prototype.** Real SHA-256 chain, deterministic simulation, consistent single sample case across every screen, 17 explicit "illustrative/demo" labels [OBSERVED].
6. **Coverage as a first-class concept** — per-jurisdiction Searched/Partial/Not-searched with reasons, never implied nationwide reach [EXPLICIT].
7. **Zero un-sourced statistics** — restraint that materially differentiates from the competitor's four un-sourced numbers [OBSERVED].
8. **Consent vocabulary consistency** — one source of truth (`PILLARS` metadata) generates wizard, consent screen, and limitation copy [OBSERVED].
9. **Typographic identity** — Playfair editorial moments + Inter utility + rationed JetBrains Mono metadata gives "Indian institutional trust + modern technology + editorial restraint" [OBSERVED].

---

## 20. CURRENT WEAKNESSES (prioritised)

**P0 — critical**
1. **Landing → app continuity gap.** All "Start Verification" CTAs (Hero ×2, FinalCta) and the footer demo link point to `/demo`, which now only *redirects* to `/app`. A first-time visitor lands on the marketing page, clicks Start Verification, and arrives at a **login wall** with no explanation bridging "prototype demo" to "create account" [OBSERVED]. The transition needs at minimum a labelled handoff ("This opens the interactive prototype — accounts are simulated").
2. **Dead legacy surface still in the bundle.** `routes/demo-app.tsx` + four demo page components + old `layout/AppShell.tsx` + old `routes/login.tsx` are orphaned but present, and `routes/demo.tsx` imports `TrustProfileFull`/`ConsentLedger`/`ScopeBuilder`/`EvidenceThread` solely for a route that no longer renders them. This bloats the bundle and risks confusion [OBSERVED].

**P1 — important**
3. **No result-states reference surface.** The nine states are discoverable only via per-chip tooltips. The spec calls for a compact reference (every state: name, meaning, does-not-mean + coverage states); no such screen exists [OBSERVED].
4. **Structurally single-case.** Case ID `IA-DEMO-0001` is hard-coded in Dashboard, Verifications, and share/ledger screens; the list screen shows one case. Acceptable for a prototype but must be flagged as such to avoid implying multi-case support [OBSERVED].
5. **Role switcher is display-only.** Partner/Family views are labelled views, not derived from actual share grants — a careful user can notice the Partner view shows a pillar they never shared [INFERRED; observed that the switcher flips a flag].
6. **Family share granularity not enforced in the Create-Share dialog** — the dialog permits "status + values" for a family accessor while policy copy says family is status-only [OBSERVED].
7. **Dispute flow lacks status progression UI** — statuses exist in the type; nothing renders a dispute's lifecycle [OBSERVED].

**P2 — polish**
8. Reports index is a redirect (`/app/reports` → verifications list) while the sidebar has a "Reports" item — the item leads somewhere that immediately changes identity [OBSERVED].
9. Header/row consent-status copy can momentarily disagree during mixed consent states (earlier "Awaiting consent" vs "Consent complete" mismatch — fixed for declined but worth re-verifying across all four consent states) [OBSERVED].
10. Footer non-links (plain-text spans) remain unlinked promises [EXPLICIT].
11. Hindi/Tamil invitation templates carry no "native-speaker-reviewed" caveat [EXPLICIT content, caveat absent].

---

## 21. COMPETITIVE COMPARISON (milnesepehle.in — positioning only, not copied)

**Their comprehension advantage [OBSERVED on their site]:** a brutally simple spine — problem → solution → action — with four statistic callouts, a clean three-step process, certificate-flavoured deliverables ("verified profile", lifetime-validity language), CIBIL-style checking, and compliance-adjacent claims. A visitor understands the offer in under a minute.

**Where that simplicity is bought with dishonesty [EXPLICIT on their site]:** statistics with no visible sourcing; implied certainty ("no adverse records"); lifetime validity; credit checks; compliance absolutes. Each of these is precisely what InaiAram's spec prohibits.

**Where InaiAram is already stronger:** evidence transparency (named sources, per-claim reasoning, artifact hashes), consent architecture (granular, withdrawable, receipted), coverage honesty (partial/not-searched), refusal inventory, mutual gate, human review as a visible node.

**Where InaiAram can learn from their simplicity without copying [INFERRED]:**
- **Time-to-comprehension:** InaiAram's full model takes minutes; the landing page could foreground one 30-second narrative (one claim, traced) before the deep architecture.
- **A single dominant CTA path** with fewer competing secondary links in the hero region.
- **Deliverable clarity:** they sell a tangible artifact (a report/certificate). InaiAram deliberately refuses certificates but could make the *report* — already well-designed in the app — visible from the marketing page as the "what you actually get" moment.
- **Emotional positioning:** theirs is reassurance; InaiAram's is respect. The mutual gate and decline-handling are the emotional differentiators and are currently buried mid-page.

---

## 22. MUST / SHOULD / OPTIONAL / DO NOT BUILD (for the future web app)

### MUST HAVE
- The single app shell with the 7 destinations (Overview, Verifications, Trust Profile, Evidence, Reports, Consent & Privacy, Account) [EXPLICIT nav already built].
- All 8 pillars with verbatim names, what-will-be-checked, source types, limitations [EXPLICIT].
- The 9 canonical result states + "what this does not mean" for each [EXPLICIT].
- Coverage states (Searched/Partial/Not searched + reasons) [EXPLICIT].
- Evidence Thread as interactive component with per-claim paths [EXPLICIT].
- Per-category consent: grant/decline/withdraw, before checks, with what/why/sources/who-sees/purpose/expiry [EXPLICIT].
- Both-or-neither mutual gate with non-judgmental decline handling [EXPLICIT].
- Purpose-bound, granular, expiring, revocable, receipted shares; family status-only [EXPLICIT].
- Consent ledger with readable event cards + receipt chain verification [EXPLICIT].
- On-screen report with mandatory "what we could not establish" [OBSERVED, spec-mandated].
- Attention-first dashboard (conflicts/clarifications/consent first) [OBSERVED].
- Prototype honesty labels throughout [OBSERVED].
- One coherent fictional sample case labelled illustrative [EXPLICIT].

### SHOULD HAVE
- Result-states reference surface (spec item 22; currently missing).
- Landing → app handoff screen or banner bridging the prototype transition (fixes P0-1).
- Dispute lifecycle display.
- Role views derived from actual grants.
- Family granularity enforcement in the share dialog.
- Empty states for every surface (already largely present) and loading/skeleton states (primitives exist; used sparsely).
- Reduced-motion audit across the app.

### OPTIONAL
- Multi-case support (prototype is intentionally single-case).
- Download/print report (spec says do NOT generate files — keep on-screen).
- Additional invitation languages beyond EN/HI/TA (only with native-speaker review + caveat).
- A public-facing sample-report teaser for the landing page.

### DO NOT BUILD
- Scores of any kind (trust/compatibility/risk/profile-strength/verification %).
- "Clean record", "no criminal record", "100% verified", lifetime validity.
- Credit/CIBIL data.
- PDF certificates or downloadable "verified" artifacts.
- AI personality/character/compatibility analysis.
- Private social-media surveillance, relationship discovery, association profiling.
- Fake statistics, fake partnerships, fake certifications, claimed government integrations.
- Health results display, medical panels, or compatibility.
- Covert checking or any non-consented flow.
- Dashboards metrics-for-metrics'-sake (Total Users, Success Rate, Trust Index).

---

## 23. IMPLIED DATA MODEL

**Explicitly present in the prototype** (`src/store/types.ts`, `src/data/sampleCase.ts`) [OBSERVED]:
- `AppUser` (name, email, onboarded, path)
- `VerificationCase` (id, subjectName, mode single|mutual, status, scope, consents, claims, shares, receipts, invitation, disputes, simPhase, mutualReleased)
- `ConsentRecord` (pillar, state pending|granted|declined|withdrawn, grantedAt, withdrawnAt)
- `ClaimRecord` (id, pillar, value, sourceType, identityMatch, certainty, coverage, establishedAt, expiresAt, consentState, doesNotMean, evidence[], pathsThroughThread[])
- `EvidenceItem` (sourceType, retrievedAt, artifactHash, identityMatchReasoning)
- `Share` (pillar, accessor partner|family, purpose, granularity, createdAt, expiresAt, revokedAt)
- `Receipt` (id, timestamp, action of 14 kinds, actor, detail, purpose, scope, expiresAt, previousHash, hash)
- `Invitation` (toName, lang, status draft|sent|accepted|declined|expired)
- `Dispute` (claimId, reason, context, status submitted|under-review|resolved)
- `PillarMeta` (whatWillBeChecked, sourceTypes, whoMaySee, knownLimitation)

**INFERENCE — NOT EXPLICITLY STATED BY WEBSITE (production model):** `Report` as a persisted artifact (currently derived on the fly); `Reviewer` identity behind "named reviewer"; `AccessEvent` separate from consent receipts for read-path auditing at scale; `Document` entity for voluntary uploads (income); `Jurisdiction`/`CoverageSearch` as first-class entities; multi-case indexing per user. Each is justified by a UX promise (receipts, coverage, reports, uploads) but the site never names these entities.

---

## 24–25. REQUIRED WEB-APP SCREENS & SCREEN-BY-SCREEN SPECIFICATION

The prototype already implements the required screen set. Current state per screen:

**1. SIGNUP** — Purpose: minimal account creation. USER: new visitor. ENTRY: nav/CTA. PRIMARY: create account. FIELDS: name, email, phone (optional). STATES: validation ✓, loading ✓, success ✓, error ✓. PRIVACY: "Three details. That is all we collect to begin." SECURITY: honest "simulated, nothing leaves this device" footer. MOBILE: single column. LINKS: login. **[EXISTS ✓]**

**2. LOGIN** — Same skeleton; email+password; error state ("invalid"), loading, locked-message support in code. LINKS: signup. **[EXISTS ✓]**

**3. ONBOARDING** — 3 screens: what InaiAram does / does not claim ("No scores. No verdicts. No clean records.") / choose path (verify-someone | invited | verify-self). One primary action per screen. **[EXISTS ✓]**

**4. OVERVIEW** — Attention-first: consent-needed → conflicts/clarifications → invitation → in-progress → expiring shares, each an actionable row; active-verification card with per-category StateChips; recent activity (last 3 receipts); simulation controls. EMPTY: "No verification has started" + CTA. **[EXISTS ✓]**

**5. NEW VERIFICATION** — 5 steps: who → categories → what can/cannot be established → confirm → create. Health shown separately as planned/candidate-controlled. Limitations summary before creation. **[EXISTS ✓]**

**6. INVITATION** — Recipient name, language (EN/हिन्दी/தமிழ்), copyable text, send (simulated), simulate accept/decline; declined copy is informational. **[EXISTS ✓]**

**7. CONSENT** — Per-pillar ConsentControl cards: what checked, sources, who sees, purpose, limitation; Grant/Decline/Withdraw + Grant-all. Declined ≠ pending distinguished. **[EXISTS ✓]**

**8. VERIFICATION DETAIL** — Header (subject, case ID, status pill, consent summary) → per-category VerificationRow list → expandable claim (chain + evidence + doesNotMean) → mutual gate → dispute entry. **[EXISTS ✓]**

**9. CLAIM/EVIDENCE DETAIL** — Claim selector nav (per-pillar, with chips) + vertical 7-node chain; non-path nodes marked "not applicable"; evidence items with hashes + "not a live provider connection". **[EXISTS ✓]**

**10. TRUST PROFILE** — RoleSwitcher (Subject/Partner/Family) + summary table; "Evidence-backed view — not a judgment of character." Family hides values. **[EXISTS ✓]**

**11. REPORT** — Gate: phase 5 only. Findings + "What we could not establish" + reasons. SAMPLE watermark. Share… opens consent config. No download. **[EXISTS ✓]**

**12. CONSENT & PRIVACY CENTER** — Grants summary, shares (create/revoke), ledger (all receipts, newest first), verify-receipt-chain with tamper status, data rights + deletion dialog. **[EXISTS ✓]**

**13. ACCOUNT** — Profile, participation summary, data rights, deletion request, sign out, disputes entry. **[EXISTS ✓]**

**14. DISPUTES** — Entry: per-claim "Dispute this finding" (reason + context + submit → receipt). Statuses exist in the model; **lifecycle UI missing** (P1-7). **[PARTIAL]**

**15. STATES REFERENCE** — Nine states + coverage states as a compact reference. **[MISSING — P1-3]**

**16. LEGACY `/demo`** — Redirect only; orphaned components remain in tree. **[TO REMOVE]**

---

## 26. CLAIMS & CAPABILITY RISK AUDIT

### CLAIMS THAT REQUIRE EXTREME CARE

Full-codebase scan for prohibited/implied-capability language [OBSERVED]:

1. **"Government identity registry" / "EPFO payroll records" / "Ministry of Corporate Affairs filings" / "National Academic Depository"** in sample-case source types — real institution *types* in fictional data. Risk: read as live integrations. Mitigation present: "Illustrative demonstration data — not a live provider connection" on evidence items. **Keep the labels welded to the data.**
2. **"No matching record found within the coverage searched"** — safe *only* because it is always paired with "This is not a clean record." Any future copy that separates the pair re-creates the risk.
3. **Package tier feature lists** (turnaround times etc.) — unconfirmed business facts still publicly listed with `price: null`; they imply operational commitments. Care level: high.
4. **Regulatory statement** ("does not guarantee the absence of non-indexed police records…") — well-drawn; care needed that it never gets shortened.
5. **"Verified by a named reviewer"** — implies reviewer identity/accountability; prototype never names one. Fine as process description; must not become an audit claim.
6. **"Salted hash" identity storage** — described as design intent; must never be presented as an achieved security certification.
7. **"Verify receipt chain"** — integrity demonstration; already disclaimed ("Not a production security certification"). The disclaimer must stay adjacent.
8. **Non-links in footer** ("Health & lab protocol", "Operational boundaries", "Evidence provenance") — promise documentation that doesn't exist; either link or remove before launch.

**Verified clean [OBSERVED]:** no percentage scores, no compatibility/trust/risk scores, no "100% verified", no CIBIL/credit offers (explicit refusal FAQ instead), no lifetime validity, no DPDP/certified claims, no personality/AI analysis, no fabricated stats on the public site, no fake testimonials/logos/awards anywhere.

---

## 27. INAIARAM WEB-APP SOURCE OF TRUTH (consolidated)

### A. Product definition
Consent-first, evidence-first matrimonial verification for India. "Know what can be verified before you say yes." Certainty attaches to a claim, never to a person.

### B. Target users
Verification requesters (primary), verified subjects (participants with full control), family delegates (status-only), — prototype also serves partners as a granted-access role.

### C. Core problem
Information asymmetry between matrimonial claims and verifiable evidence.

### D. Core value proposition
Claim-level, evidence-backed findings — with consent, named sources, visible coverage, human review, and limitations stated as prominently as results.

### E. Current UVPs
Evidence Thread (7 nodes, per-claim paths) · Mutual both-or-neither release · 9 honest result states · "What this does not mean" · Per-category consent · Access receipts / ledger · Expiring purpose-bound shares · Family status-only access · Health at arm's length · Human review · Coverage transparency · Claim-level certainty · Explicit limitations · No scores · No silent access.

### F. Verification categories
Identity · Education · Employment · Income band · Marital status · Court & legal records · Business & directorship · Digital footprint (+ Health as planned, candidate-controlled, arm's-length).

### G. Evidence model
Claim → Source → Identity Match → (Corroboration) → (Human Review) → Coverage → Result; per-claim paths; evidence items with hashes as illustrative metadata.

### H. Consent model
Per-category, pre-search, granular, withdrawable (one action, ends shares, ledgered), purpose-bound, expiring.

### I. Health model
Planned module. Platform: logistics + consent only. Lab: samples + results. Doctor: interpretation, private. Individual: owns results, may attest. Platform never displays medical information.

### J. Result model
9 canonical states (Verified, Supported, Requires consent, Candidate-controlled, No matching record found, Conflicting, Requires clarification, Unavailable, Under review) + coverage states (Searched, Partial, Not searched). Case-level UI statuses are separate (Draft, Awaiting consent, Awaiting participant, In progress, Complete).

### K. Privacy model
Ledger of every action; access receipts; no silent access; data-rights + deletion entry points; prototype-local storage honestly labelled.

### L. Sharing model
Per-pillar, purpose-bound, status-only or status+values, time-boxed, revocable, receipted; family = status-only.

### M. Report model
On-screen artifact; findings + sources + matching reasoning + certainty + coverage + expiry; mandatory "what we could not establish" with reasons; no downloadable files; SAMPLE-labelled.

### N. User journey
Discover → understand problem → understand model → understand consent → start (scope wizard) → invite (mutual) → consent → simulated verification → evidence review → findings → report → purpose-bound shares → dispute entry.

### O. Required screens
The 16 in §24; all built except States Reference (missing) and dispute lifecycle (partial).

### P. Required interactions
Grant/decline/withdraw per pillar; create/revoke shares; send/copy invitation; simulate response; advance simulation; expand claim disclosure; switch roles; verify receipt chain; submit dispute; delete account dialog; theme toggle; mobile drawer.

### Q. Required states
9 result + 3 coverage + 4 consent + 5 invitation + 3 dispute + 5 case-status + empty/loading/error per surface.

### R. Required data entities
As §23 (all present in the prototype).

### S. Required security controls
Prototype: honesty labels, local-only, chain verification. Production: real auth, server-side consent enforcement, IDOR-proof object authorization, append-only ledger, expiring share tokens, salted-hash identity storage, upload security, lab-data isolation.

### T. Existing design system
Tokens §13; Playfair/Inter/JetBrains Mono; terracotta/gold/sage/taupe semantics; card/chip/receipt/disclosure component library; reveal-on-view animation; light/dark parity.

### U. Existing terminology
See §6 table — preserve verbatim; never substitute "clean", "failed", "negative", "score", "pending verification".

### V. Existing limitations
Pre-launch: no real accounts, no providers, prices null, legal drafts, health/cross-border planned, single-case prototype, role views display-only.

### W. Claims that must NOT be made
§26 list + §22 DO NOT BUILD list, in full.

### X. Simplify
Landing → app handoff; collapse sidebar "Reports" redirect; remove dead demo tree; single narrative hero; fewer competing landing links.

### Y. Preserve
The refusal inventory; doesNotMean pairing; per-claim thread paths; decline handling copy; coverage reasons; zero-statistics discipline; terminology table; sample-case coherence; "not a live provider connection" labels.

### Z. Improve
Add States Reference screen; derive roles from grants; enforce family granularity; dispute lifecycle UI; landing-page report teaser; link or remove footer non-links; caveat on non-English invitation templates.

---

## 28. OPEN QUESTIONS / INFORMATION NOT AVAILABLE

1. **Real provider posture:** which source types will be licensed/partnered vs. document-based at launch? The site names types but never claims integrations [UNKNOWN].
2. **Pricing:** amounts, turnaround commitments, refund policy — all unpublished (`price: null`) [UNKNOWN].
3. **Legal status:** DPDP alignment approach, dispute-resolution jurisdiction, arbitration stance — docs are drafts [UNKNOWN].
4. **Consent expiry behaviour:** auto re-prompt or manual re-grant? [UNKNOWN]
5. **Withdrawal semantics:** do established findings persist for past share windows, or become inaccessible retroactively? Prototype ends future access only [UNKNOWN].
6. **Reviewer identity:** will reports name reviewers (and at what seniority)? [UNKNOWN]
7. **Cross-border:** the report references "participation of the person abroad" — is any overseas capability planned? Site marks cross-border as planned [UNKNOWN beyond that].
8. **Health partners:** no laboratory is named; accreditation standard unnamed [UNKNOWN].
9. **Deletion mechanics:** timelines, crypto-erasure, backup handling [UNKNOWN].
10. **Family delegate onboarding:** how family members get accounts (the model assumes they exist) [UNKNOWN].
11. **Native-speaker review:** Hindi/Tamil invitation copy — reviewed or not? [UNKNOWN]
12. **Multi-case reality:** will one user run several concurrent verifications? The prototype is single-case by design; production intent unclear [UNKNOWN].
