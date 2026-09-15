import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { en } from '../../content/en';

export function InformationAsymmetry() {
  return (
    <Section id="information-asymmetry" ariaLabelledBy="ia-title" alt>
      <Container>
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rotate-45 bg-terracotta" aria-hidden="true" />
            <span className="label-mono">{en.informationAsymmetry.eyebrow}</span>
          </div>
          <h2 id="ia-title" className="display-l mb-5">
            {en.informationAsymmetry.h2}{' '}
            <span className="accent-word">{en.informationAsymmetry.h2Accent}</span>
          </h2>
          <p className="body-l max-w-2xl mx-auto">
            {en.informationAsymmetry.body}
          </p>
        </div>

        {/* Three cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {en.informationAsymmetry.cards.map((card) => (
            <Card key={card.number} className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-3">{card.number}</span>
                <span className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-3">·</span>
                <span className="label-mono text-ink-3">{card.label}</span>
              </div>
              <h3 className="h3 mb-3">{card.title}</h3>
              <p className="text-[0.8125rem] text-ink-2 leading-relaxed mb-4">{card.description}</p>
              <ul className="space-y-2">
                {card.items.map((item, i) => {
                  if (typeof item === 'string') {
                    return (
                      <li key={i} className="flex items-center gap-2 text-[0.8125rem] text-ink-2">
                        <span className="w-1 h-1 rounded-full bg-terracotta shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    );
                  }
                  return (
                    <li key={i} className="flex items-center justify-between text-[0.8125rem] text-ink-2">
                      <span>{item.text}</span>
                      <span className="text-xs font-medium text-sage bg-sage/10 px-2 py-0.5 rounded-full">{item.badge}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
