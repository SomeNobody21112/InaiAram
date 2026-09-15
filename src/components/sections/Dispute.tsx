import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { en } from '../../content/en';

export function Dispute() {
  return (
    <Section ariaLabelledBy="dispute-title" alt>
      <Container>
        <div className="max-w-3xl mx-auto bg-surface rounded-xl border border-line p-8 lg:p-10">
          <h2 id="dispute-title" className="display-m mb-4">
            {en.dispute.h3}
          </h2>
          <p className="body-l">
            {en.dispute.body}
          </p>
        </div>
      </Container>
    </Section>
  );
}
