/**
 * EVIDENCE + TRUST PROFILE + REPORT screens.
 */
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { Breadcrumb, EmptyState, PageHeader } from '../../ui/primitives';
import { useApp, useCase, PROTO_NOW, activeShares } from '../../../store/app';
import { PILLAR_BY_ID, type PillarId } from '../../../store/types';
import { BoundaryChip, EvidenceChain, EvidenceItems, RoleSwitcher, StateChip } from '../domain';
import type { ClaimRecord } from '../../../data/sampleCase';

/**
 * Role enforcement: what the non-subject views may display is DERIVED from
 * actual grants, never assumed. Partner sees values only where an active
 * status-and-values share exists; family never sees values at all. Access
 * ends when the share expires, is revoked, or the underlying consent lapses.
 */
function useRoleVisibility() {
  const c = useCase();
  if (!c) return { valuesFor: (_p: PillarId) => false as boolean, statusFor: (_p: PillarId) => false as boolean };
  const live = activeShares(c);
  return {
    valuesFor: (p: PillarId) => live.some((s) => s.pillar === p && s.accessor === 'partner' && s.granularity === 'status-and-values'),
    statusFor: (p: PillarId) => live.some((s) => s.pillar === p),
  };
}

/** One role-aware verdict for a pillar: what may this role see here? */
type PillarVisibility = 'full' | 'status-only' | 'boundary';
function pillarVisibility(role: string, valuesFor: (p: PillarId) => boolean, statusFor: (p: PillarId) => boolean, p: PillarId): PillarVisibility {
  if (role === 'subject') return 'full';
  if (role === 'partner') return valuesFor(p) ? 'full' : statusFor(p) ? 'status-only' : 'boundary';
  // Family is status-only by design — but only where a grant actually exists.
  return statusFor(p) ? 'status-only' : 'boundary';
}

// ============================= EVIDENCE =============================
export function EvidenceScreen() {
  const c = useCase();
  const { state } = useApp();
  const [pillar, setPillar] = useState<PillarId | null>(null);
  const [claimIdx, setClaimIdx] = useState(0);

  if (!c) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="EVIDENCE" title="Evidence thread" />
        <EmptyState title="No evidence yet" body="Evidence exists within a verification. Start one to see claims traced through sources, matching, review and coverage." action={<Link to="/app/new-verification"><Button>Start a verification</Button></Link>} />
      </div>
    );
  }

  const scopePillars = c.scope;
  const current = pillar && scopePillars.includes(pillar) ? pillar : scopePillars[0];
  const claims = current ? (c.claims[current] ?? []) : [];
  const claim = claims[Math.min(claimIdx, claims.length - 1)];
  const role = state.demoViewRole;
  const { valuesFor, statusFor } = useRoleVisibility();
  const vis = current ? pillarVisibility(role, valuesFor, statusFor, current) : 'boundary';

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="EVIDENCE" title="Evidence thread" description={`Select a claim to trace it through the evidence chain — as seen by the ${role} view.`} />

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Selector */}
        {/* Selector — chips respect the same role visibility as the detail pane */}
        <nav aria-label="Claims" className="space-y-1">
          {scopePillars.map((p) => {
            const pClaims = c.claims[p] ?? [];
            const first = pClaims[0];
            const pVis = pillarVisibility(role, valuesFor, statusFor, p);
            return (
              <button
                key={p}
                onClick={() => { setPillar(p); setClaimIdx(0); }}
                aria-current={p === current ? 'true' : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between gap-2 ${p === current ? 'bg-terracotta/10 text-terracotta font-medium' : 'text-ink-2 hover:bg-surface-raised hover:text-ink'}`}
              >
                <span className="text-sm truncate">{PILLAR_BY_ID[p].name}</span>
                {first && pVis !== 'boundary' && <StateChip state={first.certainty} />}
              </button>
            );
          })}
          {scopePillars.length === 0 && <p className="text-sm text-ink-3 px-3">No categories in scope.</p>}
        </nav>

        {/* Chain — content is role-filtered, not just labelled */}
        <div>
          {claim && vis === 'full' ? (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-ink">{claim.pillarName}</h2>
                  <p className="text-sm text-ink-2 mt-1">{claim.value}</p>
                </div>
                <StateChip state={claim.certainty} showInfo />
              </div>

              <div className="rounded-xl border border-line bg-surface p-5">
                <EvidenceChain claim={claim} />
              </div>

              <EvidenceItems claim={claim} />

              <p className="text-[0.6875rem] text-ink-3 italic">{claim.doesNotMean}</p>

              {role === 'subject' && ['conflicting', 'requiresClarification'].includes(claim.certainty) && (
                <Link to={`/app/verifications/${c.id}`} className="inline-block text-[0.8125rem] font-medium text-terracotta hover:text-terracotta-deep">
                  Dispute this finding →
                </Link>
              )}
            </div>
          ) : claim && vis === 'status-only' ? (
            <div className="rounded-xl border border-line bg-surface p-6 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-ink">{PILLAR_BY_ID[current!].name}</h2>
                <StateChip state={claim.certainty} />
              </div>
              <p className="text-sm text-ink-2 leading-relaxed">
                {role === 'family'
                  ? 'This view carries verification status only — values and evidence are not displayed to family delegates.'
                  : 'A status-only share is active for this category. The finding itself and its evidence are not shared with you.'}
              </p>
              <p className="text-xs text-ink-3 italic">Status is shown because the subject created a share for this view. Nothing here is silently accessed.</p>
            </div>
          ) : claim ? (
            <div className="rounded-xl border border-line bg-surface p-6 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-ink">{PILLAR_BY_ID[current!].name}</h2>
                <BoundaryChip label="Not shared" />
              </div>
              <p className="text-sm text-ink-2 leading-relaxed">
                {role === 'partner'
                  ? 'This finding has not been shared with you. Nothing about its result, values or evidence is displayed here.'
                  : 'No status share exists for this category in the family view. Nothing is displayed until the subject creates one.'}
              </p>
            </div>
          ) : (
            <EmptyState title="No findings yet" body="Verification is still in progress. Findings appear here as they are established and reviewed." />
          )}
        </div>
      </div>

      <p className="text-xs text-ink-3">
        <Link to="/app/states" className="text-terracotta hover:text-terracotta-deep font-medium">How to read result states →</Link>
      </p>
    </div>
  );
}

// ============================= TRUST PROFILE =============================
export function TrustProfileScreen() {
  const c = useCase();
  const { state, dispatch } = useApp();

  if (!c) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="TRUST PROFILE" title="Trust Profile" />
        <EmptyState title="No profile yet" body="The Trust Profile summarises a verification's findings. Start a verification to build one." action={<Link to="/app/new-verification"><Button>Start a verification</Button></Link>} />
      </div>
    );
  }

  const role = state.demoViewRole;
  const { valuesFor, statusFor } = useRoleVisibility();
  const rows: { pillar: PillarId; claim: ClaimRecord | undefined }[] = c.scope.map((p) => ({
    pillar: p,
    claim: (c.claims[p] ?? []).find((cl) => !['requiresConsent', 'underReview'].includes(cl.certainty)) ?? (c.claims[p] ?? [])[0],
  }));

  const roleNote = role === 'subject'
    ? 'You are viewing your own workspace — full permitted detail.'
    : role === 'partner'
      ? 'Partner view — derived from what has actually been granted. Where nothing is shared, nothing is shown.'
      : 'Family view — status only, by design. Underlying values are never displayed in this view.';

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="TRUST PROFILE" title="Trust Profile" description="A structured summary of what was checked, what was established, and what remains private — organised by category." />

      <RoleSwitcher value={role} onChange={(r) => dispatch({ type: 'SET_DEMO_ROLE', role: r })} />

      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="px-5 py-3.5 border-b border-line bg-surface-raised flex items-center justify-between gap-3">
          <p className="label-mono text-ink-3">{c.id} · {c.subjectName}</p>
          <p className="text-xs text-sage">Evidence-backed view — not a judgment of character.</p>
        </div>
        <div className="divide-y divide-line">
          {rows.map(({ pillar, claim }) => {
            // C-2 fix: the chip communicates only what this role may actually
            // see. A hidden state must never leak through a status chip.
            const vis = pillarVisibility(role, valuesFor, statusFor, pillar);
            const subline = vis === 'full'
              ? (claim?.value ?? 'No finding yet')
              : vis === 'status-only'
                ? (role === 'partner'
                  ? 'Status shared — the finding itself is not shared with you'
                  : 'Status shown — value not shown in this view')
                : 'Not shared with you';
            return (
              <div key={pillar} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{PILLAR_BY_ID[pillar].name}</p>
                  <p className="text-xs text-ink-3 truncate mt-0.5">{subline}</p>
                </div>
                <div className="shrink-0">
                  {vis === 'full'
                    ? <StateChip state={claim?.certainty ?? 'requiresConsent'} />
                    : vis === 'status-only'
                      ? <StateChip state={claim?.certainty ?? 'requiresConsent'} />
                      : <BoundaryChip label="Not shared" />}
                </div>
              </div>
            );
          })}
          {/* Health — always candidate-controlled */}
          <div className="flex items-center justify-between gap-4 px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">Health</p>
              <p className="text-xs text-ink-3 mt-0.5">Planned module — held by the person, never by InaiAram</p>
            </div>
            <div className="shrink-0"><StateChip state="candidateControlled" /></div>
          </div>
        </div>
        <p className="px-5 py-3 text-xs text-ink-3 italic border-t border-line bg-surface-raised">
          {roleNote}
          {role === 'partner' && ' Shares are created by the subject in Consent & Privacy — purpose-bound, expiring, and receipted.'}
        </p>
      </div>

      <p className="text-xs text-ink-3 leading-relaxed max-w-2xl">
        This profile organises evidence. It does not measure a person, produce a score, or advise on any decision.
      </p>
    </div>
  );
}

// ============================= REPORT =============================
export function ReportScreen() {
  const { id } = useParams();
  const c = useCase();
  const { state } = useApp();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);

  const reportReady = !!c && c.simPhase >= 5;
  const role = state.demoViewRole;
  const { valuesFor } = useRoleVisibility();

  // A report id in the URL must match the case — never render another case's report.
  if (id && c && id !== c.id) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Reports', to: '/app/reports' }, { label: 'Not found' }]} />
        <EmptyState title="Report not found" body={`No report with id ${id} exists in the prototype workspace.`} action={<Link to="/app/reports"><Button>Back to reports</Button></Link>} />
      </div>
    );
  }
  if (!c) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="REPORT" title="Report" />
        <EmptyState title="No report yet" body="A report becomes available once a verification completes." action={<Link to="/app/new-verification"><Button>Start a verification</Button></Link>} />
      </div>
    );
  }

  const couldNotEstablish = [
    'Cross-border marital status: cannot be established without the participation of the person abroad.',
    'One district court jurisdiction holds incomplete digital records for 2019–2022.',
  ];

  /** Values render only where the role genuinely holds them — subject everywhere,
   *  partner only where an active status-and-values share exists, family never. */
  const maySeeDetail = (claim: ClaimRecord) =>
    role === 'subject' || (role === 'partner' && c.scope.some((p) => (c.claims[p] ?? []).includes(claim) && valuesFor(p)));

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Reports', to: '/app/reports' }, { label: c.id }]} />
      <PageHeader eyebrow="REPORT" title="Verification report" description="Findings with their source, identity match, certainty, coverage and expiry — plus everything that could not be established, and why." />

      {!reportReady ? (
        <EmptyState
          title="Verification is still in progress"
          body={`The report becomes available when all checks and human review are complete. ${c.simPhase >= 1 ? `Currently at stage ${c.simPhase} of 5.` : 'Checks have not started yet.'} Use the prototype simulation to advance.`}
          action={<Link to={`/app/verifications/${c.id}`}><Button variant="secondary">Open verification</Button></Link>}
        />
      ) : (
        <div className="rounded-xl border border-line bg-surface relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
            <span className="font-mono text-7xl tracking-[0.3em] text-ink opacity-[0.04] rotate-[-24deg]">SAMPLE</span>
          </div>
          <div className="relative px-5 sm:px-8 py-6">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-line mb-2">
              <div>
                <p className="text-base font-semibold text-ink">Matrimonial verification · {c.subjectName}</p>
                <p className="meta-mono text-ink-3 mt-0.5">{c.id} · Issued {new Date(PROTO_NOW).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · Viewing as {role}</p>
              </div>
              {role === 'subject' && (
                <Button size="sm" variant="secondary" onClick={() => navigate('/app/privacy')}>Share…</Button>
              )}
              {role === 'family' && (
                <span className="text-xs text-ink-3 italic">Status-only view</span>
              )}
            </div>

            <div className="divide-y divide-line">
              {c.scope.flatMap((p) => (c.claims[p] ?? [])).filter((cl) => !['requiresConsent', 'underReview'].includes(cl.certainty)).map((claim) => (
                <div key={claim.id} className="py-4">
                  <button onClick={() => setExpanded(expanded === claim.id ? null : claim.id)} aria-expanded={expanded === claim.id} className="w-full text-left flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-medium text-ink truncate">{claim.pillarName}</span>
                      <StateChip state={claim.certainty} />
                    </div>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`text-ink-3 transition-transform shrink-0 ${expanded === claim.id ? 'rotate-180' : ''}`} aria-hidden="true">
                      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {expanded === claim.id && maySeeDetail(claim) && (
                    <div className="mt-3 space-y-2.5 text-sm">
                      <p className="text-ink">{claim.value}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                        <span className="text-ink-3">Source: <span className="text-ink-2">{claim.sourceType}</span></span>
                        <span className="text-ink-3">Established: <span className="text-ink-2">{claim.establishedAt}</span></span>
                        <span className="text-ink-3">Expires: <span className="text-ink-2">{claim.expiresAt}</span></span>
                        <span className="text-ink-3">Consent: <span className="text-ink-2">{claim.consentState}</span></span>
                      </div>
                      <p className="text-xs text-ink-3 italic">Coverage: {claim.coverage}</p>
                      <p className="text-xs text-terracotta-deep italic">What this does not mean: {claim.doesNotMean}</p>
                      {role === 'subject' && ['conflicting', 'requiresClarification'].includes(claim.certainty) && (
                        <Link to={`/app/verifications/${c.id}`} className="inline-block text-xs font-medium text-terracotta hover:text-terracotta-deep">
                          Dispute this finding →
                        </Link>
                      )}
                    </div>
                  )}
                  {expanded === claim.id && !maySeeDetail(claim) && (
                    <p className="mt-3 text-xs text-ink-3 italic">
                      {role === 'partner'
                        ? 'This finding has not been shared with you at value level. Ask the person to share it, or accept status-only visibility.'
                        : 'Detailed values are not shown in the family view. Only verification status is displayed.'}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg border border-gold/20 bg-gold/5">
              <h3 className="label-mono text-gold mb-2">WHAT WE COULD NOT ESTABLISH IN THIS CASE</h3>
              <ul className="space-y-1.5 text-sm text-ink-2">
                {couldNotEstablish.map((item) => (
                  <li key={item} className="flex gap-2"><span className="text-taupe shrink-0" aria-hidden="true">—</span>{item}</li>
                ))}
              </ul>
            </div>

            <p className="text-[0.625rem] text-ink-3 mt-5 leading-relaxed">
              This prototype does not generate downloadable files. The report is an on-screen artifact. Findings carry expiry dates and can be refreshed when eligible. This document assists informed decision-making; it is not a substitute for personal judgment, and InaiAram does not advise on whether to proceed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
