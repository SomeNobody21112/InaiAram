import { useState } from 'react';
import type { ClaimState } from '../../data/sampleCase';
import { en } from '../../content/en';

interface StateChipProps {
  state: ClaimState;
  expanded?: boolean;
}

const stateStyles: Record<ClaimState, { color: string; bg: string; border: string }> = {
  verified: { color: 'text-sage', bg: 'bg-sage/10', border: 'border-sage/20' },
  supported: { color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/20' },
  requiresConsent: { color: 'text-terracotta', bg: 'bg-terracotta/10', border: 'border-terracotta/20' },
  candidateControlled: { color: 'text-terracotta', bg: 'bg-terracotta/10', border: 'border-terracotta/20' },
  noMatchFound: { color: 'text-taupe', bg: 'bg-taupe/10', border: 'border-taupe/20' },
  conflicting: { color: 'text-terracotta-deep', bg: 'bg-terracotta-deep/10', border: 'border-terracotta-deep/20' },
  requiresClarification: { color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/20' },
  unavailable: { color: 'text-ink-3', bg: 'bg-ink-3/10', border: 'border-ink-3/20' },
  underReview: { color: 'text-gold-soft', bg: 'bg-gold-soft/10', border: 'border-gold-soft/20' },
};

const glyphs: Record<ClaimState, string> = {
  verified: '✓',
  supported: '◑',
  requiresConsent: '🔑',
  candidateControlled: '🔒',
  noMatchFound: '○',
  conflicting: '⇄',
  requiresClarification: '⊕',
  unavailable: '—',
  underReview: '◷',
};

const stateLabels: Record<ClaimState, string> = {
  verified: 'Verified',
  supported: 'Supported',
  requiresConsent: 'Requires consent',
  candidateControlled: 'Candidate-controlled',
  noMatchFound: 'No matching record found',
  conflicting: 'Conflicting',
  requiresClarification: 'Requires clarification',
  unavailable: 'Unavailable',
  underReview: 'Under review',
};

export function StateChip({ state, expanded: controlledExpanded }: StateChipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const expanded = controlledExpanded ?? isOpen;
  const style = stateStyles[state];
  const stateInfo = en.states[state];

  return (
    <div className="inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={expanded}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.6875rem] font-medium font-sans ${style.color} ${style.bg} ${style.border} transition-all duration-150 cursor-pointer`}
      >
        <span aria-hidden="true" className="text-[0.75rem] leading-none">{glyphs[state]}</span>
        <span>{stateLabels[state]}</span>
      </button>
      {expanded && stateInfo && (
        <div className="mt-2 p-3 rounded-lg bg-surface-raised border border-line text-[0.75rem] text-ink-2 leading-relaxed max-w-xs">
          <p className="font-medium text-ink mb-1">{stateInfo.description}</p>
          <p className="text-ink-3 italic">What this does not mean: {stateInfo.doesNotMean}</p>
        </div>
      )}
    </div>
  );
}
