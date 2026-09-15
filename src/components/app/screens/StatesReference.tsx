/**
 * STATES REFERENCE — how to read a finding.
 * The nine canonical result states, each with its meaning and — just as
 * important — what it does NOT mean. Plus the three coverage states.
 * This is product context, not documentation software.
 */
import { PageHeader } from '../../ui/primitives';
import { en } from '../../../content/en';
import { CoveragePill, StateChip } from '../domain';
import type { ClaimState } from '../../../store/types';

const ORDER: ClaimState[] = [
  'verified',
  'supported',
  'requiresConsent',
  'candidateControlled',
  'noMatchFound',
  'conflicting',
  'requiresClarification',
  'unavailable',
  'underReview',
];

const COVERAGE = [
  { status: 'searched' as const, meaning: 'Records for this jurisdiction or source were searched within the window of the check.', doesNotMean: 'This does not mean every record in that jurisdiction was digital, complete, or searchable.' },
  { status: 'partial' as const, meaning: 'Records were searched, but with known gaps — incomplete digitisation, limited years, or restricted access.', doesNotMean: 'This does not mean the missing part is hiding something — it is often simply not digital.' },
  { status: 'not-searched' as const, meaning: 'This jurisdiction or source was outside the declared scope, so nothing was searched there.', doesNotMean: 'This does not mean a record exists there — only that it was not searched.' },
];

export function StatesReferenceScreen() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="RESULT STATES"
        title="How to read a result"
        description="Every finding is one of nine states — and every state carries what it does not mean. Certainty attaches to a claim, never to a person."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ORDER.map((state) => {
          const info = en.states[state];
          return (
            <div key={state} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-sm font-semibold text-ink">{info.label}</h2>
                <StateChip state={state} />
              </div>
              <p className="text-sm text-ink-2 leading-relaxed mb-2">{info.description}</p>
              <p className="text-xs text-ink-3 italic leading-relaxed">What this does not mean: {info.doesNotMean}</p>
            </div>
          );
        })}
      </div>

      <section aria-labelledby="coverage-ref">
        <h2 id="coverage-ref" className="label-mono text-ink-3 mb-3">COVERAGE STATES</h2>
        <div className="rounded-xl border border-line bg-surface divide-y divide-line">
          {COVERAGE.map((c) => (
            <div key={c.status} className="px-5 py-4 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink-2 leading-relaxed">{c.meaning}</p>
                <p className="text-xs text-ink-3 italic mt-1">What this does not mean: {c.doesNotMean}</p>
              </div>
              <div className="shrink-0"><CoveragePill status={c.status} /></div>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-3 mt-3 leading-relaxed max-w-2xl">
          Coverage is always stated with the finding — where it was searched, what was searched, and what was not. No finding is reported without its coverage.
        </p>
      </section>

      <p className="text-xs text-ink-3 leading-relaxed max-w-2xl">
        These states never add up to a score, a rating, or a recommendation about a person. They describe claims — nothing more.
      </p>
    </div>
  );
}