import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';

export function PrivacyPage() {
  return (
    <main className="bg-bg" id="main-content">
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="text-sm text-ink-3 hover:text-ink transition-colors mb-8 inline-block">
              ← Back to home
            </Link>

            <h1 className="display-m mb-4">Privacy Policy</h1>
            <p className="text-xs font-mono text-gold bg-gold/10 border border-gold/20 px-3 py-1.5 rounded-full inline-block mb-8">
              Draft under review — not yet in effect
            </p>

            <div className="space-y-6 text-sm text-ink-2 leading-relaxed">
              <p>
                InaiAram is committed to protecting the privacy of every person who uses our verification services. This Privacy Policy describes how we collect, use, store, and protect information in connection with our matrimonial verification platform.
              </p>
              <h2 className="h3 text-ink">Information We Collect</h2>
              <p>
                We collect only the minimum information necessary for the agreed verification scope. This includes identity information voluntarily provided by the person being verified, verification claims and findings, consent records, and access receipts. We do not collect information beyond the agreed scope.
              </p>
              <h2 className="h3 text-ink">How We Use Information</h2>
              <p>
                Information is used solely to perform the agreed verification, generate findings and reports, maintain consent records, and provide access receipts to the subject. We do not use verification data for marketing, profiling, or any purpose beyond the stated verification scope.
              </p>
              <h2 className="h3 text-ink">Data Storage and Security</h2>
              <p>
                We store verification findings, not source documents, once verification is complete. Identity numbers are never stored — only a salted hash and the verified attributes. Access to any shared information is logged and visible to the subject. All shares are purpose-bound and time-boxed by default.
              </p>
              <h2 className="h3 text-ink">Data Retention and Deletion</h2>
              <p>
                Findings are retained according to the schedule set at the start of each case. Upon case conclusion, data is deleted on the agreed schedule and deletion is confirmed to the user. We do not retain data beyond the agreed period without explicit consent.
              </p>
              <h2 className="h3 text-ink">Your Rights</h2>
              <p>
                You may withdraw consent at any time in one action, without giving a reason. You may dispute any finding about you. You may request access to all information held about you. You may request deletion of your data.
              </p>
              <h2 className="h3 text-ink">Contact</h2>
              <p>
                For privacy-related enquiries, please contact us. (Contact details to be confirmed before launch.)
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
