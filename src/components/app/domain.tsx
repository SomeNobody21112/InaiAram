/**
 * DOMAIN COMPONENTS — the InaiAram product vocabulary as reusable UI.
 * StateChip (app), CoverageIndicator, ConsentControl, VerificationRow,
 * EvidenceChain, RoleSwitcher, AccessReceiptCard, ShareGrantCard, MutualGate.
 */
import type { ClaimRecord } from '../../data/sampleCase';
import { en } from '../../content/en';
import { PILLAR_BY_ID, shareStatus, type ConsentDisplayState, type ConsentRecord, type PillarId, type Receipt, type Share } from '../../store/types';
import { PROTO_NOW, consentDisplay } from '../../store/app';
import { Button } from '../ui/Button';
import { Disclosure, Tooltip } from '../ui/primitives';

// =================================================================
// SHARED PILL SYSTEM — one consistent status/pill visual language.
// Semantics stay distinct (case status / coverage / invitation /
// consent) but the rendering is a single component.
// =================================================================
export type PillTone = 'sage' | 'gold' | 'terracotta' | 'terracotta-deep' | 'taupe' | 'neutral';

const PILL_TONES: Record<PillTone, string> = {
  sage: 'text-sage bg-sage/10 border-sage/20',
  gold: 'text-gold bg-gold/10 border-gold/20',
  terracotta: 'text-terracotta bg-terracotta/10 border-terracotta/20',
  'terracotta-deep': 'text-terracotta-deep bg-terracotta-deep/10 border-terracotta-deep/20',
  taupe: 'text-taupe bg-taupe/10 border-taupe/20',
  neutral: 'text-ink-3 bg-surface-raised border-line',
};

export function Pill({ tone = 'neutral', mono = false, children, className = '' }: {
  tone?: PillTone;
  mono?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${mono ? 'font-mono uppercase tracking-wider text-[0.625rem] px-2 py-0.5' : ''} ${PILL_TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** Case status pill (dashboard + verification list + detail). */
export function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; tone: PillTone }> = {
    'awaiting-consent': { label: 'Awaiting consent', tone: 'gold' },
    'awaiting-participant': { label: 'Awaiting participant', tone: 'gold' },
    'in-progress': { label: 'In progress', tone: 'gold' },
    complete: { label: 'Complete', tone: 'sage' },
    draft: { label: 'Draft', tone: 'taupe' },
  };
  const m = map[status] ?? map.draft;
  return <Pill tone={m.tone}>{m.label}</Pill>;
}

/** Coverage pill (Searched / Partial / Not searched). */
export function CoveragePill({ status }: { status: 'searched' | 'partial' | 'not-searched' }) {
  const map = {
    searched: { label: 'Searched', tone: 'sage' as PillTone },
    partial: { label: 'Partial', tone: 'gold' as PillTone },
    'not-searched': { label: 'Not searched', tone: 'taupe' as PillTone },
  };
  const m = map[status];
  return <Pill tone={m.tone} mono>{m.label}</Pill>;
}

/** Invitation status pill. */
export function InvitationPill({ status }: { status: string }) {
  const map: Record<string, { label: string; tone: PillTone }> = {
    draft: { label: 'Draft', tone: 'taupe' },
    sent: { label: 'Awaiting response', tone: 'gold' },
    accepted: { label: 'Accepted', tone: 'sage' },
    declined: { label: 'Declined', tone: 'taupe' },
    expired: { label: 'Expired', tone: 'taupe' },
  };
  const m = map[status] ?? map.draft;
  return <Pill tone={m.tone}>{m.label}</Pill>;
}

/** Sharing-boundary chip — communicates ONLY the boundary, never the hidden state. */
export function BoundaryChip({ label }: { label: string }) {
  return (
    <Pill tone="neutral" mono>
      <span aria-hidden="true">—</span> {label}
    </Pill>
  );
}

// ---------------- Result state chip (app) ----------------
type ChipState = 'verified' | 'supported' | 'noMatchFound' | 'conflicting' | 'requiresClarification' | 'unavailable' | 'candidateControlled' | 'underReview' | 'requiresConsent';

const chipStyle: Record<ChipState, string> = {
  verified: 'text-sage bg-sage/10 border-sage/20',
  supported: 'text-gold bg-gold/10 border-gold/20',
  requiresConsent: 'text-terracotta bg-terracotta/10 border-terracotta/20',
  candidateControlled: 'text-terracotta bg-terracotta/10 border-terracotta/20',
  noMatchFound: 'text-taupe bg-taupe/10 border-taupe/20',
  conflicting: 'text-terracotta-deep bg-terracotta-deep/10 border-terracotta-deep/20',
  requiresClarification: 'text-gold bg-gold/10 border-gold/20',
  unavailable: 'text-ink-3 bg-ink-3/10 border-ink-3/20',
  underReview: 'text-gold-soft bg-gold-soft/10 border-gold-soft/20',
};

const chipGlyph: Record<ChipState, string> = {
  verified: '✓', supported: '◑', requiresConsent: '🔑', candidateControlled: '🔒',
  noMatchFound: '○', conflicting: '⇄', requiresClarification: '⊕', unavailable: '—', underReview: '◷',
};

export function StateChip({ state, showInfo = false }: { state: ChipState; showInfo?: boolean }) {
  const info = en.states[state];
  return (
    <div className="inline-flex flex-col items-start gap-2">
      <Tooltip label="What does this state mean?">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.6875rem] font-medium ${chipStyle[state]}`} aria-label={`Result state: ${info.label}`}>
          <span aria-hidden="true">{chipGlyph[state]}</span>
          {info.label}
        </span>
      </Tooltip>
      {showInfo && (
        <div className="max-w-sm p-3 rounded-lg bg-surface-raised border border-line text-xs leading-relaxed">
          <p className="text-ink font-medium mb-1">{info.description}</p>
          <p className="text-ink-3 italic">What this does not mean: {info.doesNotMean}</p>
        </div>
      )}
    </div>
  );
}

// ---------------- Category chip (consent-aware presentation) ----------------
/**
 * Internal progress presentation — clearly distinct from the nine canonical
 * result states. A category with granted consent that checks have not yet
 * reached is "Not started yet", never "Requires consent".
 */
export function ProgressChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.6875rem] font-medium text-ink-3 bg-surface-raised border-line">
      <span aria-hidden="true">◷</span>
      {label}
    </span>
  );
}

/** Consent presentation chip — handles the derived 'expired' state. */
export function ConsentStatePill({ consent }: { consent: ConsentRecord | undefined }) {
  const state = consentDisplay(consent);
  const map: Record<ConsentDisplayState, { label: string; tone: PillTone; glyph: string }> = {
    granted: { label: 'Granted', tone: 'sage', glyph: '✓' },
    pending: { label: 'Requires consent', tone: 'gold', glyph: '🔑' },
    declined: { label: 'Declined', tone: 'taupe', glyph: '○' },
    withdrawn: { label: 'Withdrawn', tone: 'taupe', glyph: '—' },
    expired: { label: 'Expired', tone: 'taupe', glyph: '⧗' },
  };
  const m = map[state];
  return <Pill tone={m.tone} mono><span aria-hidden="true">{m.glyph}</span> {m.label}</Pill>;
}

export function CategoryStateChip({ claim, consentState }: { claim?: ClaimRecord; consentState?: string }) {
  const granted = consentState === 'granted';
  const declinedLike = consentState === 'declined' || consentState === 'withdrawn';
  if (claim && claim.certainty !== 'requiresConsent') return <StateChip state={claim.certainty} />;
  if (granted && !declinedLike) return <ProgressChip label="Not started yet" />;
  return <StateChip state="requiresConsent" />;
}

// ---------------- Coverage indicator ----------------
export function CoverageIndicator({ status, reason }: { status: 'searched' | 'partial' | 'not-searched'; reason?: string }) {
  const style = status === 'searched' ? 'bg-sage/10 text-sage border-sage/20'
    : status === 'partial' ? 'bg-gold/10 text-gold border-gold/20'
    : 'bg-taupe/10 text-taupe border-taupe/20';
  const label = status === 'searched' ? 'Searched' : status === 'partial' ? 'Partial' : 'Not searched';
  return (
    <Tooltip label={reason ?? label}>
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[0.625rem] font-mono uppercase tracking-wider ${style}`}>
        {label}
      </span>
    </Tooltip>
  );
}

// ---------------- Claim hierarchy: state → meaning → why → evidence → coverage ----------------
export function ClaimDisclosure({ claim, mode = 'complete', defaultOpen = false }: {
  claim: ClaimRecord;
  mode?: 'complete' | 'progress';
  defaultOpen?: boolean;
}) {
  const notYet = mode === 'progress';
  return (
    <div>
      <Disclosure summary={notYet ? 'Why this result?' : 'View evidence and coverage'} defaultOpen={defaultOpen}>
        <EvidenceChain claim={claim} mode={mode} />
      </Disclosure>
    </div>
  );
}

// ---------------- Evidence chain (claim → … → result) ----------------
const NODE_ORDER = ['claim', 'source', 'identityMatch', 'corroboration', 'humanReview', 'coverage', 'result'] as const;
const NODE_LABELS: Record<(typeof NODE_ORDER)[number], string> = {
  claim: 'Claim', source: 'Source', identityMatch: 'Identity Match', corroboration: 'Corroboration',
  humanReview: 'Human Review', coverage: 'Coverage', result: 'Result',
};

export function EvidenceChain({ claim, mode = 'complete' }: { claim: ClaimRecord; mode?: 'complete' | 'progress' }) {
  const notYet = mode === 'progress';
  return (
    <ol className="relative ml-1 pl-6 space-y-0" aria-label={`Evidence thread for ${claim.pillarName}`}>
      <div className="absolute left-[7px] top-2 bottom-6 w-px bg-line-strong" aria-hidden="true" />
      {NODE_ORDER.map((node, i) => {
        const onPath = claim.pathsThroughThread.includes(node);
        const last = i === NODE_ORDER.length - 1;
        const ring = !onPath
          ? 'border-line bg-surface'
          : last ? 'border-sage bg-sage/10' : 'border-terracotta/50 bg-terracotta/5';
        let nodeData: string | null = null;
        if (onPath && !notYet) {
          if (node === 'claim') nodeData = claim.value;
          else if (node === 'source') nodeData = claim.sourceType || '—';
          else if (node === 'identityMatch') nodeData = claim.identityMatch || '—';
          else if (node === 'coverage') nodeData = claim.coverage || '—';
          else if (node === 'result') nodeData = `${en.states[claim.certainty].label}${claim.establishedAt ? ` · established ${claim.establishedAt}` : ''}${claim.expiresAt ? ` · expires ${claim.expiresAt}` : ''}`;
        }
        return (
          <li key={node} className="relative pb-5 last:pb-0">
            <span className={`absolute -left-6 top-1 w-[15px] h-[15px] rounded-full border-2 ${ring} box-border`} aria-hidden="true" />
            <div className={`flex items-center gap-2 mb-0.5 ${onPath ? '' : 'opacity-45'}`}>
              <span className="label-mono text-ink-3">{String(i + 1).padStart(2, '0')} · {NODE_LABELS[node]}</span>
              {!onPath && <span className="text-[0.625rem] italic text-ink-3">not applicable to this claim</span>}
            </div>
            {nodeData && <p className="text-[0.8125rem] text-ink-2 leading-relaxed">{nodeData}</p>}
            {onPath && node === 'result' && !notYet && (
              <p className="text-xs text-ink-3 italic mt-1.5">{claim.doesNotMean}</p>
            )}
            {onPath && node === 'corroboration' && !notYet && (
              <p className="text-[0.75rem] text-ink-3 mt-1">
                {claim.evidence.length > 1 ? `${claim.evidence.length} independent items retrieved` : 'Single source — treated as provisional until corroborated'}
              </p>
            )}
            {onPath && node === 'humanReview' && !notYet && (
              <p className="text-[0.75rem] text-ink-3 mt-1">Reviewed by a named reviewer before reporting.</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ---------------- Evidence items (source receipts) ----------------
export function EvidenceItems({ claim }: { claim: ClaimRecord }) {
  if (claim.evidence.length === 0) return null;
  return (
    <div className="space-y-2">
      <span className="label-mono text-ink-3 block">Evidence</span>
      {claim.evidence.map((ev) => (
        <div key={ev.id} className="p-3.5 rounded-lg border border-line bg-surface-raised">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-xs font-medium text-ink">{ev.sourceType}</span>
            <span className="meta-mono text-ink-3 shrink-0">{ev.artifactHash}</span>
          </div>
          <p className="text-[0.6875rem] text-ink-3 mb-1.5">Retrieved {new Date(ev.retrievedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
          <p className="text-xs text-ink-2 leading-relaxed">{ev.identityMatchReasoning}</p>
        </div>
      ))}
      <p className="text-[0.625rem] text-ink-3 italic">Illustrative demonstration data — not a live provider connection.</p>
    </div>
  );
}

// ---------------- Consent control (per-pillar) ----------------
export function ConsentControl({ pillar, consent, onGrant, onDecline, onWithdraw, compact = false }: {
  pillar: PillarId;
  consent: ConsentRecord;
  onGrant: () => void;
  onDecline: () => void;
  onWithdraw: () => void;
  compact?: boolean;
}) {
  const meta = PILLAR_BY_ID[pillar];
  const display = consentDisplay(consent);
  const expired = display === 'expired';
  return (
    <div className={`rounded-xl border transition-colors duration-200 ${
      display === 'granted' ? 'border-sage/25 bg-sage/5'
      : display === 'declined' ? 'border-line bg-surface-raised'
      : display === 'withdrawn' ? 'border-taupe/30 bg-taupe/5'
      : display === 'expired' ? 'border-taupe/30 bg-taupe/5'
      : 'border-gold/30 bg-gold/5'
    }`}>
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-semibold text-ink">{meta.name}</h3>
              <ConsentStatePill consent={consent} />
            </div>
            <p className="text-xs text-ink-2 leading-relaxed max-w-xl">
              {expired
                ? 'This grant has expired. Nothing was silently extended — re-granting starts a fresh grant with its own receipt and expiry.'
                : meta.whatWillBeChecked}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {display !== 'granted' && (
              <Button size="sm" onClick={onGrant}>{expired ? 'Grant again' : 'Grant'}</Button>
            )}
            {display === 'pending' && (
              <Button size="sm" variant="secondary" onClick={onDecline}>Decline</Button>
            )}
            {display === 'granted' && (
              <Button size="sm" variant="secondary" onClick={onWithdraw}>Withdraw</Button>
            )}
          </div>
        </div>

        {!compact && (
          <div className="mt-4 pt-4 border-t border-line/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
            <div>
              <span className="label-mono text-ink-3 block mb-1">Source types</span>
              <p className="text-ink-2">{meta.sourceTypes}</p>
            </div>
            <div>
              <span className="label-mono text-ink-3 block mb-1">Who may see it</span>
              <p className="text-ink-2">{meta.whoMaySee}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="label-mono text-ink-3 block mb-1">Purpose</span>
              <p className="text-ink-2">Matrimonial verification — this case only. Shares made from this consent are purpose-bound and expire by default.</p>
            </div>
            <div className="sm:col-span-2 p-3 rounded-lg bg-terracotta/5 border border-terracotta/10">
              <span className="label-mono text-terracotta block mb-1">Known limitation</span>
              <p className="text-ink-2">{meta.knownLimitation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



// ---------------- Verification row (category list item) ----------------
export function VerificationRow({ pillar, claim, consentState, onOpen }: {
  pillar: PillarId;
  claim: ClaimRecord | undefined;
  consentState?: 'pending' | 'granted' | 'declined' | 'withdrawn';
  onOpen?: () => void;
}) {
  const meta = PILLAR_BY_ID[pillar];
  const declined = consentState === 'declined' || consentState === 'withdrawn';
  const granted = consentState === 'granted';
  const hasFinding = !!claim && claim.certainty !== 'requiresConsent';
  const subline = declined
    ? (consentState === 'declined' ? 'Consent declined — no check will be performed' : 'Consent withdrawn — no further checks')
    : !granted && !hasFinding ? 'Awaiting consent — no check has been performed'
    : !hasFinding ? 'Consent granted — checks have not reached this category yet'
    : claim!.value;
  return (
    <button
      onClick={onOpen}
      disabled={!onOpen}
      className={`w-full text-left px-4 sm:px-5 py-4 flex items-center gap-4 transition-colors ${onOpen ? 'hover:bg-surface-raised cursor-pointer' : 'cursor-default'} ${hasFinding ? 'bg-surface' : 'bg-surface-raised/50'}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{meta.name}</p>
        <p className="text-xs text-ink-3 truncate mt-0.5">{subline}</p>
      </div>
      <div className="shrink-0">
        <CategoryStateChip claim={claim} consentState={consentState} />
      </div>
      {onOpen && (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="text-ink-3 shrink-0" aria-hidden="true">
          <path d="M4.5 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// ---------------- Access receipt card ----------------
const ACTION_LABELS: Record<Receipt['action'], string> = {
  'consent-granted': 'Consent granted',
  'consent-declined': 'Consent declined',
  'consent-withdrawn': 'Consent withdrawn',
  'scope-created': 'Verification scope created',
  'scope-confirmed': 'Scope confirmed',
  'share-created': 'Share created',
  'share-accessed': 'Information accessed',
  'share-revoked': 'Share revoked',
  'invitation-sent': 'Invitation sent',
  'invitation-accepted': 'Invitation accepted',
  'invitation-declined': 'Invitation declined',
  'mutual-release': 'Mutual release unlocked',
  'finding-established': 'Findings progressed',
  'dispute-submitted': 'Dispute submitted',
  'expiry-simulated': 'Demo expiry simulation',
};

export function AccessReceiptCard({ receipt, index, total, prevHash }: {
  receipt: Receipt;
  index: number;
  total: number;
  prevHash: string | null;
}) {
  return (
    <div className="bg-surface rounded-xl border border-line p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-medium text-ink">{ACTION_LABELS[receipt.action]}</p>
          <p className="text-[0.6875rem] text-ink-3 mt-0.5 font-mono">Receipt {receipt.id} · {index + 1} of {total}</p>
        </div>
        <time className="text-xs text-ink-3 whitespace-nowrap shrink-0" dateTime={receipt.timestamp}>
          {new Date(receipt.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
        </time>
      </div>
      <p className="text-sm text-ink-2 leading-relaxed mb-3">{receipt.detail}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs">
        <div><span className="label-mono text-ink-3 block">Actor</span><span className="text-ink">{receipt.actor}</span></div>
        <div><span className="label-mono text-ink-3 block">Purpose</span><span className="text-ink">{receipt.purpose}</span></div>
        <div><span className="label-mono text-ink-3 block">Scope</span><span className="text-ink">{receipt.scope}</span></div>
      </div>
      {receipt.expiresAt && (
        <p className="text-xs text-ink-3 mt-2"><span className="label-mono">Expires:</span> {receipt.expiresAt}</p>
      )}
      <div className="mt-3 pt-3 border-t border-line flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[0.625rem] font-mono text-ink-3">
        <span>Receipt sha256:{receipt.hash.slice(0, 10)}…{receipt.hash.slice(-6)}</span>
        {index > 0 && <span>Prev sha256:{(prevHash ?? '').slice(0, 10)}…</span>}
        {index === 0 && <span>Chain origin</span>}
      </div>
    </div>
  );
}

// ---------------- Share grant card ----------------
export function ShareGrantCard({ share, onRevoke }: { share: Share; onRevoke?: () => void }) {
  const status = shareStatus(share, PROTO_NOW);
  const statusStyle = status === 'active' ? 'text-sage bg-sage/10 border-sage/20'
    : status === 'expired' ? 'text-taupe bg-taupe/10 border-taupe/20'
    : 'text-terracotta-deep bg-terracotta-deep/10 border-terracotta-deep/20';
  return (
    <div className="bg-surface rounded-xl border border-line p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-semibold text-ink">{PILLAR_BY_ID[share.pillar].name}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[0.625rem] font-mono uppercase tracking-wider ${statusStyle}`}>{status}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-xs mt-2">
            <div><span className="label-mono text-ink-3 block">Access</span><span className="text-ink">{share.accessor === 'partner' ? 'Partner' : 'Family delegate'}</span></div>
            <div><span className="label-mono text-ink-3 block">Granularity</span><span className="text-ink">{share.granularity === 'status-only' ? 'Status only' : 'Status + values'}</span></div>
            <div><span className="label-mono text-ink-3 block">Purpose</span><span className="text-ink truncate">{share.purpose}</span></div>
            <div><span className="label-mono text-ink-3 block">Expires</span><span className="text-ink">{share.expiresAt}</span></div>
          </div>
        </div>
        {status === 'active' && onRevoke && (
          <Button size="sm" variant="secondary" onClick={onRevoke}>Revoke</Button>
        )}
      </div>
    </div>
  );
}

// ---------------- Mutual gate ----------------
export function MutualGate({ yourConsentDone, theirStatus, onOpenInvitation }: {
  yourConsentDone: boolean;
  theirStatus: 'awaiting' | 'accepted' | 'declined';
  onOpenInvitation?: () => void;
}) {
  const released = yourConsentDone && theirStatus === 'accepted';
  return (
    <div className={`rounded-xl border p-5 ${released ? 'border-sage/25 bg-sage/5' : 'border-gold/25 bg-gold/5'}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="label-mono text-ink-2">MUTUAL VERIFICATION</span>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.6875rem] font-medium ${released ? 'bg-sage/10 text-sage border-sage/20' : 'bg-gold/10 text-gold border-gold/30'}`}>
          <span aria-hidden="true">{released ? 'Unlocked' : 'Locked'}</span>
          {released ? 'Mutual release unlocked' : 'Release locked until both sides complete'}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className={`p-4 rounded-lg border text-center ${yourConsentDone ? 'border-sage/30 bg-surface' : 'border-line bg-surface-raised'}`}>
          <p className="text-xs font-medium text-ink mb-1">You</p>
          <p className={`text-xs ${yourConsentDone ? 'text-sage' : 'text-ink-3'}`}>{yourConsentDone ? 'Participation complete' : 'Consent needed'}</p>
        </div>
        <div className={`p-4 rounded-lg border text-center ${theirStatus === 'accepted' ? 'border-sage/30 bg-surface' : 'border-line bg-surface-raised'}`}>
          <p className="text-xs font-medium text-ink mb-1">Other person</p>
          <p className={`text-xs ${theirStatus === 'accepted' ? 'text-sage' : theirStatus === 'declined' ? 'text-taupe' : 'text-ink-3'}`}>
            {theirStatus === 'accepted' ? 'Participation complete' : theirStatus === 'declined' ? 'Invitation declined — nothing was released' : 'Awaiting participation'}
          </p>
        </div>
      </div>
      {theirStatus === 'awaiting' && onOpenInvitation && (
        <button onClick={onOpenInvitation} className="mt-4 text-[0.8125rem] font-medium text-terracotta hover:text-terracotta-deep transition-colors">
          Manage invitation →
        </button>
      )}
      {theirStatus === 'declined' && (
        <p className="mt-4 text-xs text-ink-3 italic">Declining is information, not a verdict. Nothing was released, and no interpretation is attached.</p>
      )}
      <p className="mt-4 text-[0.6875rem] text-ink-3">Neither side sees anything first. Both verifications must be complete before either side's findings are released.</p>
    </div>
  );
}

// ---------------- Role switcher (Subject / Partner / Family) ----------------
export function RoleSwitcher({ value, onChange }: {
  value: 'subject' | 'partner' | 'family';
  onChange: (role: 'subject' | 'partner' | 'family') => void;
}) {
  const options = [
    { id: 'subject' as const, label: 'Subject', hint: 'Full permitted detail and controls' },
    { id: 'partner' as const, label: 'Partner', hint: 'Only what has been granted' },
    { id: 'family' as const, label: 'Family', hint: 'Status only — values hidden' },
  ];
  return (
    <div role="radiogroup" aria-label="View as" className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          role="radio"
          aria-checked={value === opt.id}
          onClick={() => onChange(opt.id)}
          className={`text-left p-3.5 rounded-xl border transition-colors ${value === opt.id ? 'border-terracotta/50 bg-terracotta/5' : 'border-line bg-surface hover:border-line-strong'}`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className={`text-sm font-medium ${value === opt.id ? 'text-ink' : 'text-ink-2'}`}>{opt.label}</span>
            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${value === opt.id ? 'border-terracotta' : 'border-line-strong'}`} aria-hidden="true">
              {value === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />}
            </span>
          </div>
          <p className="text-[0.6875rem] text-ink-3 mt-1">{opt.hint}</p>
        </button>
      ))}
    </div>
  );
}
