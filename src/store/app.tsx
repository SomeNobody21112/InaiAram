/**
 * APP STORE — deterministic prototype state with localStorage persistence.
 * All actions are simulated locally. Nothing is transmitted anywhere.
 * Receipt hashes are real SHA-256 chains computed with Web Crypto.
 */
import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import { computeHash } from '../lib/hashChain';
import { sampleCase, type ClaimRecord } from '../data/sampleCase';
import {
  PILLAR_BY_ID, shareStatus,
  type AppState, type AppUser, type CaseMode, type ConsentDisplayState, type ConsentRecord,
  type ConsentState, type Granularity, type Invitation, type InvitationLang, type InvitationStatus,
  type OnboardingPath, type PillarId, type Receipt, type Share, type VerificationCase,
} from './types';

const STORAGE_KEY = 'inaiaram-app-v1';

/** Fixed prototype clock — keeps demo dates coherent across sessions. */
export const PROTO_NOW = '2026-06-20T10:00:00+05:30';
const NOW_MS = new Date(PROTO_NOW).getTime();

/** Grants stay valid for 12 months; re-granting creates a fresh grant. */
const CONSENT_VALID_DAYS = 365;
/** An unanswered invitation expires on its own — never interpreted as refusal. */
const INVITATION_VALID_DAYS = 7;

// ------------------------------------------------------------------
// Receipt construction — content only. The hash sealer is the single
// writer of `previousHash` and `hash`, derived from array order, so
// concurrent appends can never reference a stale hash.
// ------------------------------------------------------------------

/** Parse the numeric value of an AR-<base36> id. */
function receiptIdValue(id: string): number {
  const m = /^AR-([0-9A-Z]+)$/.exec(id);
  if (!m) return 0;
  return parseInt(m[1], 36);
}

/**
 * R-1 fix: ids are derived from the receipts that already exist, never from a
 * module-level counter. A module counter resets on every reload while persisted
 * receipts survive — the collision silently dropped new ledger events.
 */
function nextReceiptId(existing: Receipt[]): string {
  let max = 100;
  for (const r of existing) max = Math.max(max, receiptIdValue(r.id));
  return `AR-${(max + 1).toString(36).toUpperCase()}`;
}

function buildReceipt(
  existing: Receipt[],
  action: Receipt['action'],
  actor: string,
  detail: string,
  purpose: string,
  scope: string,
  expiresAt: string | null
): Receipt {
  return {
    id: nextReceiptId(existing),
    timestamp: PROTO_NOW,
    action, actor, detail, purpose, scope, expiresAt,
    previousHash: null,
    hash: '', // sealed asynchronously by the chain maintainer
  };
}

/** Receipt ids are unique — appends never duplicate, whatever the interleaving. */
function appendReceipt(c: VerificationCase, r: Receipt): Receipt[] {
  if (!c.receipts.some((x) => x.id === r.id)) return [...c.receipts, r];
  // Collision (two receipts built from the same snapshot): bump to a fresh id
  // derived from what actually exists. An event is never silently dropped.
  const bumped = { ...r, id: nextReceiptId(c.receipts) };
  return [...c.receipts, bumped];
}

// ------------------------------------------------------------------
// Consent / share / invitation semantics — single source of truth.
// ------------------------------------------------------------------

/** A grant is live only while granted AND unexpired. Never silently reactivated. */
export function isConsentActive(c: VerificationCase | null, pillar: PillarId): boolean {
  if (!c) return false;
  const rec = c.consents[pillar];
  if (!rec || rec.state !== 'granted') return false;
  if (rec.expiresAt && new Date(rec.expiresAt).getTime() < NOW_MS) return false;
  return true;
}

/** Derived presentation state — 'expired' is derived, never stored. */
export function consentDisplay(rec: ConsentRecord | undefined): ConsentDisplayState {
  if (!rec) return 'pending';
  if (rec.state === 'granted') {
    if (rec.expiresAt && new Date(rec.expiresAt).getTime() < NOW_MS) return 'expired';
    return 'granted';
  }
  return rec.state;
}

/** Shares that currently grant access. An expired grant ends its shares' access too. */
export function activeShares(c: VerificationCase | null): Share[] {
  if (!c) return [];
  return c.shares.filter((s) => shareStatus(s, PROTO_NOW) === 'active' && isConsentActive(c, s.pillar));
}

/** Effective invitation status — an unanswered invitation expires on its own. */
export function invitationEffectiveStatus(inv: Invitation | null): InvitationStatus {
  if (!inv) return 'draft';
  if (inv.status === 'sent' && inv.expiresAt && new Date(inv.expiresAt).getTime() < NOW_MS) return 'expired';
  return inv.status;
}

// ------------------------------------------------------------------
// Gate selectors — the single authoritative release logic.
// Every UI control and every reducer guard derives from these.
// ------------------------------------------------------------------
export interface Gates {
  /** Consent decided with at least one category granted — checks may begin. */
  canStart: boolean;
  /** Simulation may advance: single mode, or mutual with the release unlocked. */
  canVerify: boolean;
  /** Release state — single-mode cases are always released. */
  canRelease: boolean;
  /** Partner may view a pillar's values: active status-and-values share with live consent. */
  canViewPartner: (p: PillarId) => boolean;
  /** A new share may be created for this pillar: live grant. */
  canShare: (p: PillarId) => boolean;
  /** Subject sees their own granted categories. */
  canViewOwn: (p: PillarId) => boolean;
}

export function gatesFor(c: VerificationCase | null): Gates {
  if (!c) {
    return {
      canStart: false, canVerify: false, canRelease: false,
      canViewPartner: () => false, canShare: () => false, canViewOwn: () => false,
    };
  }
  const decided = c.scope.every((p) => c.consents[p]?.state !== 'pending');
  const grantedCount = c.scope.filter((p) => isConsentActive(c, p)).length;
  const released = c.mode === 'single' || c.mutualReleased;
  const live = activeShares(c);
  return {
    canStart: decided && grantedCount > 0,
    canVerify: released && c.simPhase < 5,
    canRelease: released,
    canViewPartner: (p) => live.some((s) => s.pillar === p && s.accessor === 'partner' && s.granularity === 'status-and-values'),
    canShare: (p) => isConsentActive(c, p),
    canViewOwn: (p) => c.scope.includes(p),
  };
}

// ------------------------------------------------------------------
// Fresh state
// ------------------------------------------------------------------
function placeholderClaim(pillar: PillarId): ClaimRecord {
  return {
    id: `${pillar}-claim`,
    pillarName: PILLAR_BY_ID[pillar].name,
    value: PILLAR_BY_ID[pillar].shortDescription,
    sourceType: '',
    identityMatch: '',
    certainty: 'requiresConsent',
    coverage: '',
    establishedAt: '',
    expiresAt: '',
    consentState: 'Not consented',
    doesNotMean: 'This does not mean the claim is true or false — the check simply has not been performed.',
    evidence: [],
    pathsThroughThread: [],
  };
}

/** Income-band claim — not present in the legacy sample case; band only, never an exact figure. */
const INCOME_CLAIM: ClaimRecord = {
  id: 'income-band',
  pillarName: 'Income band',
  value: 'Income band supported by documents the subject provided',
  sourceType: 'Documents provided voluntarily by the subject',
  identityMatch: 'Documents name the subject; employer name matches the employment finding.',
  certainty: 'supported',
  coverage: 'Reviewed the documents the subject chose to provide. Independent income confirmation was not attempted.',
  establishedAt: '2026-06-12',
  expiresAt: '2026-12-12',
  consentState: 'Consented — 8 June 2026',
  doesNotMean: 'This does not confirm an exact salary, other income sources, or net worth. Only the band, from the documents provided, is represented.',
  evidence: [
    {
      id: 'ev-inc-1',
      sourceType: 'Salary documents provided by the subject',
      retrievedAt: '2026-06-12T11:05:00+05:30',
      artifactHash: 'sha256:5d1e…8b3c',
      identityMatchReasoning: 'Documents carry the subject\u2019s name and the employer recorded in the employment finding. Band assessed from the documents alone.',
    },
  ],
  pathsThroughThread: ['claim', 'source', 'identityMatch', 'humanReview', 'coverage', 'result'],
};

/** Final claims per pillar, drawn from the coherent sample case. */
function finalClaimsFor(pillar: PillarId): ClaimRecord[] {
  switch (pillar) {
    case 'identity': return [sampleCase.claims.find((c) => c.id === 'identity-dob')!];
    case 'education': return [sampleCase.claims.find((c) => c.id === 'education-degree')!];
    case 'employment': return [
      sampleCase.claims.find((c) => c.id === 'employment-current')!,
      sampleCase.claims.find((c) => c.id === 'employment-dates')!,
    ];
    case 'income': return [INCOME_CLAIM];
    case 'marital': return [sampleCase.claims.find((c) => c.id === 'marital-status')!];
    case 'legal': return [sampleCase.claims.find((c) => c.id === 'legal-records')!];
    case 'business': return [sampleCase.claims.find((c) => c.id === 'business-directorship')!];
    case 'digital': return [sampleCase.claims.find((c) => c.id === 'digital-footprint')!];
  }
}

/** Legal-pillar claims progress through a clarification step before settling. */
function legalClaimAtPhase(phase: number): ClaimRecord {
  const base = sampleCase.claims.find((c) => c.id === 'legal-records')!;
  if (phase < 4) {
    return {
      ...base,
      certainty: 'requiresClarification',
      doesNotMean: 'This does not mean the claim has failed — the verification process needs more information.',
    };
  }
  return base;
}

/** Marital-pillar claim: no matching record within the coverage searched — never a clean record. */
function maritalClaim(): ClaimRecord {
  const base = sampleCase.claims.find((c) => c.id === 'marital-status')!;
  return { ...base, certainty: 'noMatchFound' };
}

/** Claims that are final as soon as the pillar's check completes. */
function claimForPillarAtPhase(pillar: PillarId, phase: number): ClaimRecord[] {
  const finals = finalClaimsFor(pillar);
  if (pillar === 'legal' && phase < 4) return [legalClaimAtPhase(phase)];
  if (pillar === 'marital') return [maritalClaim()];
  return finals;
}

/** Which pillars have completed their search at a given simulation phase. */
function pillarsDoneAt(phase: number, scope: PillarId[]): Set<PillarId> {
  const done = new Set<PillarId>();
  if (phase >= 1) for (const p of scope) if (p === 'identity' || p === 'business') done.add(p);
  if (phase >= 2) for (const p of scope) if (p === 'education' || p === 'digital') done.add(p);
  if (phase >= 3) for (const p of scope) if (p === 'employment' || p === 'income' || p === 'marital') done.add(p);
  if (phase >= 4) for (const p of scope) if (p === 'legal') done.add(p);
  return done;
}

/** Pillars currently under review (checked, not yet reviewed) at a phase. */
function pillarsReviewingAt(phase: number, scope: PillarId[]): Set<PillarId> {
  const reviewing = new Set<PillarId>();
  const stages: PillarId[][] = [
    ['identity', 'business'],
    ['education', 'digital'],
    ['employment', 'income', 'marital'],
    ['legal'],
  ];
  stages.forEach((batch, i) => {
    const batchPhase = i + 1;
    if (phase === batchPhase) for (const p of scope) if (batch.includes(p)) reviewing.add(p);
  });
  return reviewing;
}

function initialState(): AppState {
  return { user: null, caseData: null, demoViewRole: 'subject' };
}

function freshConsents(scope: PillarId[]) {
  const consents = {} as VerificationCase['consents'];
  for (const p of ['identity', 'education', 'employment', 'income', 'marital', 'legal', 'business', 'digital'] as PillarId[]) {
    consents[p] = {
      pillar: p,
      state: scope.includes(p) ? 'pending' : 'declined',
      grantedAt: null,
      withdrawnAt: null,
      expiresAt: null,
    };
  }
  return consents;
}

// ------------------------------------------------------------------
// Actions
// ------------------------------------------------------------------
export type Action =
  | { type: 'SIGNUP'; name: string; email: string; phone?: string }
  | { type: 'LOGIN'; email: string }
  | { type: 'LOGOUT' }
  | { type: 'COMPLETE_ONBOARDING'; path: OnboardingPath }
  | { type: 'CREATE_CASE'; mode: CaseMode; scope: PillarId[]; subjectName: string }
  | { type: 'GRANT_CONSENT'; pillar: PillarId }
  | { type: 'DECLINE_CONSENT'; pillar: PillarId }
  | { type: 'WITHDRAW_CONSENT'; pillar: PillarId }
  | { type: 'GRANT_ALL_CONSENT' }
  | { type: 'CREATE_SHARE'; pillar: PillarId; accessor: 'partner' | 'family'; purpose: string; granularity: Granularity; expiresInDays: number }
  | { type: 'REVOKE_SHARE'; shareId: string }
  | { type: 'SEND_INVITATION'; toName: string; lang: InvitationLang }
  | { type: 'SIMULATE_INVITATION_RESPONSE'; accept: boolean }
  | { type: 'RESET_INVITATION' }
  | { type: 'ACCEPT_INCOMING_INVITATION' }
  | { type: 'DECLINE_INCOMING_INVITATION' }
  | { type: 'REOPEN_INCOMING_INVITATION' }
  | { type: 'SIMULATE_EXPIRY' }
  | { type: 'ADVANCE_SIMULATION' }
  | { type: 'RESET_SIMULATION' }
  | { type: 'RECORD_ACCESS'; shareId: string }
  | { type: 'SUBMIT_DISPUTE'; claimId: string; reason: string; context: string }
  | { type: 'SET_DEMO_ROLE'; role: 'subject' | 'partner' | 'family' }
  | { type: 'DELETE_ACCOUNT' }
  | { type: 'HYDRATE'; state: AppState }
  | { type: 'SEAL_HASHES'; sealed: Receipt[] };

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
function touchCase(c: VerificationCase): VerificationCase {
  return { ...c, updatedAt: PROTO_NOW };
}

function computeStatus(c: VerificationCase): VerificationCase['status'] {
  if (c.mode === 'mutual' && c.invitation && invitationEffectiveStatus(c.invitation) === 'sent') return 'awaiting-participant';
  if (c.mode === 'mutual' && !c.mutualReleased && invitationEffectiveStatus(c.invitation) === 'declined') return 'awaiting-consent';
  if (c.mutualReleased && c.simPhase >= 5) return 'complete';
  if (c.simPhase > 0) return 'in-progress';
  return 'awaiting-consent';
}

// ------------------------------------------------------------------
// Reducer
// ------------------------------------------------------------------
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state;

    case 'SIGNUP': {
      const user: AppUser = {
        name: action.name,
        email: action.email,
        onboarded: false,
        path: null,
        phone: action.phone?.trim() || undefined,
        invitedStatus: null,
        session: true,
      };
      return { ...state, user };
    }

    case 'LOGIN': {
      // L-1 fix: a returning user keeps their identity, onboarding state and
      // workspace. A different email starts a fresh profile (and workspace).
      const existing = state.user && state.user.email.toLowerCase() === action.email.toLowerCase() ? state.user : null;
      const user: AppUser = existing
        ? { ...existing, onboarded: true, session: true }
        : {
            name: action.email.split('@')[0] || 'User',
            email: action.email,
            onboarded: false,
            path: null,
            phone: undefined,
            invitedStatus: null,
            session: true,
          };
      return existing
        ? { ...state, user }
        : { ...initialState(), user };
    }

    case 'LOGOUT':
      // Logout ends the session but preserves the profile and workspace on the
      // device — the next login continues where the user left off.
      return state.user
        ? { ...state, user: { ...state.user, session: false } }
        : state;

    case 'DELETE_ACCOUNT':
      return initialState();

    case 'COMPLETE_ONBOARDING': {
      if (!state.user) return state;
      const invitedStatus = action.path === 'invited' ? (state.user.invitedStatus ?? 'pending') : state.user.invitedStatus;
      return { ...state, user: { ...state.user, onboarded: true, path: action.path, invitedStatus } };
    }

    case 'CREATE_CASE': {
      const scope = action.scope;
      const claims: VerificationCase['claims'] = {};
      const consents = freshConsents(scope);
      const first: Receipt = buildReceipt(
        [], 'scope-created', 'You',
        `Verification scope created — ${scope.length} categor${scope.length === 1 ? 'y' : 'ies'}`,
        'Matrimonial verification', scope.map((p) => PILLAR_BY_ID[p].name).join(' · '), null
      );
      const confirmed: Receipt = buildReceipt(
        [first], 'scope-confirmed', 'You',
        'Scope confirmed. Consent requested for each category.',
        'Matrimonial verification', scope.map((p) => PILLAR_BY_ID[p].name).join(' · '), null
      );
      const caseData: VerificationCase = {
        id: 'IA-DEMO-0001',
        subjectName: action.subjectName,
        mode: action.mode,
        status: 'awaiting-consent',
        scope,
        createdAt: PROTO_NOW,
        updatedAt: PROTO_NOW,
        consents,
        claims,
        shares: [],
        receipts: [first, confirmed],
        invitation: action.mode === 'mutual'
          ? { id: 'INV-001', toName: 'Arun Krishnan', lang: 'english', status: 'draft', sentAt: null, respondedAt: null, expiresAt: null }
          : null,
        disputes: [],
        simPhase: 0,
        mutualReleased: false,
      };
      return { ...state, caseData };
    }

    case 'GRANT_CONSENT': {
      const c = state.caseData;
      if (!c) return state;
      const expiresAt = new Date(NOW_MS + CONSENT_VALID_DAYS * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const consents = {
        ...c.consents,
        [action.pillar]: { pillar: action.pillar, state: 'granted' as ConsentState, grantedAt: PROTO_NOW, withdrawnAt: null, expiresAt },
      };
      const r = buildReceipt(
        c.receipts, 'consent-granted', 'Subject (you)',
        `Consent granted — ${PILLAR_BY_ID[action.pillar].name}`,
        'Matrimonial verification', PILLAR_BY_ID[action.pillar].name, null
      );
      return { ...state, caseData: touchCase({ ...c, consents, receipts: appendReceipt(c, r) }) };
    }

    case 'DECLINE_CONSENT': {
      const c = state.caseData;
      if (!c) return state;
      const consents = {
        ...c.consents,
        [action.pillar]: { pillar: action.pillar, state: 'declined' as ConsentState, grantedAt: null, withdrawnAt: null, expiresAt: null },
      };
      const r = buildReceipt(
        c.receipts, 'consent-declined', 'Subject (you)',
        `Consent declined for now — ${PILLAR_BY_ID[action.pillar].name}`,
        'Matrimonial verification', PILLAR_BY_ID[action.pillar].name, null
      );
      return { ...state, caseData: touchCase({ ...c, consents, receipts: appendReceipt(c, r) }) };
    }

    case 'WITHDRAW_CONSENT': {
      const c = state.caseData;
      if (!c) return state;
      const consents = {
        ...c.consents,
        [action.pillar]: { pillar: action.pillar, state: 'withdrawn' as ConsentState, grantedAt: null, withdrawnAt: PROTO_NOW, expiresAt: null },
      };
      // Withdrawal also revokes any active share on this pillar
      const shares = c.shares.map((s) =>
        s.pillar === action.pillar && !s.revokedAt ? { ...s, revokedAt: PROTO_NOW } : s
      );
      const r = buildReceipt(
        c.receipts, 'consent-withdrawn', 'Subject (you)',
        `Consent withdrawn — ${PILLAR_BY_ID[action.pillar].name}. Related shares ended.`,
        'Matrimonial verification', PILLAR_BY_ID[action.pillar].name, null
      );
      return { ...state, caseData: touchCase({ ...c, consents, shares, receipts: appendReceipt(c, r) }) };
    }

    case 'GRANT_ALL_CONSENT': {
      let next: AppState = state;
      for (const p of state.caseData?.scope ?? []) {
        next = reducer(next, { type: 'GRANT_CONSENT', pillar: p });
      }
      return next;
    }

    case 'CREATE_SHARE': {
      const c = state.caseData;
      // Central gate: a share can only be created over a live grant.
      if (!c || !isConsentActive(c, action.pillar)) return state;
      const expires = new Date(NOW_MS + action.expiresInDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      // Family delegates can never hold a values share — enforced here, not just in UI.
      const granularity: Granularity = action.accessor === 'family' ? 'status-only' : action.granularity;
      const share: Share = {
        id: `SH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        pillar: action.pillar,
        accessor: action.accessor,
        purpose: action.purpose,
        granularity,
        createdAt: PROTO_NOW,
        expiresAt: expires,
        revokedAt: null,
      };
      const r = buildReceipt(
        c.receipts, 'share-created', 'Subject (you)',
        `Share created — ${PILLAR_BY_ID[action.pillar].name} → ${action.accessor === 'partner' ? 'Partner' : 'Family delegate'} (${granularity === 'status-only' ? 'status only' : 'status and values'})`,
        action.purpose, PILLAR_BY_ID[action.pillar].name, expires
      );
      return { ...state, caseData: touchCase({ ...c, shares: [...c.shares, share], receipts: appendReceipt(c, r) }) };
    }

    case 'REVOKE_SHARE': {
      const c = state.caseData;
      if (!c) return state;
      const share = c.shares.find((s) => s.id === action.shareId);
      if (!share || share.revokedAt) return state;
      const shares = c.shares.map((s) => (s.id === action.shareId ? { ...s, revokedAt: PROTO_NOW } : s));
      const r = buildReceipt(
        c.receipts, 'share-revoked', 'Subject (you)',
        `Share revoked — ${PILLAR_BY_ID[share.pillar].name} → ${share.accessor === 'partner' ? 'Partner' : 'Family delegate'}`,
        share.purpose, PILLAR_BY_ID[share.pillar].name, null
      );
      return { ...state, caseData: touchCase({ ...c, shares, receipts: appendReceipt(c, r) }) };
    }

    case 'SEND_INVITATION': {
      const c = state.caseData;
      if (!c || !c.invitation) return state;
      const sentAt = PROTO_NOW;
      const expiresAt = new Date(NOW_MS + INVITATION_VALID_DAYS * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const invitation = {
        ...c.invitation, toName: action.toName || c.invitation.toName, lang: action.lang,
        status: 'sent' as const, sentAt, expiresAt,
      };
      const r = buildReceipt(
        c.receipts, 'invitation-sent', 'You',
        `Invitation sent to ${invitation.toName}`,
        'Mutual verification', 'Participation invitation', expiresAt
      );
      const next = touchCase({ ...c, invitation, receipts: appendReceipt(c, r), status: 'awaiting-participant' });
      next.status = computeStatus(next);
      return { ...state, caseData: next };
    }

    case 'SIMULATE_INVITATION_RESPONSE': {
      const c = state.caseData;
      if (!c || !c.invitation || invitationEffectiveStatus(c.invitation) !== 'sent') return state;
      let next = c;
      let mutualReleased = c.mutualReleased;
      let invitation = c.invitation;
      if (action.accept) {
        invitation = { ...invitation, status: 'accepted' as const, respondedAt: PROTO_NOW, expiresAt: null };
        next = touchCase({ ...c, invitation, receipts: appendReceipt(c, buildReceipt(c.receipts, 'invitation-accepted', invitation.toName, `${invitation.toName} accepted the invitation and completed their own verification`, 'Mutual verification', 'Participation', null)) });
        mutualReleased = true;
        next = touchCase({ ...next, mutualReleased, receipts: appendReceipt(next, buildReceipt(next.receipts, 'mutual-release', 'InaiAram system', 'Both sides complete — mutual release unlocked. Findings release to each party per their grants.', 'Mutual verification', 'All categories in scope', null)) });
      } else {
        invitation = { ...invitation, status: 'declined' as const, respondedAt: PROTO_NOW, expiresAt: null };
        next = touchCase({ ...c, invitation, receipts: appendReceipt(c, buildReceipt(c.receipts, 'invitation-declined', invitation.toName, `${invitation.toName} declined. Nothing was released. This is information, not a verdict.`, 'Mutual verification', 'Participation', null)) });
      }
      next = { ...next, mutualReleased };
      next.status = computeStatus(next);
      return { ...state, caseData: next };
    }

    case 'RESET_INVITATION': {
      // Re-open the invitation after a decline or expiry — status back to draft.
      // The original receipt stays in the ledger; a new send appends new receipts.
      const c = state.caseData;
      if (!c || !c.invitation) return state;
      const st = invitationEffectiveStatus(c.invitation);
      if (st !== 'declined' && st !== 'expired') return state;
      const invitation = { ...c.invitation, status: 'draft' as const, respondedAt: null, sentAt: null, expiresAt: null };
      const next = touchCase({ ...c, invitation, mutualReleased: false });
      next.status = computeStatus(next);
      return { ...state, caseData: next };
    }

    case 'ACCEPT_INCOMING_INVITATION': {
      // The invited-person journey: the other side has already completed their
      // verification (mutualReleased), so only this side's consent + checks remain.
      const u = state.user;
      if (!u || state.caseData) return state;
      const scope: PillarId[] = ['identity', 'education', 'employment', 'marital'];
      const first = buildReceipt([], 'invitation-accepted', 'A. Meera Krishnan', 'A. Meera Krishnan accepted your participation — their side is complete', 'Mutual verification', 'Participation', null);
      const release = buildReceipt([first], 'mutual-release', 'InaiAram system', 'Inviter side complete — your findings release to you as they are established', 'Mutual verification', 'All categories in scope', null);
      const caseData: VerificationCase = {
        id: 'IA-DEMO-0001',
        subjectName: u.name,
        mode: 'mutual',
        status: 'awaiting-consent',
        scope,
        createdAt: PROTO_NOW,
        updatedAt: PROTO_NOW,
        consents: freshConsents(scope),
        claims: {},
        shares: [],
        receipts: [first, release],
        invitation: { id: 'INV-002', toName: 'A. Meera Krishnan', lang: 'english', status: 'accepted', sentAt: PROTO_NOW, respondedAt: PROTO_NOW, expiresAt: null },
        disputes: [],
        simPhase: 0,
        mutualReleased: true,
      };
      return { ...state, user: { ...u, invitedStatus: 'accepted' as const }, caseData };
    }

    case 'DECLINE_INCOMING_INVITATION': {
      const u = state.user;
      if (!u || u.invitedStatus !== 'pending' || state.caseData) return state;
      // Refusal is information, never a verdict — nothing is released, nothing inferred.
      return { ...state, user: { ...u, invitedStatus: 'declined' as const } };
    }

    case 'REOPEN_INCOMING_INVITATION': {
      const u = state.user;
      if (!u || u.invitedStatus !== 'declined' || state.caseData) return state;
      return { ...state, user: { ...u, invitedStatus: 'pending' as const } };
    }

    case 'SIMULATE_EXPIRY': {
      // Demo control: advance the frozen clock past every expiry so the lifecycle
      // is demonstrable. Nothing is silently extended — expired states are real.
      const c = state.caseData;
      if (!c) return state;
      const PAST = '2026-01-01';
      const consents = {} as VerificationCase['consents'];
      for (const p of ['identity', 'education', 'employment', 'income', 'marital', 'legal', 'business', 'digital'] as PillarId[]) {
        const rec = c.consents[p];
        consents[p] = rec
          ? (rec.state === 'granted' ? { ...rec, expiresAt: PAST } : rec)
          : { pillar: p, state: 'pending' as ConsentState, grantedAt: null, withdrawnAt: null, expiresAt: null };
      }
      const shares = c.shares.map((s) =>
        s.revokedAt || shareStatus(s, PROTO_NOW) === 'expired' ? s : { ...s, expiresAt: PAST }
      );
      const invitation = c.invitation && invitationEffectiveStatus(c.invitation) === 'sent'
        ? { ...c.invitation, expiresAt: PAST }
        : c.invitation;
      const r = buildReceipt(
        c.receipts, 'expiry-simulated', 'Demo controls',
        'Demo clock advanced past every expiry — expired grants, shares and invitations now show their expired state. Nothing was silently extended.',
        'Demonstration', 'All active grants, shares and invitations', null
      );
      return { ...state, caseData: touchCase({ ...c, consents, shares, invitation, receipts: appendReceipt(c, r) }) };
    }

    case 'ADVANCE_SIMULATION': {
      // G-1: the both-or-neither gate is enforced HERE, in the reducer — hiding a
      // button is never sufficient. Any UI path that reaches this action in a
      // locked mutual case is refused.
      const c = state.caseData;
      if (!c || !gatesFor(c).canVerify) return state;
      const phase = Math.min(c.simPhase + 1, 5) as VerificationCase['simPhase'];
      const claims: VerificationCase['claims'] = { ...c.claims };
      const receipts = [...c.receipts];
      const done = pillarsDoneAt(phase, c.scope);
      const reviewing = pillarsReviewingAt(phase, c.scope);
      for (const p of c.scope) {
        const consentsOk = isConsentActive(c, p);
        if (!consentsOk) {
          claims[p] = [placeholderClaim(p)];
          continue;
        }
        if (done.has(p)) {
          claims[p] = claimForPillarAtPhase(p, phase);
        } else if (reviewing.has(p)) {
          claims[p] = [{ ...placeholderClaim(p), certainty: 'underReview', consentState: `Consented — 8 June 2026` }];
        } else {
          // Consented but the checks have not reached this category yet —
          // no claim exists, so the UI shows its internal "not started" state.
          delete claims[p];
        }
      }
      if (phase > c.simPhase) {
        const batch = reviewing.size > 0 ? reviewing : done;
        const names = Array.from(batch).map((p) => PILLAR_BY_ID[p].name).join(', ');
        receipts.push(buildReceipt(receipts, 'finding-established', 'InaiAram verification', `Checks progressed — ${names || 'next stage'}`, 'Matrimonial verification', names || 'Next stage', null));
      }
      const next: VerificationCase = touchCase({ ...c, simPhase: phase, claims, receipts });
      next.status = computeStatus(next);
      return { ...state, caseData: next };
    }

    case 'RESET_SIMULATION': {
      // Findings reset to zero; consent grants persist — re-consenting is not
      // required to replay the demonstration.
      const c = state.caseData;
      if (!c) return state;
      const claims: VerificationCase['claims'] = {};
      const next = { ...c, simPhase: 0 as const, claims };
      next.status = computeStatus(next);
      return { ...state, caseData: touchCase(next) };
    }

    case 'RECORD_ACCESS': {
      // Partner/family access event — the no-silent-access guarantee in action.
      const c = state.caseData;
      if (!c) return state;
      const share = c.shares.find((s) => s.id === action.shareId && !s.revokedAt);
      if (!share || shareStatus(share, PROTO_NOW) !== 'active' || !isConsentActive(c, share.pillar)) return state;
      const r = buildReceipt(
        c.receipts, 'share-accessed',
        share.accessor === 'partner' ? 'Partner' : 'Family delegate',
        `Accessed ${PILLAR_BY_ID[share.pillar].name} ${share.granularity === 'status-only' ? 'verification status' : 'verification status and values'}`,
        share.purpose,
        PILLAR_BY_ID[share.pillar].name,
        share.expiresAt
      );
      return { ...state, caseData: touchCase({ ...c, receipts: appendReceipt(c, r) }) };
    }

    case 'SUBMIT_DISPUTE': {
      const c = state.caseData;
      if (!c) return state;
      const dispute = {
        id: `DP-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        claimId: action.claimId,
        reason: action.reason,
        context: action.context,
        submittedAt: PROTO_NOW,
        status: 'submitted' as const,
      };
      const r = buildReceipt(
        c.receipts, 'dispute-submitted', 'Subject (you)',
        `Dispute submitted — ${action.claimId}`,
        'Correction of record', action.claimId, null
      );
      return { ...state, caseData: touchCase({ ...c, disputes: [...c.disputes, dispute], receipts: appendReceipt(c, r) }) };
    }

    case 'SET_DEMO_ROLE':
      return { ...state, demoViewRole: action.role };

    case 'SEAL_HASHES': {
      const c = state.caseData;
      if (!c) return state;
      // Merge by id so receipts appended while sealing was in flight are kept.
      // First occurrence wins (de-dupes interleaved appends); unsealed-but-known
      // ids from the fresh seal replace their stale row.
      const sealedById = new Map(action.sealed.map((r) => [r.id, r]));
      const seen = new Set<string>();
      const merged: Receipt[] = [];
      for (const r of c.receipts) {
        if (seen.has(r.id)) continue;
        seen.add(r.id);
        merged.push(sealedById.get(r.id) ?? r);
      }
      return { ...state, caseData: { ...c, receipts: merged } };
    }

    default:
      return state;
  }
}

// ------------------------------------------------------------------
// Chain maintenance — the sealer is the SINGLE writer of previousHash/hash.
// It runs whenever the chain is not fully sealed and consistent with array
// order: fresh receipts (empty hash), or appends that landed mid-seal.
// Self-healing: relinking after an append repairs the whole chain, so
// verifyLedger always reflects real, intact linkage.
// ------------------------------------------------------------------
function chainNeedsSealing(receipts: Receipt[]): boolean {
  let prev: string | null = null;
  for (const r of receipts) {
    if (r.hash === '') return true;
    if ((r.previousHash ?? null) !== prev) return true;
    prev = r.hash;
  }
  return false;
}

function useHashSealer(state: AppState, dispatch: React.Dispatch<Action>) {
  const pending = useRef(false);
  useEffect(() => {
    const c = state.caseData;
    if (!c) return;
    if (!chainNeedsSealing(c.receipts) || pending.current) return;
    pending.current = true;
    (async () => {
      let prev: string | null = null;
      const sealed: Receipt[] = [];
      for (const r of c.receipts) {
        const linked: Receipt = { ...r, previousHash: prev };
        const h = await computeHash(linked);
        sealed.push({ ...linked, hash: h });
        prev = h;
      }
      pending.current = false;
      if (JSON.stringify(sealed) !== JSON.stringify(c.receipts)) {
        dispatch({ type: 'SEAL_HASHES', sealed });
      }
    })();
  }, [state, dispatch]);
}

// ------------------------------------------------------------------
// Provider
// ------------------------------------------------------------------
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      /* corrupted storage — start fresh */
    }
    return initialState();
  });

  // Persist (strip sealed-hash churn noise by storing as-is)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable — prototype continues in memory */
    }
  }, [state]);

  useHashSealer(state, dispatch);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

/** Convenience selectors */
export function useCase(): VerificationCase | null {
  return useApp().state.caseData;
}

export function useGates(): Gates {
  return gatesFor(useCase());
}