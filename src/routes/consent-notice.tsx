import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';

export function ConsentNoticePage() {
  return (
    <main className="bg-bg" id="main-content">
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="text-sm text-ink-3 hover:text-ink transition-colors mb-8 inline-block">
              ← Back to home
            </Link>

            <h1 className="display-m mb-4">Consent Notice</h1>
            <p className="text-xs font-mono text-gold bg-gold/10 border border-gold/20 px-3 py-1.5 rounded-full inline-block mb-8">
              Draft under review — not yet in effect
            </p>

            <div className="space-y-6 text-sm text-ink-2 leading-relaxed">
              <p>
                InaiAram operates on the principle of explicit, informed, and revocable consent. This notice describes how consent works within the InaiAram verification platform.
              </p>
              <h2 className="h3 text-ink">Before Verification Begins</h2>
              <p>
                Every person who is the subject of a verification must explicitly authorise the checks that will be performed. They are told what categories will be checked before any search begins. Nothing starts without that authorisation.
              </p>
              <h2 className="h3 text-ink">Scope of Consent</h2>
              <p>
                Consent is granted per category. A person may consent to identity verification without consenting to legal records search, for example. Each category's consent is independent.
              </p>
              <h2 className="h3 text-ink">Sharing and Disclosure</h2>
              <p>
                Any information shared with another party (a partner, a family delegate) requires explicit consent from the subject. Shares are purpose-bound — limited to a stated purpose such as "matrimonial evaluation" — and expire by default after a set period.
              </p>
              <h2 className="h3 text-ink">Revocation</h2>
              <p>
                Consent may be withdrawn at any time in one action, without giving a reason. Withdrawal ends all active shares and prevents new ones. The withdrawal is recorded in the consent ledger.
              </p>
              <h2 className="h3 text-ink">Visibility</h2>
              <p>
                The subject can see every access to their information. Every share generates a receipt visible in the consent ledger. There is no silent access — a family delegate, a partner, or any other party leaves a visible record.
              </p>
              <h2 className="h3 text-ink">Contact</h2>
              <p>
                For consent-related enquiries, please contact us. (Contact details to be confirmed before launch.)
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
