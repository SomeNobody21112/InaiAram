/**
 * CONSENT — subject-side per-category authorisation.
 * Makes it impossible to mistake "not consented" for a negative result.
 */
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { EmptyState, PageHeader } from '../../ui/primitives';
import { useToast } from '../../ui/primitives';
import { useApp, useCase, gatesFor, invitationEffectiveStatus } from '../../../store/app';
import { ConsentControl, MutualGate } from '../domain';
import { PILLAR_BY_ID, type PillarId } from '../../../store/types';

export function ConsentScreen() {
  const { dispatch } = useApp();
  const c = useCase();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!c) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="CONSENT" title="Consent" />
        <EmptyState title="No verification yet" body="Consent is requested within a verification. Start one first." action={<Link to="/app/new-verification"><Button>Start a verification</Button></Link>} />
      </div>
    );
  }

  const gates = gatesFor(c);
  const pendingCount = c.scope.filter((p) => c.consents[p]?.state === 'pending').length;
  const grantedCount = c.scope.filter((p) => gates.canShare(p)).length;
  const declinedCount = c.scope.filter((p) => ['declined', 'withdrawn'].includes(c.consents[p]?.state ?? 'pending')).length;
  const allDecided = pendingCount === 0;

  const act = (type: 'GRANT_CONSENT' | 'DECLINE_CONSENT' | 'WITHDRAW_CONSENT', pillar: PillarId, message: string) => {
    dispatch({ type, pillar });
    toast(message);
  };

  const mutualReleaseReady = c.mode === 'mutual' && grantedCount > 0;
  const theirStatus = (() => {
    if (!c.invitation) return 'awaiting';
    const st = invitationEffectiveStatus(c.invitation);
    return st === 'accepted' ? 'accepted' : st === 'declined' ? 'declined' : 'awaiting';
  })();

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        eyebrow="CONSENT"
        title="Your consent. Your terms."
        description="Each category is authorised independently, before any search. Grant only what you are comfortable with — withdrawal is one action, needs no reason, and is recorded in the ledger."
      />

      {mutualReleaseReady && (
        <MutualGate
          yourConsentDone={allDecided}
          theirStatus={theirStatus}
          onOpenInvitation={c.invitation ? () => navigate(`/app/invitations/${c.invitation!.id}`) : undefined}
        />
      )}

      <section aria-labelledby="consent-list">
        <div className="flex items-center justify-between mb-3">
          <h2 id="consent-list" className="label-mono text-ink-3">CATEGORIES IN THIS VERIFICATION</h2>
          {pendingCount > 0 && (
            <Button size="sm" variant="secondary" onClick={() => { dispatch({ type: 'GRANT_ALL_CONSENT' }); toast('Consent granted for all pending categories'); }}>
              Grant all
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {c.scope.map((p) => (
            <ConsentControl
              key={p}
              pillar={p}
              consent={c.consents[p]}
              onGrant={() => act('GRANT_CONSENT', p, `Consent granted — ${PILLAR_BY_ID[p].name}`)}
              onDecline={() => act('DECLINE_CONSENT', p, `Consent declined — ${PILLAR_BY_ID[p].name}. The check will not be performed.`)}
              onWithdraw={() => act('WITHDRAW_CONSENT', p, `Consent withdrawn — ${PILLAR_BY_ID[p].name}. Any related shares have ended.`)}
            />
          ))}
        </div>
      </section>

      {allDecided && grantedCount > 0 && c.simPhase === 0 && (
        <section className="rounded-xl border border-gold/25 bg-gold/5 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-ink">Consent decided — {grantedCount} categor{grantedCount === 1 ? 'y' : 'ies'} authorised</p>
              <p className="text-xs text-ink-3 mt-0.5">
                {c.mode === 'mutual' && !c.mutualReleased
                  ? 'Your side is ready. Checks begin for you once the other side has accepted and completed their own verification.'
                  : 'Checks may now proceed, in stages, with human review before anything is reported.'}
              </p>
            </div>
            {c.mode === 'mutual' && !gates.canRelease ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => c.invitation && navigate(`/app/invitations/${c.invitation.id}`)}
              >
                Send or track the invitation
              </Button>
            ) : gates.canVerify ? (
              <Button size="sm" onClick={() => { dispatch({ type: 'ADVANCE_SIMULATION' }); toast('First stage of checks started'); }}>Begin verification</Button>
            ) : null}
          </div>
        </section>
      )}

      {allDecided && grantedCount === 0 && (
        <section className="rounded-xl border border-line bg-surface-raised p-5">
          <p className="text-sm font-medium text-ink">Nothing has been authorised.</p>
          <p className="text-xs text-ink-2 mt-1 leading-relaxed max-w-xl">
            With no categories granted, no checks are performed and nothing is released — to you or to anyone else. This is a valid choice, not a failure. You can return to grant consent later, or leave the verification as it is.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Link to="/app"><Button size="sm" variant="secondary">Back to overview</Button></Link>
          </div>
        </section>
      )}

      {allDecided && declinedCount > 0 && grantedCount > 0 && (
        <p className="text-xs text-ink-3 leading-relaxed">
          {declinedCount} categor{declinedCount === 1 ? 'y shows' : 'ies show'} "Requires consent" — declined categories are never reported as failed, missing, or negative. They simply were not performed.
        </p>
      )}

      <p className="text-xs text-ink-3 leading-relaxed">
        Why this exists: consent occurs <em>before</em> searching. A category without consent simply shows "Requires consent" — it is never reported as failed, missing, or negative.
      </p>
    </div>
  );
}
