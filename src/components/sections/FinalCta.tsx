import { Link } from 'react-router-dom';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { Diamond } from '../ui/Diamond';
import { Button } from '../ui/Button';
import { en } from '../../content/en';

export function FinalCta() {
  return (
    <Section ariaLabelledBy="final-cta-title" alt>
      <Container>
        <div className="text-center max-w-xl mx-auto">
          <Diamond className="mb-5" />
          <h2 id="final-cta-title" className="display-m mb-4">
            {en.finalCta.h2}
          </h2>
          <p className="body-l mb-8">
            {en.finalCta.body}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/signup">
              <Button variant="primary" size="lg">{en.finalCta.primaryCta}</Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="secondary" size="lg">See how it works</Button>
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
