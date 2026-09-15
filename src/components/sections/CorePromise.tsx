import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { SectionRule } from '../ui/SectionRule';
import { Diamond } from '../ui/Diamond';
import { en } from '../../content/en';

export function CorePromise() {
  return (
    <>
      <Section id="core-promise" ariaLabelledBy="core-promise-title">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <p className="display-m text-ink mb-3">
              {en.corePromise.interstitial}
            </p>
            <Diamond className="mb-12" />
            <h2 id="core-promise-title" className="display-l mb-5">
              {en.corePromise.h2}
            </h2>
            <p className="body-l max-w-2xl mx-auto mb-14 whitespace-pre-line">
              {en.corePromise.body}
            </p>
          </div>

          {/* Three columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-4xl mx-auto">
            {Object.values(en.corePromise.columns).map((col) => (
              <div key={col.title} className="border-t border-line-strong pt-5">
                <h3 className="label-mono mb-4">{col.title}</h3>
                <ul className="space-y-2.5">
                  {col.items.map((item, i) => (
                    <li key={i} className="text-[0.8125rem] text-ink-2 leading-relaxed flex gap-2">
                      <span className="text-terracotta mt-0.5 shrink-0" aria-hidden="true">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <div className="bg-bg"><SectionRule label="◆ THE INFORMATION ASYMMETRY ◆" className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12" /></div>
    </>
  );
}
