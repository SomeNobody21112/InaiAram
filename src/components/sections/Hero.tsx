import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { TrustProfileCompact } from '../demo/TrustProfile';
import { en } from '../../content/en';
import { useReveal } from '../../hooks/useReveal';
import { SelectedClaimContext } from '../../hooks/useSelectedClaim';
import { useState } from 'react';

export function Hero() {
  const ref = useReveal({ once: true, threshold: 0.05 });
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  return (
    <SelectedClaimContext.Provider value={{ selectedClaimId, setSelectedClaimId, selectedClaim: null }}>
      <section className="section-py bg-bg overflow-hidden" ref={ref}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — copy */}
            <div className="max-w-lg">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 mb-5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gold" aria-hidden="true">
                  <path d="M6 1L7.3 4.5L11 4.8L8.2 7.3L9.1 11L6 9L2.9 11L3.8 7.3L1 4.8L4.7 4.5L6 1Z" stroke="currentColor" strokeWidth="0.8" />
                </svg>
                <span className="font-mono text-[0.625rem] tracking-[0.12em] uppercase text-gold font-medium">
                  {en.hero.eyebrow}
                </span>
              </div>

              {/* H1 */}
              <h1 className="display-xl mb-5">
                {en.hero.h1}{' '}
                <span className="accent-word">{en.hero.h1Accent}</span>
              </h1>

              {/* Sub */}
              <p className="body-l mb-7 max-w-md">
                {en.hero.sub}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Link to="/signup">
                  <Button variant="primary" size="lg">
                    {en.hero.primaryCta}
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <path d="M3 7.5h9M8.5 4l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="secondary" size="lg">
                    {en.hero.secondaryCta}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M4.5 2.5l7 4.5-7 4.5V2.5z" fill="currentColor" />
                    </svg>
                  </Button>
                </a>
              </div>

              {/* Principles */}
              <p className="text-[0.8125rem] text-ink-3">
                <span className="text-terracotta mr-1.5" aria-hidden="true">⊕</span>
                {en.hero.principles}
              </p>
            </div>

            {/* Right — Trust Profile compact */}
            <div className="lg:ml-auto w-full max-w-[520px]">
              <TrustProfileCompact />
              <Link
                to="/signup"
                className="mt-3 inline-flex items-center gap-2 text-[0.8125rem] text-terracotta hover:text-terracotta-deep transition-colors font-medium"
              >
                {en.demo.openFullDemo}
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M2.5 6.5h8M7 4l3 2.5-3 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SelectedClaimContext.Provider>
  );
}
