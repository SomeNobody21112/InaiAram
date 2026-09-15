import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { Callout } from '../ui/Callout';
import { company } from '../../config/company';
import { en } from '../../content/en';

export function Health() {
  return (
    <Section id="health" ariaLabelledBy="health-title">
      <Container>
        <div className="max-w-3xl mx-auto">
          {company.healthModuleStatus === 'planned' && (
            <div className="text-center mb-6">
              <span className="text-xs font-mono text-gold bg-gold/10 border border-gold/20 px-3 py-1.5 rounded-full">
                {en.health.status}
              </span>
            </div>
          )}

          <h2 id="health-title" className="display-m text-center mb-5">
            {en.health.h2}
          </h2>
          <p className="body-l text-center max-w-2xl mx-auto mb-10">
            {en.health.body}
          </p>

          {/* Four-step diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {en.health.steps.map((step, i) => (
              <div key={i} className="p-5 rounded-xl border border-line bg-surface text-center">
                <div className="w-9 h-9 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto mb-3 font-mono text-sm">
                  {i + 1}
                </div>
                <p className="text-[0.8125rem] font-medium text-ink mb-1">{step.actor}</p>
                <p className="text-xs text-ink-2 mb-2">{step.action}</p>
                <p className="text-xs text-ink-3 italic">Holds: {step.holds}</p>
              </div>
            ))}
          </div>

          {/* Callout */}
          <Callout variant="gold" className="mb-8">
            <p className="text-[0.8125rem] text-ink leading-relaxed font-medium">
              {en.health.callout}
            </p>
          </Callout>

          {/* Scope */}
          <p className="text-[0.8125rem] text-ink-2 leading-relaxed max-w-2xl mx-auto">
            {en.health.scope}
          </p>
        </div>
      </Container>
    </Section>
  );
}
