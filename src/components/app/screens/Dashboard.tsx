/**
 * OVERVIEW / DASHBOARD — attention-first, not a metrics board.
 * Answers: what needs my attention, what's active, what's complete, what next.
 */
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { EmptyState, PageHeader } from '../../ui/primitives';
import { CategoryStateChip, StatusPill } from '../domain';
import { useApp, useCase, gatesFor, invitationEffectiveStatus, PROTO_NOW } from '../../../store/app';
import { PILLAR_BY_ID, shareStatus, type PillarId } from '../../../store/types';
import type { ClaimRecord } from '../../../data/sampleCase';

interface AttentionItem {
  key: string;
  priority: number;
  glyph: string;
  title: string;
  body: string;
  to: string;
  cta: string;
}

export function useAttention(): AttentionItem[] {
  const c = useCase();
  if (!c) return [];
  const items: AttentionItem[] = [];

  // 1. Consent needed
  const pending = c.scope.filter((p) => c.consents[p]?.state === 'pending');
  if (pending.length > 0) {
    items.push({
      key: 'consent', priority: 1, glyph: '🔑',
      title: `Consent needed — ${pending.length} categor${pending.length === 1 ? 'y' : 'ies'}`,
      body: `${pending.map((p) => PILLAR_BY_ID[p].name).join(', ')} cannot be checked until authorised.`,
      to: '/app/consent', cta: 'Review consent',
    });
  }

  // 2/3. Findings needing attention
  const attentionClaims: { pillar: PillarId; claim: ClaimRecord }[] = [];
  for (const p of c.scope) {
    for (const claim of c.claims[p] ?? []) {
      if (claim.certainty === 'requiresClarification' || claim.certainty === 'conflicting') {
        attentionClaims.push({ pillar: p, claim });
      }
    }
  }
  for (const { pillar, claim } of attentionClaims) {
    const isConflict = claim.certainty === 'conflicting';
    items.push({
      key: `claim-${claim.id}`, priority: isConflict ? 3 : 2, glyph: isConflict ? '⇄' : '⊕',
      title: `${PILLAR_BY_ID[pillar].name}: ${isConflict ? 'sources conflict' : 'requires clarification'}`,
      body: isConflict
        ? 'Two sources do not currently agree. Both are shown; neither is resolved for you.'
        : 'A further step is needed before this can be reported.',
      to: `/app/verifications/IA-DEMO-0001`, cta: 'View finding',
    });
  }

  // 4. Invitation waiting
  const invStatus = invitationEffectiveStatus(c.invitation);
  if (invStatus === 'sent') {
    items.push({
      key: 'invite', priority: 4, glyph: '✉',
      title: `Invitation waiting — ${c.invitation!.toName}`,
      body: 'Neither side sees anything first. Results release only when both sides complete.',
      to: `/app/invitations/${c.invitation!.id}`, cta: 'Manage invitation',
    });
  }
  if (invStatus === 'expired') {
    items.push({
      key: 'invite-expired', priority: 5, glyph: '⧗',
      title: 'Invitation expired',
      body: 'An unanswered invitation expired on its own. This is never interpreted as a refusal.',
      to: `/app/invitations/${c.invitation!.id}`, cta: 'View invitation',
    });
  }
  if (invStatus === 'declined' && c.invitation) {
    items.push({
      key: 'invite-declined', priority: 5, glyph: '✉',
      title: `Invitation declined — ${c.invitation.toName}`,
      body: 'Nothing was released. Declining is information, not a verdict.',
      to: `/app/invitations/${c.invitation.id}`, cta: 'View invitation',
    });
  }

  // 5. Verification in progress
  if (c.status === 'in-progress') {
    items.push({
      key: 'progress', priority: 6, glyph: '◷',
      title: 'Verification in progress',
      body: 'Checks and human review are proceeding. Findings appear as they are established.',
      to: '/app/verifications/IA-DEMO-0001', cta: 'View progress',
    });
  }

  // 6. Expiring / expired shares
  const expiring = c.shares.filter((s) => shareStatus(s, PROTO_NOW) === 'active');
  const expired = c.shares.filter((s) => shareStatus(s, PROTO_NOW) === 'expired');
  if (expiring.length > 0) {
    items.push({
      key: 'shares', priority: 7, glyph: '⧗',
      title: `${expiring.length} active share${expiring.length === 1 ? '' : 's'}`,
      body: `Access expires ${expiring.map((s) => s.expiresAt).join(', ')}. You can revoke any share at any time.`,
      to: '/app/privacy', cta: 'Review shares',
    });
  }
  if (expired.length > 0) {
    items.push({
      key: 'shares-expired', priority: 7, glyph: '⧗',
      title: `${expired.length} share${expired.length === 1 ? '' : 's'} expired`,
      body: 'Expired shares no longer grant access.',
      to: '/app/privacy', cta: 'Review shares',
    });
  }

  return items.sort((a, b) => a.priority - b.priority);
}

export function DashboardScreen() {
  const { state } = useApp();
  const c = useCase();
  const attention = useAttention();

  const firstName = (state.user?.name ?? 'there').split(' ')[0];
  const hour = new Date(PROTO_NOW).getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const established = c ? c.scope.filter((p) => (c.claims[p] ?? []).some((cl) => !['requiresConsent', 'underReview'].includes(cl.certainty))).length : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${greeting}, ${firstName}`}
        description={
          c
            ? 'Here is where your verification stands, and what needs you.'
            : 'Your private verification workspace. Start by describing what you would like to verify.'
        }
        actions={
          !c ? (
            <Link to="/app/new-verification"><Button>Start a verification</Button></Link>
          ) : (
            <>
              <Link to="/app/new-verification"><Button variant="ghost">Start another</Button></Link>
              <Link to="/app/verifications/IA-DEMO-0001"><Button variant="secondary">Open verification</Button></Link>
            </>
          )
        }
      />

      {!c && state.user?.path === 'invited' ? (
        <InvitedPanel />
      ) : !c ? (
        <EmptyState
          title="No verification has started"
          body="A verification begins with a scope — the categories that matter to you — and the consent of the person it concerns."
          action={<Link to="/app/new-verification"><Button>Start a verification</Button></Link>}
        />
      ) : (
        <>
          {/* Attention */}
          {attention.length > 0 && (
            <section aria-labelledby="attn-h">
              <h2 id="attn-h" className="label-mono text-ink-3 mb-3">NEEDS YOUR ATTENTION</h2>
              <div className="space-y-2">
                {attention.map((item) => (
                  <Link
                    key={item.key}
                    to={item.to}
                    className="flex items-start sm:items-center gap-3.5 p-4 rounded-xl border border-line bg-surface hover:border-line-strong hover:bg-surface-raised transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-sm shrink-0" aria-hidden="true">{item.glyph}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{item.title}</p>
                      <p className="text-xs text-ink-3 mt-0.5 leading-relaxed">{item.body}</p>
                    </div>
                    <span className="hidden sm:inline text-xs font-medium text-terracotta group-hover:text-terracotta-deep shrink-0">{item.cta} →</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Active verification */}
          <section aria-labelledby="active-h">
            <h2 id="active-h" className="label-mono text-ink-3 mb-3">ACTIVE VERIFICATION</h2>
            <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                  <p className="text-base font-semibold text-ink">Matrimonial verification · {c.mode === 'mutual' ? 'Mutual' : 'Single person'}</p>
                  <p className="meta-mono text-ink-3 mt-0.5">Case {c.id} · {c.subjectName} · Illustrative sample</p>
                </div>
                <StatusPill status={c.status} />
              </div>

              {/* Per-category state row — C-1 fix: granted-but-not-started
                  categories show their internal "Not started yet" state, never
                  the canonical "Requires consent" mislabel. */}
              <div className="flex flex-wrap gap-2 mb-5">
                {c.scope.map((p) => (
                  <CategoryStateChip key={p} claim={(c.claims[p] ?? [])[0]} consentState={c.consents[p]?.state} />
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-line">
                <p className="text-xs text-ink-3">
                  {established} of {c.scope.length} categories have reported findings · Consent {c.scope.every((p) => c.consents[p]?.state === 'granted') ? 'complete' : c.scope.every((p) => c.consents[p]?.state !== 'pending') ? 'decided' : 'pending for some categories'}
                </p>
                <div className="flex gap-2">
                  <Link to="/app/verifications/IA-DEMO-0001"><Button size="sm" variant="secondary">Details</Button></Link>
                  <Link to="/app/evidence"><Button size="sm" variant="ghost">Evidence</Button></Link>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="recent-h">
            <div className="flex items-center justify-between mb-3">
              <h2 id="recent-h" className="label-mono text-ink-3">RECENT ACTIVITY</h2>
              <Link to="/app/privacy" className="text-xs text-terracotta hover:text-terracotta-deep font-medium">Consent ledger →</Link>
            </div>
            <div className="space-y-2">
              {c.receipts.slice(-3).reverse().map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 p-3.5 rounded-lg border border-line bg-surface">
                  <div className="min-w-0">
                    <p className="text-sm text-ink truncate">{r.detail}</p>
                    <p className="text-xs text-ink-3 mt-0.5">{r.actor}</p>
                  </div>
                  <time className="text-xs text-ink-3 whitespace-nowrap shrink-0" dateTime={r.timestamp}>
                    {new Date(r.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </time>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-dashed border-line-strong bg-surface-raised/60 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">Prototype simulation</p>
                <p className="text-xs text-ink-3 mt-0.5">Advance the demonstration to watch checks progress, review, and report — deterministically, with no live providers.</p>
              </div>
              <SimulationControls />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function SimulationControls() {
  const { state, dispatch } = useApp();
  const c = state.caseData;
  const navigate = useNavigate();
  if (!c) return null;
  // Single authoritative gate — the reducer enforces the same rule.
  const canAdvance = gatesFor(c).canVerify;
  const invStatus = invitationEffectiveStatus(c.invitation);
  return (
    <div className="flex items-center gap-2 shrink-0">
      {c.mode === 'mutual' && invStatus === 'sent' && (
        <Button size="sm" variant="secondary" onClick={() => navigate(`/app/invitations/${c.invitation!.id}`)}>Invitation pending</Button>
      )}
      {c.mode === 'mutual' && c.simPhase === 0 && invStatus === 'draft' && (
        <Button size="sm" variant="secondary" onClick={() => navigate(`/app/invitations/${c.invitation!.id}`)}>Send invitation</Button>
      )}
      <Button size="sm" disabled={!canAdvance} onClick={() => dispatch({ type: 'ADVANCE_SIMULATION' })}>
        {c.simPhase >= 5 ? 'Simulation complete' : 'Advance verification'}
      </Button>
    </div>
  );
}

/** The invited-person journey (Journey B): an open invitation awaiting response. */
function InvitedPanel() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const invitedStatus = state.user?.invitedStatus;

  if (invitedStatus === 'accepted') return null;

  if (invitedStatus === 'declined') {
    return (
      <section aria-labelledby="inv-dec" className="rounded-xl border border-line bg-surface p-6">
        <p className="label-mono text-ink-3 mb-2">INVITATION</p>
        <h2 id="inv-dec" className="h3 text-ink mb-2">You've chosen not to participate.</h2>
        <p className="text-sm text-ink-2 leading-relaxed max-w-xl mb-5">
          Nothing was released, and nothing is inferred about you from this. The invitation simply stays open — you can reconsider at any time.
        </p>
        <Button variant="secondary" onClick={() => { dispatch({ type: 'REOPEN_INCOMING_INVITATION' }); }}>Reconsider the invitation</Button>
      </section>
    );
  }

  return (
    <section aria-labelledby="inv-open" className="rounded-xl border border-gold/25 bg-gold/5 p-6">
      <p className="label-mono text-gold mb-2">INVITATION AWAITING YOU</p>
      <h2 id="inv-open" className="h3 text-ink mb-2">A. Meera Krishnan invited you to a mutual verification.</h2>
      <p className="text-sm text-ink-2 leading-relaxed max-w-2xl mb-4">
        They started a matrimonial verification and would like you to participate. What's being asked: identity, education, employment and marital status — each with your consent, category by category, before anything is checked.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-5">
        <div className="p-3.5 rounded-lg border border-line bg-surface">
          <span className="label-mono text-sage block mb-1">WHAT WILL HAPPEN</span>
          <p className="text-xs text-ink-2 leading-relaxed">You grant or decline each category. Checks proceed only on what you authorise, with the coverage of every search recorded.</p>
        </div>
        <div className="p-3.5 rounded-lg border border-line bg-surface">
          <span className="label-mono text-taupe block mb-1">WHAT WILL NOT HAPPEN</span>
          <p className="text-xs text-ink-2 leading-relaxed">No scores, no verdicts, no surveillance. Declining a category is information, never a finding.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => { dispatch({ type: 'ACCEPT_INCOMING_INVITATION' }); navigate('/app/consent'); }}>Accept and continue</Button>
        <Button variant="secondary" onClick={() => dispatch({ type: 'DECLINE_INCOMING_INVITATION' })}>Decline</Button>
      </div>
    </section>
  );
}
