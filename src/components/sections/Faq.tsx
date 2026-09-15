import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { Accordion, AccordionItem } from '../ui/Accordion';
import { en } from '../../content/en';

export function Faq() {
  return (
    <Section id="faq" ariaLabelledBy="faq-title">
      <Container>
        <h2 id="faq-title" className="display-m text-center mb-10">
          {en.faq.h2}
        </h2>
        <Accordion className="max-w-3xl mx-auto">
          {en.faq.items.map((item, i) => (
            <AccordionItem key={i} title={item.q}>
              <p>{item.a}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
}
