import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionRule } from '../ui/SectionRule';
import { en } from '../../content/en';

export function WhyInaiAram() {
  return (
    <>
      <Section id="why-inaiaram" ariaLabelledBy="wia-title">
        <Container>
          <h2 id="wia-title" className="display-m text-center mb-14">
            {en.whyInaiAram.h2}
          </h2>

          {/* Four pillars */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14 max-w-4xl mx-auto">
            {en.whyInaiAram.pillars.map((pillar) => (
              <div key={pillar.title} className="p-5 rounded-xl border border-line bg-surface text-center">
                <h3 className="text-[0.8125rem] font-semibold text-ink mb-2">{pillar.title}</h3>
                <p className="text-xs text-ink-2 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="max-w-3xl mx-auto">
            {/* Desktop — proper grid */}
            <div className="hidden lg:block border border-line rounded-xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-2">
                <div className="px-5 py-3 bg-bg-alt border-r border-line">
                  <span className="label-mono">{en.whyInaiAram.comparison.usualApproach}</span>
                </div>
                <div className="px-5 py-3 bg-bg-alt">
                  <span className="label-mono">{en.whyInaiAram.comparison.inaiaram}</span>
                </div>
              </div>
              {/* Rows */}
              {en.whyInaiAram.comparison.rows.map(([usual, inaiaram], i) => (
                <div key={i} className="grid grid-cols-2">
                  <div className={`px-5 py-3.5 border-r border-line border-t border-line ${i % 2 === 0 ? 'bg-surface' : 'bg-surface-raised'}`}>
                    <p className="text-[0.8125rem] text-ink-3">{usual}</p>
                  </div>
                  <div className={`px-5 py-3.5 border-t border-line ${i % 2 === 0 ? 'bg-surface' : 'bg-surface-raised'}`}>
                    <p className="text-[0.8125rem] text-ink font-medium">{inaiaram}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile — paired blocks */}
            <div className="lg:hidden space-y-3">
              {en.whyInaiAram.comparison.rows.map(([usual, inaiaram], i) => (
                <div key={i} className="border border-line rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-bg-alt">
                    <span className="label-mono block mb-1">{en.whyInaiAram.comparison.usualApproach}</span>
                    <p className="text-[0.8125rem] text-ink-2">{usual}</p>
                  </div>
                  <div className="px-4 py-3 bg-surface">
                    <span className="label-mono block mb-1 text-terracotta">{en.whyInaiAram.comparison.inaiaram}</span>
                    <p className="text-[0.8125rem] text-ink font-medium">{inaiaram}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <div className="bg-bg"><SectionRule label="◆ MUTUAL VERIFICATION ◆" className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12" /></div>
    </>
  );
}
