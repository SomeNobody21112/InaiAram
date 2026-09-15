/**
 * ONBOARDING — three screens that compress the InaiAram philosophy.
 * Does / does-not-claim / choose path. Progressive disclosure; nothing overwhelming.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { useApp } from '../../../store/app';
import type { OnboardingPath } from '../../../store/types';

const SLIDES = [
  {
    eyebrow: 'WHAT INAIARAM DOES',
    title: 'Verification with the limits stated',
    body: 'InaiAram checks specific claims about a prospective partner — from named source types, with that person\'s consent, and with the coverage of every search recorded. You see what was established, what was not, and why.',
  },
  {
    eyebrow: 'WHAT INAIARAM DOES NOT CLAIM',
    title: 'No scores. No verdicts. No clean records.',
    body: 'We never produce a score or rating for a person. "No matching record found" is not a clean record — it means nothing matched within the coverage searched. And we do not tell you whether to proceed. Certainty attaches to a claim, never to a person.',
  },
] as const;

export function OnboardingScreen() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [path, setPath] = useState<OnboardingPath | null>(null);

  const finish = () => {
    if (!path) return;
    dispatch({ type: 'COMPLETE_ONBOARDING', path });
    navigate('/app');
  };

  return (
    <main className="min-h-screen bg-bg flex flex-col" id="main-content">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-10" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-terracotta' : 'bg-line'}`} />
            ))}
          </div>

          {step === 0 && (
            <section aria-labelledby="ob-t0">
              <p className="label-mono text-terracotta mb-3">{SLIDES[0].eyebrow}</p>
              <h1 id="ob-t0" className="display-l text-ink mb-4">{SLIDES[0].title}</h1>
              <p className="body-l text-ink-2 leading-relaxed mb-8">{SLIDES[0].body}</p>
              <div className="flex justify-end">
                <Button onClick={() => setStep(1)}>Next</Button>
              </div>
            </section>
          )}

          {step === 1 && (
            <section aria-labelledby="ob-t1">
              <p className="label-mono text-terracotta mb-3">{SLIDES[1].eyebrow}</p>
              <h1 id="ob-t1" className="display-l text-ink mb-4">{SLIDES[1].title}</h1>
              <p className="body-l text-ink-2 leading-relaxed mb-8">{SLIDES[1].body}</p>
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)}>Next</Button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="ob-t2">
              <p className="label-mono text-terracotta mb-3">CHOOSE YOUR PATH</p>
              <h1 id="ob-t2" className="display-l text-ink mb-2">How would you like to begin?</h1>
              <p className="body text-ink-2 mb-8">You can change direction later — nothing is locked in.</p>

              <div className="space-y-3" role="radiogroup" aria-label="Onboarding path">
                {([
                  { id: 'verify-self', title: 'I want to verify myself first', body: 'The most common way to start. Complete your own verification, then invite the other side.' },
                  { id: 'verify-someone', title: 'I want to verify someone', body: 'Start a verification that concerns a prospective match. They will be invited to participate and consent.' },
                  { id: 'invited', title: 'I was invited to participate', body: 'Someone started a mutual verification and invited you. You will consent to what concerns you.' },
                ] as const).map((opt) => (
                  <button
                    key={opt.id}
                    role="radio"
                    aria-checked={path === opt.id}
                    onClick={() => setPath(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      path === opt.id ? 'border-terracotta/50 bg-terracotta/5' : 'border-line bg-surface hover:border-line-strong'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-ink">{opt.title}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${path === opt.id ? 'border-terracotta' : 'border-line-strong'}`} aria-hidden="true">
                        {path === opt.id && <span className="w-2 h-2 rounded-full bg-terracotta" />}
                      </span>
                    </div>
                    <p className="text-xs text-ink-3 mt-1 leading-relaxed">{opt.body}</p>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-8">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={finish} disabled={!path}>Enter workspace</Button>
              </div>
            </section>
          )}
        </div>
      </div>
      <footer className="px-4 pb-6 text-center">
        <p className="text-[0.625rem] font-mono text-ink-3">Welcome, {state.user?.name ?? 'friend'} · Prototype workspace</p>
      </footer>
    </main>
  );
}
