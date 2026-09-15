import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { Emblem } from '../ui/Emblem';
import { en } from '../../content/en';
import { useState } from 'react';

export function MutualTrust() {
  const [personADone, setPersonADone] = useState(false);
  const [personBDone, setPersonBDone] = useState(false);
  const bothDone = personADone && personBDone;

  return (
    <Section id="mutual-trust" ariaLabelledBy="mt-title">
      <Container>
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rotate-45 bg-terracotta" aria-hidden="true" />
            <span className="label-mono">{en.mutualTrust.eyebrow}</span>
          </div>
          <h2 id="mt-title" className="display-l mb-4">
            {en.mutualTrust.h2}
          </h2>
          <p className="display-m text-terracotta mb-5" style={{ fontStyle: 'italic' }}>
            {en.mutualTrust.h2Accent}
          </p>
          <p className="body-l max-w-2xl mx-auto">
            {en.mutualTrust.body}
          </p>
        </div>

        {/* Interactive mutual verification diagram */}
        <div className="max-w-3xl mx-auto bg-surface rounded-xl border border-line p-6 lg:p-10">
          <div className="flex items-center justify-between mb-6">
            <span className="label-mono">DUAL-CONSENT SIMULTANEOUS RELEASE PROTOCOL</span>
            <span className={`text-xs font-mono px-3 py-1 rounded-full ${
              bothDone ? 'bg-sage/10 text-sage border border-sage/30' : 'bg-gold/10 text-gold border border-gold/30'
            }`}>
              {bothDone ? '● Mutual Lock Cleared (Reports Visible)' : '🔒 Status: Mutual Lock Active'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-6">
            {/* Person A */}
            <div className={`flex-1 w-full text-center p-5 rounded-xl border transition-all duration-300 ${
              personADone ? 'border-sage/30 bg-sage/5' : 'border-line bg-surface-raised'
            }`}>
              <div className="w-11 h-11 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto mb-3 font-serif text-base">
                A
              </div>
              <p className="text-[0.8125rem] font-medium text-ink mb-1">Prospective Partner 1</p>
              <p className="text-xs text-ink-3 mb-4">Senior Product Manager · Mumbai</p>
              <button
                onClick={() => setPersonADone(!personADone)}
                className={`text-xs font-medium px-4 py-2 rounded-full transition-colors ${
                  personADone
                    ? 'bg-sage/10 text-sage border border-sage/30'
                    : 'bg-surface border border-line text-ink-3 hover:text-ink hover:border-line-strong'
                }`}
              >
                {personADone ? 'Consent Granted ✓' : 'Grant Consent'}
              </button>
            </div>

            {/* InaiAram center */}
            <div className="flex flex-col items-center shrink-0 px-4">
              <Emblem size={44} className="text-terracotta mb-2" />
              <span className="font-serif text-sm text-ink">InaiAram</span>
              <span className="text-[0.6875rem] text-ink-3 mt-0.5">Secure · Private · Neutral</span>
            </div>

            {/* Person B */}
            <div className={`flex-1 w-full text-center p-5 rounded-xl border transition-all duration-300 ${
              personBDone ? 'border-sage/30 bg-sage/5' : 'border-line bg-surface-raised'
            }`}>
              <div className="w-11 h-11 rounded-full bg-sage/10 text-sage flex items-center justify-center mx-auto mb-3 font-serif text-base">
                B
              </div>
              <p className="text-[0.8125rem] font-medium text-ink mb-1">Prospective Partner 2</p>
              <p className="text-xs text-ink-3 mb-4">Pediatric Surgeon · Bengaluru</p>
              <button
                onClick={() => setPersonBDone(!personBDone)}
                className={`text-xs font-medium px-4 py-2 rounded-full transition-colors ${
                  personBDone
                    ? 'bg-sage/10 text-sage border border-sage/30'
                    : 'bg-surface border border-line text-ink-3 hover:text-ink hover:border-line-strong'
                }`}
              >
                {personBDone ? 'Consent Granted ✓' : 'Grant Consent'}
              </button>
            </div>
          </div>

          {/* Message */}
          <div className="mt-6 text-center">
            {bothDone ? (
              <p className="text-[0.8125rem] text-sage font-medium">
                Both verifications are complete. Findings are now visible to each party according to their role.
              </p>
            ) : (
              <p className="text-[0.8125rem] text-ink-3">
                Neither side sees anything first. Both verifications must be complete before either side's findings are released.
              </p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
