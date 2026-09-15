import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { en } from '../../content/en';

export function Limitations() {
  return (
    <Section id="limitations" ariaLabelledBy="lim-title" alt>
      <Container>
        <h2 id="lim-title" className="display-m text-center mb-14">
          {en.limitations.h2}
        </h2>
        <div className="max-w-3xl mx-auto space-y-0">
          {en.limitations.items.map((item, i) => (
            <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-8 border-b border-line py-6 last:border-0">
              <p className="text-[0.8125rem] text-ink font-medium leading-relaxed">{item.statement}</p>
              <p className="text-[0.8125rem] text-ink-2 leading-relaxed">{item.consequence}</p>
            </div>
          ))}
        </div>
        <p className="display-m text-center mt-14 max-w-xl mx-auto italic">
          {en.limitations.closing}
        </p>
      </Container>
    </Section>
  );
}
