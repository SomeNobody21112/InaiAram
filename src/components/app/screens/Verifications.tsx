/**
 * VERIFICATIONS — list + detail. Detail shows header, summary, category rows
 * (expandable), coverage view, and the mutual gate where applicable.
 */
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { Breadcrumb, EmptyState, PageHeader } from '../../ui/primitives';
import { useToast } from '../../ui/primitives';
import { useApp, useCase, gatesFor, invitationEffectiveStatus } from '../../../store/app';
import { sampleCase, type ClaimRecord } from '../../../data/sampleCase';
import { CategoryStateChip, ClaimDisclosure, CoveragePill, EvidenceItems, MutualGate, StateChip, StatusPill, VerificationRow } from '../domain';

// ---------------- List ----------------
export function VerificationsScreen() {
  const c = useCase();
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="VERIFICATIONS"
        title="Verifications"
        description="Every verification concerning you, with its current state."
        actions={c ? <Link to="/app/new-verification"><Button variant="secondary">Start another verification</Button></Link> : undefined}
      />
      {!c ? (
        <EmptyState title="No verification has started" body="Start one by choosing the categories that matter to you." action={<Link to="/app/new-verification"><Button>Start a verification</Button></Link>} />
      ) : (
        <Link to={`/app/verifications/${c.id}`} className="block rounded-xl border border-line bg-surface p-5 hover:border-line-strong hover:bg-surface-raised transition-colors">
          <div className="flex items-center justify-between gap-3 mb-2">
            <p className="text-base font-semibold text-ink">Matrimonial verification · {c.mode === 'mutual' ? 'Mutual' : 'Single'}</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium text-gold bg-gold/10 border-gold/20">Open case</span>
          </div>
          <p className="meta-mono text-ink-3">{c.id} · {c.subjectName} · Created {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</p>
          <p className="text-xs text-ink-2 mt-2">{c.scope.length} categories · {c.shares.filter((s) => !s.revokedAt).length} shares · Illustrative sample</p>
        </Link>
      )}
    </div>
  );
}

// ---------------- Detail ----------------
export function VerificationDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const c = useCase();
  const { toast } = useToast();
  const [openPillar, setOpenPillar] = useState<string | null>(null);
  const [showCoverage, setShowCoverage] = useState(false);

  if (!c || c.id !== id) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Verifications', to: '/app/verifications' }, { label: 'Not found' }]} />
        <EmptyState title="Verification not found" body="This case does not exist in the prototype workspace." action={<Link to="/app/verifications"><Button>Back to verifications</Button></Link>} />
      </div>
    );
  }

  const pending = c.scope.filter((p) => c.consents[p]?.state === 'pending').length;
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Verifications', to: '/app/verifications' }, { label: c.id }]} />

      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-serif text-sm shrink-0" aria-hidden="true">
              {c.subjectName.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-ink truncate">{c.subjectName}</h1>
              <p className="meta-mono text-ink-3 mt-0.5">{c.id} · Matrimonial verification · {c.mode === 'mutual' ? 'Mutual' : 'Single person'}</p>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <StatusPill status={c.status} />
            <p className="text-xs text-ink-3">
              Consent {pending === 0 ? (c.scope.every((p) => c.consents[p]?.state === 'granted') ? 'complete' : 'decided') : `${pending} pending`} · Updated {new Date(c.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-line">
          {c.scope.map((p) => (
            <CategoryStateChip key={p} claim={(c.claims[p] ?? [])[0]} consentState={c.consents[p]?.state} />
          ))}
        </div>
      </div>

      {c.mode === 'mutual' && c.invitation && invitationEffectiveStatus(c.invitation) !== 'draft' && (
        <MutualGate yourConsentDone={pending === 0} theirStatus={(invitationEffectiveStatus(c.invitation) === 'accepted' ? 'accepted' : invitationEffectiveStatus(c.invitation) === 'declined' ? 'declined' : 'awaiting') as 'awaiting' | 'accepted' | 'declined'} onOpenInvitation={() => navigate(`/app/invitations/${c.invitation!.id}`)} />
      )}

      <div className="flex flex-wrap gap-2">
        <Link to={`/app/verifications/${c.id}/evidence`}><Button size="sm" variant="secondary">Evidence thread</Button></Link>
        <Link to={`/app/verifications/${c.id}/report`}><Button size="sm" variant="secondary">Report</Button></Link>
        <Link to="/app/consent"><Button size="sm" variant="ghost">Manage consent</Button></Link>
      </div>

      <section aria-labelledby="cats-h">
        <h2 id="cats-h" className="label-mono text-ink-3 mb-3">VERIFICATION CATEGORIES</h2>
        <div className="rounded-xl border border-line bg-surface divide-y divide-line overflow-hidden">
          {c.scope.map((p) => {
            const claims = c.claims[p] ?? [];
            const primary = claims[0];
            const isOpen = openPillar === p;
            return (
              <div key={p}>
                <VerificationRow pillar={p} claim={primary} consentState={c.consents[p]?.state} onOpen={() => setOpenPillar(isOpen ? null : p)} />
                {isOpen && primary && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 bg-surface space-y-4">
                    <ClaimDisclosure claim={primary} defaultOpen />
                    <EvidenceItems claim={primary} />
                    {claims.length > 1 && (
                      <div className="pt-1">
                        <span className="label-mono text-ink-3 block mb-2">Additional claims in this category</span>
                        <div className="space-y-3">
                          {claims.slice(1).map((cl) => (
                            <div key={cl.id} className="p-3.5 rounded-lg border border-line bg-surface-raised">
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <p className="text-xs font-medium text-ink">{cl.value}</p>
                                <StateChip state={cl.certainty} />
                              </div>
                              <ClaimDisclosure claim={cl} />
                              <ClaimActionArea claim={cl} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <ClaimActionArea claim={primary} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="cov-h">
        <div className="flex items-center justify-between mb-3">
          <h2 id="cov-h" className="label-mono text-ink-3">COVERAGE</h2>
          <button onClick={() => setShowCoverage(!showCoverage)} aria-expanded={showCoverage} className="text-xs font-medium text-terracotta hover:text-terracotta-deep">
            {showCoverage ? 'Hide' : 'Show'} jurisdiction detail
          </button>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
          <p className="text-sm text-ink-2 leading-relaxed mb-4">
            Searched 6 of 8 relevant jurisdictions. Two district courts hold incomplete digital records for 2019–2022.
            <span className="block text-xs text-ink-3 italic mt-1">Illustrative demonstration data — not a live provider connection.</span>
          </p>
          {showCoverage && (
            <div>
              {sampleCase.coverage.map((j) => (
                <div key={j.name} className="flex items-center justify-between gap-3 py-2.5 border-b border-line last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm text-ink">{j.name}</p>
                    <p className="text-xs text-ink-3">{j.reason}</p>
                  </div>
                  <CoveragePill status={j.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-line-strong bg-surface-raised/60 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-ink">Prototype simulation</p>
            <p className="text-xs text-ink-3 mt-0.5">Advance the demonstration — checks proceed in stages, then human review, then report.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" variant="ghost" onClick={() => { dispatch({ type: 'RESET_SIMULATION' }); toast('Simulation reset'); }}>Reset</Button>
            <Button size="sm" disabled={!gatesFor(c).canVerify} onClick={() => { dispatch({ type: 'ADVANCE_SIMULATION' }); toast('Verification advanced'); }}>
              {c.simPhase >= 5 ? 'Complete' : 'Advance'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * F-1 fix: the dispute entry point renders for EVERY claim whose finding is
 * disputable (conflicting or requires clarification) — primary or secondary.
 * If a dispute already exists for the claim, its status is shown instead.
 */
function ClaimActionArea({ claim }: { claim: ClaimRecord }) {
  const c = useCase();
  if (!c) return null;
  const dispute = c.disputes.find((d) => d.claimId === claim.id);
  if (dispute) {
    const label = dispute.status === 'submitted' ? 'Dispute submitted — under review' : dispute.status === 'under-review' ? 'Dispute under review' : 'Dispute resolved';
    return (
      <div className="pt-2 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.6875rem] font-medium text-gold bg-gold/10 border-gold/20">
          <span aria-hidden="true">◷</span> {label}
        </span>
        <span className="text-xs text-ink-3">Receipt {c.receipts.find((r) => r.action === 'dispute-submitted')?.id ?? ''} in your ledger.</span>
      </div>
    );
  }
  if (!['conflicting', 'requiresClarification'].includes(claim.certainty)) return null;
  return <DisputeEntry claimId={claim.id} />;
}

function DisputeEntry({ claimId }: { claimId: string }) {
  const { dispatch } = useApp();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [context, setContext] = useState('');
  return (
    <div className="pt-2">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="text-[0.8125rem] font-medium text-terracotta hover:text-terracotta-deep">
        Dispute this finding
      </button>
      {open && (
        <div className="mt-3 p-4 rounded-lg border border-line bg-surface-raised space-y-3">
          <div>
            <label htmlFor={`dp-reason-${claimId}`} className="label-mono block mb-1.5">REASON FOR DISPUTE</label>
            <input id={`dp-reason-${claimId}`} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. The dates recorded do not match my records" className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-sm text-ink placeholder:text-ink-3 focus:border-terracotta outline-none" />
          </div>
          <div>
            <label htmlFor={`dp-ctx-${claimId}`} className="label-mono block mb-1.5">ADDITIONAL CONTEXT (OPTIONAL)</label>
            <textarea id={`dp-ctx-${claimId}`} value={context} onChange={(e) => setContext(e.target.value)} rows={2} placeholder="Anything that helps the review." className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-sm text-ink placeholder:text-ink-3 focus:border-terracotta outline-none" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              size="sm"
              disabled={reason.trim().length < 4}
              onClick={() => {
                dispatch({ type: 'SUBMIT_DISPUTE', claimId, reason: reason.trim(), context: context.trim() });
                toast('Dispute submitted — a human reviewer will re-examine this finding.');
                setOpen(false);
                setReason('');
                setContext('');
              }}
            >
              Submit dispute
            </Button>
          </div>
          <p className="text-xs text-ink-3">Disputed findings are re-examined and corrections are shared with everyone affected.</p>
        </div>
      )}
    </div>
  );
}


