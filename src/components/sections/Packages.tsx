import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { Diamond } from '../ui/Diamond';
import { company } from '../../config/company';
import { packages } from '../../data/packages';

export function Packages() {
  return (
    <Section id="pricing" ariaLabelledBy="pkg-title" alt>
      <Container>
        <div className="text-center mb-14">
          <Diamond className="mb-5" />
          <h2 id="pkg-title" className="display-m mb-4">
            Start with what matters to you.
          </h2>
          <p className="body-l max-w-xl mx-auto">
            Most families want two or three answers, not eleven. Tell us what those are and we will tell you honestly whether they can be established.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className="bg-surface rounded-xl border border-line p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-serif text-ink">{pkg.name}</h3>
                <span className="text-xs font-mono text-ink-3 px-2 py-1 bg-bg-alt rounded-md">
                  {pkg.turnaround}
                </span>
              </div>
              <p className="text-[0.8125rem] text-ink-2 mb-5">{pkg.description}</p>

              {/* Price */}
              <div className="mb-5">
                {company.showPrices && pkg.price ? (
                  <div>
                    <span className="text-2xl font-serif text-ink">₹{pkg.price.toLocaleString()}</span>
                    <span className="text-[0.8125rem] text-ink-3 ml-1">/ verification</span>
                  </div>
                ) : (
                  <span className="text-[0.8125rem] text-ink-3 font-medium">Pricing shared on enquiry</span>
                )}
              </div>

              {pkg.status === 'planned' && (
                <span className="text-xs font-mono text-gold bg-gold/10 border border-gold/20 px-2.5 py-1 rounded-full inline-block mb-4 self-start">
                  Planned
                </span>
              )}

              {/* What's included */}
              <div className="mb-5">
                <span className="label-mono block mb-2.5">INCLUDED COVERAGE:</span>
                <ul className="space-y-2">
                  {pkg.included.map((item, i) => (
                    <li key={i} className="flex gap-2 text-[0.8125rem] text-ink-2">
                      <span className="text-sage mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What's not included */}
              <div className="mb-5">
                <span className="label-mono block mb-2.5 text-taupe">NOT INCLUDED:</span>
                <ul className="space-y-2">
                  {pkg.notIncluded.map((item, i) => (
                    <li key={i} className="flex gap-2 text-[0.8125rem] text-ink-3 line-through">
                      <span className="mt-0.5 shrink-0">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-2">
                <p className="text-xs text-ink-3 mb-3">{pkg.mutual}</p>
                <Button variant="primary" fullWidth>
                  Discuss this package
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
