import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';

export function TermsPage() {
  return (
    <main className="bg-bg" id="main-content">
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="text-sm text-ink-3 hover:text-ink transition-colors mb-8 inline-block">
              ← Back to home
            </Link>

            <h1 className="display-m mb-4">Terms of Verification</h1>
            <p className="text-xs font-mono text-gold bg-gold/10 border border-gold/20 px-3 py-1.5 rounded-full inline-block mb-8">
              Draft under review — not yet in effect
            </p>

            <div className="space-y-6 text-sm text-ink-2 leading-relaxed">
              <p>
                These Terms of Verification govern the use of the InaiAram verification platform. By using InaiAram, you agree to these terms.
              </p>
              <h2 className="h3 text-ink">Nature of Service</h2>
              <p>
                InaiAram is an evidence verification and identity matching technology platform. It is not a detective agency, does not offer covert surveillance services, does not judge moral character, and does not guarantee the absence of non-indexed records.
              </p>
              <h2 className="h3 text-ink">Verification Scope</h2>
              <p>
                Verification is conducted using publicly or institutionally available records, with the explicit consent of the person being verified. The scope of verification is agreed upon before any search begins. Results are limited to the scope agreed.
              </p>
              <h2 className="h3 text-ink">No Certainty Guarantee</h2>
              <p>
                No database contains everything about a person. Name-based searching is imperfect in both directions. Some records exist only if the person requests them. An inability to establish something is itself a legitimate verification outcome. InaiAram does not fabricate, assume, or imply data that cannot be established through verified sources.
              </p>
              <h2 className="h3 text-ink">Report Use</h2>
              <p>
                Reports are provided to assist in informed decision-making. They are not a substitute for personal judgment. InaiAram does not advise on whether to proceed with any relationship or decision.
              </p>
              <h2 className="h3 text-ink">Disputes and Corrections</h2>
              <p>
                If a finding about you is incorrect, you may dispute it. InaiAram will show the reasoning and source, re-examine the finding, and correct the record with everyone it was shared with.
              </p>
              <h2 className="h3 text-ink">Contact</h2>
              <p>
                For terms-related enquiries, please contact us. (Contact details to be confirmed before launch.)
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
