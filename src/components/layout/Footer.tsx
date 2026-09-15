import { Link } from 'react-router-dom';
import { Emblem } from '../ui/Emblem';
import { Container } from './Container';
import { company } from '../../config/company';
import { en } from '../../content/en';

export function Footer() {
  const year = new Date().getFullYear();
  const legalName = company.legalName.confirmed ? company.legalName.value : company.legalName.fallback;

  return (
    <footer className="bg-bg-alt border-t border-line">
      <Container className="py-14">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-10 mb-10">
          {/* Brand block */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Emblem size={28} className="text-terracotta" />
              <div className="flex flex-col">
                <span className="font-serif text-[1.05rem] text-ink leading-tight tracking-[-0.01em]">InaiAram</span>
                <span className="font-mono text-[0.5rem] tracking-[0.14em] uppercase text-ink-3 leading-none">
                  Matrimonial Trust
                </span>
              </div>
            </div>
            <p className="text-[0.8125rem] text-ink-2 leading-relaxed max-w-xs mt-3">
              {en.footer.tagline}
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {Object.entries(en.footer.columns).map(([key, col]) => (
              <div key={key}>
                <h3 className="font-mono text-[0.625rem] tracking-[0.12em] uppercase text-ink-3 font-medium mb-3">
                  {col.title}
                </h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      {link === 'Evidence Thread' ? (
                        <a href="#evidence-thread" className="text-[0.8125rem] text-ink-2 hover:text-ink transition-colors duration-150">
                          {link}
                        </a>
                      ) : link === 'Interactive sample case' ? (
                        <Link to="/signup" className="text-[0.8125rem] text-ink-2 hover:text-ink transition-colors duration-150">
                          {link}
                        </Link>
                      ) : (
                        <span className="text-[0.8125rem] text-ink-2">{link}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory statement */}
        <div className="border-t border-line pt-7 mb-7">
          <p className="font-mono text-[0.625rem] leading-[1.6] text-ink-3 max-w-4xl">
            {en.footer.regulatory}
          </p>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <Container className="py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-ink-3">
            © {year} {legalName}
          </span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-ink-3 hover:text-ink transition-colors duration-150">
              {en.footer.bottomLinks[0]}
            </Link>
            <Link to="/terms" className="text-xs text-ink-3 hover:text-ink transition-colors duration-150">
              {en.footer.bottomLinks[1]}
            </Link>
            <Link to="/consent-notice" className="text-xs text-ink-3 hover:text-ink transition-colors duration-150">
              {en.footer.bottomLinks[2]}
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
