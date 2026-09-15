import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionRule } from '../ui/SectionRule';
import { en } from '../../content/en';

export function HowItWorks() {
  return (
    <>
      <Section id="how-it-works" ariaLabelledBy="hiw-title" alt>
        <Container>
          <h2 id="hiw-title" className="display-m text-center mb-14">
            {en.howItWorks.h2}
          </h2>

          {/* Steps */}
          <div className="relative max-w-4xl mx-auto">
            {/* Connecting rule — desktop only */}
            <div className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-px" aria-hidden="true">
              <div className="h-full bg-gradient-to-r from-terracotta/40 via-gold/40 to-sage/40" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-5">
              {en.howItWorks.steps.map((step, i) => {
                const colors = ['text-terracotta', 'text-terracotta', 'text-gold', 'text-gold', 'text-sage'];
                const borderColors = ['border-terracotta', 'border-terracotta', 'border-gold', 'border-gold', 'border-sage'];
                return (
                  <div key={i} className="relative flex flex-col items-center text-center">
                    {/* Step number circle */}
                    <div
                      className={`w-11 h-11 rounded-full border-2 ${borderColors[i]} ${colors[i]} flex items-center justify-center font-mono text-sm font-medium bg-bg-alt relative z-10 mb-4`}
                    >
                      {i + 1}
                    </div>
                    <h3 className="text-sm font-semibold text-ink mb-1.5">{step.title}</h3>
                    <p className="text-[0.8125rem] text-ink-2 leading-relaxed max-w-[200px]">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>
      <div className="bg-bg"><SectionRule label="◆ THE EVIDENCE THREAD ◆" className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12" /></div>
    </>
  );
}
