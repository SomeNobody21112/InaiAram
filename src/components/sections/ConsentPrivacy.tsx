import { Link } from 'react-router-dom';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { Diamond } from '../ui/Diamond';
import { en } from '../../content/en';

export function ConsentPrivacy() {
  return (
    <Section id="consent-privacy" ariaLabelledBy="cp-title" alt>
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="display-m text-ink mb-3">
            Before making a lifelong decision, know what you can.
          </p>
          <Diamond />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* Consent */}
          <div>
            <h2 className="display-m mb-5">{en.consentPrivacy.consent.h2}</h2>
            <ul className="space-y-3.5">
              {en.consentPrivacy.consent.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-[0.8125rem] text-ink-2 leading-relaxed">
                  <span className="text-terracotta mt-0.5 shrink-0">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M4.5 7.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy */}
          <div>
            <h2 className="display-m mb-5">{en.consentPrivacy.privacy.h2}</h2>
            <ul className="space-y-3.5">
              {en.consentPrivacy.privacy.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-[0.8125rem] text-ink-2 leading-relaxed">
                  <span className="text-sage mt-0.5 shrink-0">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <rect x="2.5" y="2.5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M5.5 7.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Document links */}
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-line">
          <div className="flex flex-wrap justify-center gap-6 mb-3">
            <Link to="/privacy" className="text-[0.8125rem] text-ink-2 hover:text-ink transition-colors underline underline-offset-2">
              Privacy policy
            </Link>
            <Link to="/consent-notice" className="text-[0.8125rem] text-ink-2 hover:text-ink transition-colors underline underline-offset-2">
              Consent notice
            </Link>
            <span className="text-[0.8125rem] text-ink-3">How to withdraw</span>
            <span className="text-[0.8125rem] text-ink-3">How to dispute a finding</span>
          </div>
          <p className="text-xs text-ink-3 text-center">
            {en.consentPrivacy.documentsNote}
          </p>
        </div>
      </Container>
    </Section>
  );
}
