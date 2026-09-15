import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { Emblem } from '../ui/Emblem';
import { AskKit } from '../interactive/AskKit';
import { en } from '../../content/en';

export function TheAsk() {
  return (
    <Section id="the-ask" ariaLabelledBy="ask-title">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-14">
          <Emblem size={44} className="text-terracotta mx-auto mb-5" opacity={0.2} />
          <h2 id="ask-title" className="display-m mb-5">
            {en.theAsk.h2}
          </h2>
          <p className="body-l max-w-2xl mx-auto whitespace-pre-line">
            {en.theAsk.body}
          </p>
        </div>
        <AskKit />
      </Container>
    </Section>
  );
}
