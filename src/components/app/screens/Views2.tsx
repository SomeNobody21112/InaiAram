/**
 * PRIVACY CENTER + INVITATIONS + ACCOUNT + STATES screens.
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { Breadcrumb, Dialog, EmptyState, PageHeader, useToast } from '../../ui/primitives';
import { useApp, useCase, PROTO_NOW, consentDisplay, gatesFor, invitationEffectiveStatus } from '../../../store/app';
import { verifyLedger } from '../../../lib/hashChain';
import { copyText } from '../../../lib/clipboard';
import { PILLAR_BY_ID, shareStatus, type Granularity, type InvitationLang, type PillarId } from '../../../store/types';
import { AccessReceiptCard, ConsentStatePill, InvitationPill, ShareGrantCard } from '../domain';
import { en } from '../../../content/en';

// ============================= CONSENT & PRIVACY CENTER =============================
export function PrivacyScreen() {
  const { dispatch } = useApp();
  const c = useCase();
  const { toast } = useToast();
  const [shareOpen, setShareOpen] = useState(false);
  const [chainStatus, setChainStatus] = useState<null | 'valid' | 'broken'>(null);
  const [tamperFlip, setTamperFlip] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!c) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="CONSENT & PRIVACY" title="Consent & Privacy" />
        <EmptyState title="Nothing to govern yet" body="Consent grants, shares and the ledger live inside a verification." action={<Link to="/app/new-verification"><Button>Start a verification</Button></Link>} />
      </div>
    );
  }  const handleVerify = async () => {
    // Real verification: re-hash every receipt, check linkage to the one before it,
    // and compare against the recorded hashes. Tamper simulation flips one bit.
    const ledger = tamperFlip
      ? c.receipts.map((r, i) => (i === c.receipts.length - 1 ? { ...r, purpose: r.purpose + ' ' } : r))
      : c.receipts;
    const result = await verifyLedger(ledger);
    setChainStatus(result.valid ? 'valid' : 'broken');
  };

  const activeShares = c.shares.filter((s) => !s.revokedAt && new Date(s.expiresAt).getTime() >= new Date(PROTO_NOW).getTime());
  const pastShares = c.shares.filter((s) => !activeShares.includes(s));

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="GRANTS · SHARES · LEDGER" title="Grants, Shares & Ledger" description="What you have authorised, who can see what, every access ever made — and the controls to end any of it. Consent decisions themselves live on the Consent screen." />

      {/* Grants summary */}
      <section aria-labelledby="grants-h">
        <div className="flex items-center justify-between mb-3">
          <h2 id="grants-h" className="label-mono text-ink-3">CONSENT GRANTS</h2>
          <Link to="/app/consent" className="text-xs font-medium text-terracotta hover:text-terracotta-deep">Manage consent →</Link>
        </div>
        <div className="rounded-xl border border-line bg-surface divide-y divide-line">
          {c.scope.map((p) => {
            const consent = c.consents[p];
            const display = consentDisplay(consent);
            const expired = display === 'expired';
            return (
              <div key={p} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{PILLAR_BY_ID[p].name}</p>
                  <p className="text-xs text-ink-3 mt-0.5">
                    {expired
                      ? `Grant expired — access ended. Re-granting creates a fresh grant.`
                      : consent?.grantedAt
                        ? `Granted ${new Date(consent.grantedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · purpose-bound · withdrawable`
                        : 'No grant on record'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {expired && (
                    <Button size="sm" variant="secondary" onClick={() => { dispatch({ type: 'GRANT_CONSENT', pillar: p }); toast(`Fresh grant created — ${PILLAR_BY_ID[p].name}`); }}>
                      Grant again
                    </Button>
                  )}
                  <ConsentStatePill consent={consent} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Expiry demo control */}
      <section aria-labelledby="expiry-h">
        <div className="rounded-xl border border-dashed border-line-strong bg-surface-raised/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-ink">Demonstrate expiry</p>
            <p className="text-xs text-ink-3 mt-0.5">The prototype clock is frozen. This demo step advances it past every expiry — grants, shares and invitations show their expired state. Nothing is silently extended.</p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => { dispatch({ type: 'SIMULATE_EXPIRY' }); toast('Expiry simulated — expired states now visible'); }}>
            Simulate expiry (demo)
          </Button>
        </div>
      </section>

      {/* Shares */}
      <section aria-labelledby="shares-h">
        <div className="flex items-center justify-between mb-3">
          <h2 id="shares-h" className="label-mono text-ink-3">SHARES</h2>
          <Button size="sm" variant="secondary" onClick={() => setShareOpen(true)}>Create a share</Button>
        </div>
        {c.shares.length === 0 ? (
          <EmptyState title="No active shares" body="Nothing is currently shared with anyone. Create a purpose-bound, expiring share when you are ready." action={<Button variant="secondary" onClick={() => setShareOpen(true)}>Create a share</Button>} />
        ) : (
          <div className="space-y-2.5">
            {c.shares.map((s) => {
              const st = shareStatus(s, PROTO_NOW);
              const claim = (c.claims[s.pillar] ?? []).find((cl) => !['requiresConsent', 'underReview'].includes(cl.certainty));
              return (
                <div key={s.id} className="space-y-1">
                  <ShareGrantCard share={s} onRevoke={st === 'active' ? () => { dispatch({ type: 'REVOKE_SHARE', shareId: s.id }); toast('Share revoked — access has ended'); } : undefined} />
                  {st === 'active' && s.accessor === 'partner' && (
                    <div className="px-1">
                      {s.granularity === 'status-and-values' && claim ? (
                        <p className="text-xs text-ink-3">What they can see: <span className="text-ink-2">{claim.value}</span></p>
                      ) : (
                        <p className="text-xs text-ink-3">What they can see: that a check was done — not the finding itself.</p>
                      )}
                      <button
                        onClick={() => { dispatch({ type: 'RECORD_ACCESS', shareId: s.id }); toast('Access receipted — visible in your ledger below'); }}
                        className="mt-1 text-xs font-medium text-terracotta hover:text-terracotta-deep"
                      >
                        Simulate their access →
                      </button>
                    </div>
                  )}
                  {st === 'expired' && (
                    <p className="px-1 mt-1.5 text-xs text-ink-3">Share expired — access is no longer available through this grant.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {pastShares.length > 0 && (
          <p className="text-xs text-ink-3 mt-2">{pastShares.filter((s) => s.revokedAt).length} revoked · {pastShares.filter((s) => !s.revokedAt).length} expired shares are listed above with their status.</p>
        )}
      </section>

      {/* Ledger */}
      <section aria-labelledby="ledger-h">
        <div className="flex items-center justify-between mb-3">
          <h2 id="ledger-h" className="label-mono text-ink-3">CONSENT LEDGER — ACCESS HISTORY</h2>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={handleVerify}>{tamperFlip ? 'Re-verify after tampering' : 'Verify receipt chain'}</Button>
          </div>
        </div>

        {chainStatus && (
          <div className={`mb-3 p-3 rounded-lg text-sm font-medium ${chainStatus === 'valid' ? 'bg-sage/10 text-sage border border-sage/20' : 'bg-terracotta/10 text-terracotta border border-terracotta/20'}`} role="status">
            {chainStatus === 'valid'
              ? 'Receipt chain verified — every receipt is intact and correctly linked to the one before it.'
              : 'Chain verification failed — a receipt does not match its recorded hash.'}
            <span className="block mt-1 text-xs font-normal text-ink-3">Prototype demonstration of integrity checking. Not a production security certification.</span>
          </div>
        )}
        {chainStatus === 'valid' && (
          <div className="mb-3">
            <Button size="sm" variant="ghost" onClick={() => { setTamperFlip(true); setChainStatus(null); }}>
              See what tampering looks like
            </Button>
            <p className="text-xs text-ink-3 mt-1">Flips one character inside the newest receipt so the next verification can detect it.</p>
          </div>
        )}

        {c.receipts.length === 0 ? (
          <EmptyState title="Nothing in the ledger yet" body="Every consent, share and access is recorded here as a receipt. Actions you take will appear as they happen." />
        ) : (
          <div className="space-y-2.5">
            {[...c.receipts].reverse().map((r, i) => (
              <AccessReceiptCard key={r.id} receipt={r} index={c.receipts.length - 1 - i} total={c.receipts.length} prevHash={r.previousHash} />
            ))}
          </div>
        )}
      </section>

      {/* Data rights */}
      <section aria-labelledby="rights-h">
        <h2 id="rights-h" className="label-mono text-ink-3 mb-3">DATA RIGHTS</h2>
        <div className="rounded-xl border border-line bg-surface divide-y divide-line">
          <div className="px-5 py-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-ink">Request all information held about you</p>
              <p className="text-xs text-ink-3 mt-0.5">A copy of your findings, grants and receipts.</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => toast('Access request recorded (prototype — nothing is transmitted)')}>Request</Button>
          </div>
          <div className="px-5 py-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-ink">Dispute a finding</p>
              <p className="text-xs text-ink-3 mt-0.5">Disputes are raised from the finding itself, on the verification page.</p>
            </div>
            <Link to="/app/verifications/IA-DEMO-0001"><Button size="sm" variant="secondary">Open verification</Button></Link>
          </div>
          <div className="px-5 py-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-ink">Delete account and data</p>
              <p className="text-xs text-ink-3 mt-0.5">Prototype: clears all local workspace state immediately.</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setDeleteOpen(true)}>Delete…</Button>
          </div>
        </div>
      </section>

      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} />

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete account and data">
        <p className="text-sm text-ink-2 leading-relaxed mb-4">
          This clears the prototype workspace on this device — your session, the demonstration case, grants, shares and receipts. It cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={() => { dispatch({ type: 'DELETE_ACCOUNT' }); window.location.assign('/'); }}>Delete everything</Button>
        </div>
      </Dialog>
    </div>
  );
}

function ShareDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const c = state.caseData;
  const [pillar, setPillar] = useState<string>('');
  const [accessor, setAccessor] = useState<'partner' | 'family'>('partner');
  const [granularity, setGranularity] = useState<Granularity>('status-only');
  const [days, setDays] = useState(14);
  const [reviewing, setReviewing] = useState(false);

  // Only categories with a LIVE grant can be shared (gates.canShare also
  // excludes expired grants — enforced at the reducer level too).
  const granted = c ? c.scope.filter((p) => gatesFor(c).canShare(p)) : [];
  const selectedPillar = (pillar || granted[0] || '') as PillarId;
  // Family delegates receive status only — the choice is removed, not just warned about.
  const effectiveGranularity: Granularity = accessor === 'family' ? 'status-only' : granularity;
  const expires = new Date(new Date(PROTO_NOW).getTime() + days * 86400000).toISOString().slice(0, 10);

  const create = () => {
    if (!selectedPillar) return;
    dispatch({ type: 'CREATE_SHARE', pillar: selectedPillar, accessor, purpose: 'Matrimonial evaluation', granularity: effectiveGranularity, expiresInDays: days });
    toast(`Share created — expires ${expires}`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="Create a share">
      {granted.length === 0 ? (
        <div>
          <p className="text-sm text-ink-2">No categories have consent yet. Consent must be granted before anything can be shared.</p>
          <div className="mt-4 flex justify-end"><Button variant="secondary" onClick={onClose}>Close</Button></div>
        </div>
      ) : !reviewing ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="sh-pillar" className="label-mono block mb-1.5">CATEGORY</label>
            <select id="sh-pillar" value={selectedPillar} onChange={(e) => setPillar(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface text-sm text-ink focus:border-terracotta outline-none">
              {granted.map((p) => <option key={p} value={p}>{PILLAR_BY_ID[p].name}</option>)}
            </select>
          </div>
          <div>
            <span className="label-mono block mb-1.5">WHO MAY ACCESS</span>
            <div className="grid grid-cols-2 gap-2">
              {(['partner', 'family'] as const).map((a) => (
                <button key={a} type="button" onClick={() => setAccessor(a)} aria-pressed={accessor === a}
                  className={`p-3 rounded-lg border text-left text-sm transition-colors ${accessor === a ? 'border-terracotta/50 bg-terracotta/5 text-ink' : 'border-line bg-surface text-ink-2 hover:border-line-strong'}`}>
                  {a === 'partner' ? 'Partner' : 'Family delegate'}
                  <span className="block text-[0.6875rem] text-ink-3 mt-0.5">{a === 'partner' ? 'Verified account' : 'Status only, always'}</span>
                </button>
              ))}
            </div>
          </div>
          {accessor === 'partner' && (
            <div>
              <span className="label-mono block mb-1.5">GRANULARITY</span>
              <div className="grid grid-cols-2 gap-2">
                {(['status-only', 'status-and-values'] as const).map((g) => (
                  <button key={g} type="button" onClick={() => setGranularity(g)} aria-pressed={granularity === g}
                    className={`p-3 rounded-lg border text-left text-sm transition-colors ${granularity === g ? 'border-terracotta/50 bg-terracotta/5 text-ink' : 'border-line bg-surface text-ink-2 hover:border-line-strong'}`}>
                    {g === 'status-only' ? 'Status only' : 'Status + values'}
                    <span className="block text-[0.6875rem] text-ink-3 mt-0.5">{g === 'status-only' ? 'That a check was done' : 'The finding itself'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {accessor === 'family' && (
            <p className="text-xs text-ink-3 leading-relaxed">Family delegates always receive status only — underlying values are never shown to them. Every grant you make is visible in your ledger.</p>
          )}
          <div>
            <label htmlFor="sh-days" className="label-mono block mb-1.5">EXPIRY — {days} DAYS</label>
            <input id="sh-days" type="range" min={1} max={30} value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full accent-[var(--terracotta)]" />
            <p className="text-xs text-ink-3 mt-1">Purpose-bound and time-boxed. Every access during this window is receipted and visible to you.</p>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={() => setReviewing(true)}>Review before sharing</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="label-mono text-ink-3">BEFORE YOU SHARE — REVIEW</p>
          <div className="rounded-lg border border-line bg-surface-raised divide-y divide-line text-sm">
            <div className="px-4 py-3"><span className="label-mono text-ink-3 block">What</span><span className="text-ink">{PILLAR_BY_ID[selectedPillar].name} {effectiveGranularity === 'status-and-values' ? '— status and values' : '— status only'}</span></div>
            <div className="px-4 py-3"><span className="label-mono text-ink-3 block">With whom</span><span className="text-ink">{accessor === 'partner' ? 'Partner' : 'Family delegate'}</span></div>
            <div className="px-4 py-3"><span className="label-mono text-ink-3 block">Why</span><span className="text-ink">{'Matrimonial evaluation'}</span></div>
            <div className="px-4 py-3"><span className="label-mono text-ink-3 block">How long</span><span className="text-ink">Expires {expires} — {days} day{days === 1 ? '' : 's'}</span></div>
          </div>
          <p className="text-xs text-ink-3 leading-relaxed">Every access during this window is receipted in your ledger — there is no silent access. You can revoke at any time, and revoking ends access immediately.</p>
          <div className="flex justify-between gap-2 pt-1">
            <Button variant="secondary" onClick={() => setReviewing(false)}>Back</Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={create}>Share it</Button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}

// ============================= INVITATIONS =============================
const INVITE_TEMPLATES: Record<InvitationLang, string> = {
  english: en.ask.templates.english,
  hindi: en.ask.templates.hindi,
  tamil: en.ask.templates.tamil,
};

export function InvitationsScreen() {
  const { id } = useParams();
  const { dispatch } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const c = useCase();
  const [lang, setLang] = useState<InvitationLang>('english');
  const [toName, setToName] = useState(c?.invitation?.toName ?? '');

  if (!c || !c.invitation || c.invitation.id !== id) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Overview', to: '/app' }, { label: 'Invitation' }]} />
        <EmptyState title="Invitation not found" body="This invitation does not exist in the prototype workspace." action={<Link to="/app"><Button>Back to overview</Button></Link>} />
      </div>
    );
  }

  const inv = c.invitation;
  const invStatus = invitationEffectiveStatus(inv);
  const [copyFallback, setCopyFallback] = useState(false);

  // Keep the recipient field in sync when the invitation resets.
  useEffect(() => {
    setToName(c?.invitation?.toName ?? '');
  }, [c?.invitation?.toName]);

  const respond = (accept: boolean) => {
    dispatch({ type: 'SIMULATE_INVITATION_RESPONSE', accept });
    if (accept) {
      toast(`${inv.toName} accepted — mutual release unlocked`);
      setTimeout(() => navigate('/app/verifications/IA-DEMO-0001'), 900);
    } else {
      toast(`${inv.toName} declined — nothing was released`);
    }
  };

  const handleCopy = async () => {
    const ok = await copyText(INVITE_TEMPLATES[lang]);
    if (ok) {
      setCopyFallback(false);
      toast('Invitation text copied');
    } else {
      // Never fail silently — surface a manual copy path.
      setCopyFallback(true);
      toast('Copy unavailable — select the text below and copy manually');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Breadcrumb items={[{ label: 'Overview', to: '/app' }, { label: `Invitation ${inv.id}` }]} />
      <PageHeader eyebrow="MUTUAL VERIFICATION" title="The invitation" description="Both people verify. Neither side's results release until both are complete. A decline is information, not a verdict — nothing is released and no interpretation is attached." />

      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6 space-y-5">          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-ink">To: {inv.toName}</p>
              <p className="text-xs text-ink-3 mt-0.5">Prototype simulation — the recipient is fictional.</p>
            </div>
            <InvitationPill status={invStatus} />
          </div>

        {invStatus === 'draft' && (
          <>
            <div>
              <label htmlFor="inv-name" className="label-mono block mb-1.5">RECIPIENT NAME</label>
              <input id="inv-name" value={toName} onChange={(e) => setToName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface text-sm text-ink focus:border-terracotta outline-none" />
            </div>
            <div>
              <span className="label-mono block mb-1.5">LANGUAGE</span>
              <div className="flex gap-2">
                {(['english', 'hindi', 'tamil'] as const).map((l) => (
                  <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l}
                    className={`px-3.5 py-2 rounded-lg border text-sm transition-colors ${lang === l ? 'border-terracotta/50 bg-terracotta/5 text-ink font-medium' : 'border-line bg-surface text-ink-2 hover:border-line-strong'}`}>
                    {l === 'english' ? 'English' : l === 'hindi' ? 'हिन्दी' : 'தமிழ்'}
                  </button>
                ))}
              </div>
              <p className="text-[0.6875rem] text-ink-3 mt-1.5 italic">Sample wording — pending native-speaker review.</p>
            </div>
            <div className="p-4 rounded-lg bg-surface-raised border border-line">
              <p className="text-[0.8125rem] text-ink leading-relaxed italic">"{INVITE_TEMPLATES[lang]}"</p>
            </div>
            {copyFallback && (
              <div className="space-y-1.5">
                <label htmlFor="inv-copy-manual" className="label-mono text-ink-3 block">COPY MANUALLY</label>
                <textarea id="inv-copy-manual" readOnly rows={4} value={INVITE_TEMPLATES[lang]} className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-xs text-ink focus:border-terracotta outline-none" />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => { dispatch({ type: 'SEND_INVITATION', toName: toName.trim() || inv.toName, lang }); toast('Invitation sent (simulated)'); }}>Send invitation</Button>
              <Button variant="secondary" onClick={handleCopy}>Copy text</Button>
            </div>
          </>
        )}

        {invStatus === 'sent' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-gold/25 bg-gold/5">
              <p className="text-sm text-ink-2">Sent {inv.sentAt ? new Date(inv.sentAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ''} · awaiting their response.</p>
              <p className="text-xs text-ink-3 mt-1">Neither side sees anything first. Both verifications must complete before either side's findings release.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => respond(true)}>Simulate: they accept</Button>
              <Button variant="secondary" onClick={() => respond(false)}>Simulate: they decline</Button>
            </div>
          </div>
        )}

        {invStatus === 'accepted' && (
          <div className="p-4 rounded-lg border border-sage/25 bg-sage/5">
            <p className="text-sm font-medium text-sage">Accepted — mutual release unlocked.</p>
            <p className="text-xs text-ink-2 mt-1">Both sides are complete. Findings release to each party according to their grants.</p>
            <Link to="/app/verifications/IA-DEMO-0001" className="inline-block mt-3"><Button size="sm">Open verification</Button></Link>
          </div>
        )}

        {invStatus === 'declined' && (
          <div className="p-4 rounded-lg border border-taupe/25 bg-taupe/5">
            <p className="text-sm font-medium text-ink">Invitation declined.</p>
            <p className="text-xs text-ink-2 mt-1">Nothing was released. There is no negative result and no accusation — declining is information, held privately.</p>
            <p className="text-xs text-ink-3 mt-3">You can invite them again at any time, or continue with a single-person verification. Nothing about them is inferred from this.</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button size="sm" variant="secondary" onClick={() => { dispatch({ type: 'RESET_INVITATION' }); toast('Invitation reset — you can send again'); }}>
                Invite again
              </Button>
              <Link to="/app"><Button size="sm" variant="ghost">Back to overview</Button></Link>
            </div>
          </div>
        )}

        {invStatus === 'expired' && (
          <div className="p-4 rounded-lg border border-taupe/25 bg-taupe/5">
            <p className="text-sm font-medium text-ink">Invitation expired.</p>
            <p className="text-xs text-ink-2 mt-1">It was never answered. An expired invitation is not a refusal and carries no interpretation — nothing was released either way.</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button size="sm" variant="secondary" onClick={() => { dispatch({ type: 'RESET_INVITATION' }); toast('Invitation reset — you can send again'); }}>
                Send again
              </Button>
              <Link to="/app"><Button size="sm" variant="ghost">Back to overview</Button></Link>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-ink-3 leading-relaxed">
        Expiry: an unanswered invitation expires on its own and is never interpreted as a refusal or a finding.
      </p>
    </div>
  );
}

// ============================= ACCOUNT =============================
export function AccountScreen() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const user = state.user;
  const c = state.caseData;

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader eyebrow="ACCOUNT" title="Account" description="Your details, your participation, and your controls." />

      <section aria-labelledby="acc-profile" className="rounded-xl border border-line bg-surface divide-y divide-line">
        <h2 id="acc-profile" className="sr-only">Profile</h2>
        <div className="px-5 py-4">
          <span className="label-mono text-ink-3 block mb-1">NAME</span>
          <p className="text-sm text-ink">{user.name}</p>
        </div>
        <div className="px-5 py-4">
          <span className="label-mono text-ink-3 block mb-1">EMAIL</span>
          <p className="text-sm text-ink">{user.email}</p>
        </div>
        <div className="px-5 py-4">
          <span className="label-mono text-ink-3 block mb-1">PHONE</span>
          <p className="text-sm text-ink-2">{user.phone ? user.phone : 'Not provided at signup (optional)'}</p>
        </div>
      </section>

      <section aria-labelledby="acc-part" className="rounded-xl border border-line bg-surface divide-y divide-line">
        <h2 id="acc-part" className="sr-only">Verification participation</h2>
        <div className="px-5 py-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-ink">Verification participation</p>
            <p className="text-xs text-ink-3 mt-0.5">
              {c
                ? `One demonstration case — ${c.id}. You appear as the verified person (subject) in this prototype.`
                : 'No verification cases yet.'}
            </p>
          </div>
          {c && <Link to="/app/verifications/IA-DEMO-0001"><Button size="sm" variant="secondary">Open case</Button></Link>}
        </div>
        <div className="px-5 py-4">
          <p className="text-sm font-medium text-ink">Dispute access</p>
          <p className="text-xs text-ink-3 mt-0.5">Disputes are raised from the finding itself, on the verification page, and are re-examined by human reviewers.</p>
        </div>
      </section>

      <section aria-labelledby="acc-rights" className="rounded-xl border border-line bg-surface divide-y divide-line">
        <h2 id="acc-rights" className="sr-only">Data rights and privacy</h2>
        <div className="px-5 py-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-ink">Consent &amp; privacy controls</p>
            <p className="text-xs text-ink-3 mt-0.5">Grants, shares, receipts and data rights live in one place.</p>
          </div>
          <Link to="/app/privacy"><Button size="sm" variant="secondary">Open</Button></Link>
        </div>
        <div className="px-5 py-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-ink">Delete account and data</p>
            <p className="text-xs text-ink-3 mt-0.5">Prototype: clears all local workspace state immediately.</p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setDeleteOpen(true)}>Delete…</Button>
        </div>
      </section>

      <section aria-labelledby="acc-session" className="rounded-xl border border-line bg-surface divide-y divide-line">
        <h2 id="acc-session" className="sr-only">Session</h2>
        <div className="px-5 py-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-ink">Sign out</p>
            <p className="text-xs text-ink-3 mt-0.5">Ends this prototype session. Your profile and workspace stay on this device.</p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => { dispatch({ type: 'LOGOUT' }); navigate('/'); }}>Sign out</Button>
        </div>
      </section>

      <p className="text-xs text-ink-3 leading-relaxed">
        This prototype runs entirely in your browser. No account, message or document leaves this device. The demonstration case, its people and its records are fictional.
      </p>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete account and data">
        <p className="text-sm text-ink-2 leading-relaxed mb-4">
          This is destructive and cannot be undone in the prototype: it clears your session, the demonstration case, grants, shares and receipts from this device.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={() => { dispatch({ type: 'DELETE_ACCOUNT' }); window.location.assign('/'); }}>Delete everything</Button>
        </div>
      </Dialog>
    </div>
  );
}
