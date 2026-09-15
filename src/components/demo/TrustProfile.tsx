import { StateChip } from '../ui/StateChip';
import { en } from '../../content/en';
import type { ClaimState } from '../../data/sampleCase';

/**
 * TRUST PROFILE COMPACT — the hero's illustrative product glimpse.
 * A static, clearly-labelled fictional case: same case, different visibility.
 * This is presentation only — the interactive workspace lives under /app.
 */
const ROWS: { label: string; state: ClaimState }[] = [
  { label: 'Identity', state: 'verified' },
  { label: 'Education', state: 'verified' },
  { label: 'Employment', state: 'supported' },
  { label: 'Court & legal', state: 'noMatchFound' },
  { label: 'Marital status', state: 'verified' },
];

export function TrustProfileCompact() {
  return (
    <div className="rounded-2xl border border-line bg-surface overflow-hidden shadow-sm">
      {/* Case header */}
      <div className="px-5 pt-4 pb-3 border-b border-line flex items-center justify-between gap-3">
        <p className="font-mono text-[0.625rem] tracking-[0.14em] uppercase text-ink-3">
          {en.demo.sampleLabel} · {en.demo.caseId}
        </p>
        <p className="font-mono text-[0.5625rem] tracking-[0.1em] uppercase text-terracotta">
          {en.demo.illustrationLabel}
        </p>
      </div>

      {/* Subject */}
      <div className="px-5 py-4 border-b border-line">
        <p className="text-base font-semibold text-ink">{en.demo.subjectName}</p>
        <p className="text-xs text-ink-3 mt-0.5">28 · Chennai, Tamil Nadu · Illustrative</p>
      </div>

      {/* Findings */}
      <div className="divide-y divide-line">
        {ROWS.map((row) => (
          <div key={row.label} className="px-5 py-3 flex items-center justify-between gap-3">
            <span className="text-sm text-ink-2">{row.label}</span>
            <StateChip state={row.state} />
          </div>
        ))}
      </div>

      {/* Family note */}
      <div className="px-5 py-4 border-t border-line bg-bg-alt">
        <p className="text-[0.6875rem] text-ink-3 leading-relaxed">{en.demo.familyCaption}</p>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-line">
        <p className="text-[0.6875rem] text-sage leading-relaxed">{en.demo.overallAssessment}</p>
        <p className="text-[0.625rem] text-ink-3 mt-1.5 font-mono">{en.demo.exportDisabled}</p>
      </div>
    </div>
  );
}