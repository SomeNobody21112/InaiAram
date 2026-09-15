import { useState } from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionRule } from '../ui/SectionRule';
import { pillars } from '../../data/pillars';

export function EightPillars() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
      <Section id="what-we-verify" ariaLabelledBy="pillars-title" alt>
        <Container>
          <h2 id="pillars-title" className="display-m text-center mb-3">
            What can be verified
          </h2>
          <p className="body text-center max-w-xl mx-auto mb-3">
            Every category is checked only with the person's authorisation. Nothing here can be run on someone without their knowledge.
          </p>
          <p className="meta-mono text-center mb-12">
            Eight verification pillars — each with stated coverage and known limitations
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {pillars.map((pillar) => (
              <button
                key={pillar.id}
                onClick={() => setExpandedId(expandedId === pillar.id ? null : pillar.id)}
                aria-expanded={expandedId === pillar.id}
                className={`text-left p-5 rounded-xl border transition-all duration-200 ${
                  expandedId === pillar.id
                    ? 'border-terracotta/40 bg-surface shadow-sm'
                    : 'border-line bg-surface hover:border-line-strong'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-[0.8125rem] font-semibold text-ink">{pillar.name}</h3>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    className={`shrink-0 mt-0.5 transition-transform duration-200 text-ink-3 ${expandedId === pillar.id ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    <path d="M3 4.5L6.5 8L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-xs text-ink-2 leading-relaxed mb-2">{pillar.shortDescription}</p>
                {pillar.consentRequired && (
                  <span className="text-[0.625rem] font-mono text-terracotta/70 tracking-wider uppercase">
                    Consent required
                  </span>
                )}

                {expandedId === pillar.id && (
                  <div className="mt-4 pt-4 border-t border-line space-y-3">
                    <div>
                      <span className="label-mono text-ink-3 block mb-1">What it is</span>
                      <p className="text-[0.75rem] text-ink-2 leading-relaxed">{pillar.whatItIs}</p>
                    </div>
                    <div>
                      <span className="label-mono text-ink-3 block mb-1">What may support it</span>
                      <p className="text-[0.75rem] text-ink-2 leading-relaxed">{pillar.whatMaySupportIt}</p>
                    </div>
                    <div>
                      <span className="label-mono text-ink-3 block mb-1">What a result means</span>
                      <p className="text-[0.75rem] text-ink-2 leading-relaxed">{pillar.whatResultMeans}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-terracotta/5 border border-terracotta/10">
                      <span className="label-mono text-terracotta block mb-1">Known limitation</span>
                      <p className="text-[0.75rem] text-ink-2 leading-relaxed">{pillar.knownLimitation}</p>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </Container>
      </Section>
      <div className="bg-bg"><SectionRule label="◆ HOW IT WORKS ◆" className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12" /></div>
    </>
  );
}
