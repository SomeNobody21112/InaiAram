/**
 * NEW VERIFICATION — the Scope Builder promoted to a real 5-step flow.
 * Who → categories → can/cannot → confirm → created.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { Dialog, PageHeader } from '../../ui/primitives';
import { useApp, useCase, PROTO_NOW } from '../../../store/app';
import { PILLARS, PILLAR_BY_ID, type PillarId } from '../../../store/types';

export function NewVerificationScreen() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const existing = useCase();
  const [step, setStep] = useState(1);
  const [who, setWho] = useState<'myself' | 'other' | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [mode, setMode] = useState<'single' | 'mutual'>('single');
  const [selected, setSelected] = useState<Set<PillarId>>(new Set());
  const [replaceOpen, setReplaceOpen] = useState(false);

  const toggle = (id: PillarId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const canProceedStep2 = who === 'myself' || (who === 'other' && subjectName.trim().length >= 2);
  const expires = new Date(new Date(PROTO_NOW).getTime() + 14 * 86400000).toISOString().slice(0, 10);

  const create = () => {
    if (!who) return;
    dispatch({
      type: 'CREATE_CASE',
      mode: who === 'myself' ? 'mutual' : mode,
      scope: Array.from(selected),
      subjectName: who === 'myself' ? 'You' : subjectName.trim(),
    });
    navigate(who === 'myself' ? '/app/consent' : '/app/verifications/IA-DEMO-0001');
  };

  const requestCreate = () => {
    // Never silently overwrite an existing case — confirm explicitly.
    if (existing) setReplaceOpen(true);
    else create();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <PageHeader eyebrow="NEW VERIFICATION" title="What would you like to verify?" description="Five short steps. You will see exactly what can and cannot be established before anything begins." />

      {existing && (
        <div className="p-3.5 rounded-lg border border-gold/25 bg-gold/5 text-xs text-ink-2 leading-relaxed">
          <span className="label-mono text-gold block mb-1">YOU ALREADY HAVE AN OPEN CASE — {existing.id}</span>
          Creating a new scope replaces the current demonstration case (its findings, shares and receipts are cleared). If you only want to continue, use the existing case instead.
        </div>
      )}

      {/* Step indicator */}
      <ol className="flex items-center gap-2" aria-label="Progress">
        {['Who', 'Categories', 'Establishable', 'Confirm', 'Create'].map((label, i) => {
          const n = i + 1;
          const state = step === n ? 'current' : step > n ? 'done' : 'todo';
          return (
            <li key={label} className="flex items-center gap-2 flex-1 last:flex-none">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.625rem] font-mono border ${state === 'current' ? 'bg-terracotta text-white border-terracotta' : state === 'done' ? 'bg-sage/10 text-sage border-sage/30' : 'bg-surface text-ink-3 border-line'}`} aria-current={state === 'current' ? 'step' : undefined}>
                {state === 'done' ? '✓' : n}
              </span>
              <span className={`hidden sm:inline text-xs ${state === 'current' ? 'text-ink font-medium' : 'text-ink-3'}`}>{label}</span>
              {i < 4 && <span className="flex-1 h-px bg-line" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>

      {/* Step 1 — Who */}
      {step === 1 && (
        <section aria-labelledby="nv-s1" className="space-y-3">
          <h2 id="nv-s1" className="h3 text-ink">Who is this verification for?</h2>
          {([
            { id: 'myself' as const, title: 'Myself', body: 'Start your own verification. You can invite the other side afterwards — the most common way to begin.' },
            { id: 'other' as const, title: 'Someone else', body: 'A verification that concerns a prospective match. They will be invited to participate and must consent before anything is checked.' },
          ]).map((opt) => (
            <button key={opt.id} onClick={() => setWho(opt.id)} aria-pressed={who === opt.id}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${who === opt.id ? 'border-terracotta/50 bg-terracotta/5' : 'border-line bg-surface hover:border-line-strong'}`}>
              <p className="text-sm font-medium text-ink">{opt.title}</p>
              <p className="text-xs text-ink-3 mt-1 leading-relaxed">{opt.body}</p>
            </button>
          ))}
          {who === 'other' && (
            <div>
              <label htmlFor="nv-name" className="label-mono block mb-1.5">THEIR NAME (AS DECLARED)</label>
              <input id="nv-name" type="text" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="e.g. Arun Krishnan" className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-surface text-sm text-ink placeholder:text-ink-3 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none" />
              <p className="text-xs text-ink-3 mt-1.5">Illustrative only — this prototype uses fictional demonstration data regardless of the name entered.</p>
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button disabled={!canProceedStep2} onClick={() => setStep(2)}>Continue</Button>
          </div>
        </section>
      )}

      {/* Step 2 — Categories */}
      {step === 2 && (
        <section aria-labelledby="nv-s2" className="space-y-3">
          <h2 id="nv-s2" className="h3 text-ink">Which categories matter to you?</h2>
          <p className="text-sm text-ink-3">Most families want two or three — not all of them.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PILLARS.map((p) => (
              <button key={p.id} onClick={() => toggle(p.id)} aria-pressed={selected.has(p.id)}
                className={`p-3.5 rounded-xl border text-left transition-colors ${selected.has(p.id) ? 'border-terracotta/50 bg-terracotta/5' : 'border-line bg-surface hover:border-line-strong'}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-ink">{p.name}</span>
                  <span className={`w-5 h-5 rounded border flex items-center justify-center text-xs shrink-0 ${selected.has(p.id) ? 'bg-terracotta text-white border-terracotta' : 'border-line-strong text-transparent'}`} aria-hidden="true">✓</span>
                </div>
                <p className="text-xs text-ink-3 mt-1 leading-relaxed">{p.shortDescription}</p>
              </button>
            ))}
          </div>
          <div className="p-3.5 rounded-lg border border-line bg-surface-raised text-xs text-ink-2 leading-relaxed">
            <span className="label-mono text-gold block mb-1">HEALTH — PLANNED MODULE</span>
            Health screening is not offered. Where arranged in future, it stays at arm's length: InaiAram holds scheduling information only and never receives results.
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button disabled={selected.size === 0} onClick={() => setStep(3)}>Continue ({selected.size} selected)</Button>
          </div>
        </section>
      )}

      {/* Step 3 — Can / cannot */}
      {step === 3 && (
        <section aria-labelledby="nv-s3" className="space-y-4">
          <h2 id="nv-s3" className="h3 text-ink">What this scope can and cannot establish</h2>
          <div className="p-4 rounded-xl border border-sage/20 bg-sage/5">
            <span className="label-mono text-sage block mb-2">WHAT WILL BE CHECKED — WITH CONSENT</span>
            <ul className="space-y-1.5 text-sm text-ink-2">
              {Array.from(selected).map((id) => (
                <li key={id} className="flex gap-2"><span className="text-sage shrink-0" aria-hidden="true">✓</span>{PILLAR_BY_ID[id].name} — {PILLAR_BY_ID[id].shortDescription}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl border border-gold/20 bg-gold/5">
            <span className="label-mono text-gold block mb-2">NEEDS THE PERSON'S PARTICIPATION</span>
            <p className="text-sm text-ink-2 leading-relaxed">Every category requires the consent and participation of the person being verified. Nothing can be checked without their authorisation. If they decline, nothing is released and no verdict is attached.</p>
          </div>
          <div className="p-4 rounded-xl border border-taupe/20 bg-taupe/5">
            <span className="label-mono text-taupe block mb-2">OUT OF REACH REGARDLESS</span>
            <ul className="space-y-1.5 text-sm text-ink-3">
              <li>— Credit scores and credit reports (restricted; not offered)</li>
              <li>— Medical results (never received, in any module)</li>
              <li>— Private social media or personality profiling</li>
              <li>— Character judgment or "suitability" assessment</li>
              <li>— Records in jurisdictions outside the declared address history</li>
            </ul>
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={() => setStep(4)}>Continue</Button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section aria-labelledby="nv-s4" className="space-y-4">
          <h2 id="nv-s4" className="h3 text-ink">Confirm the scope</h2>
          <div className="rounded-xl border border-line bg-surface divide-y divide-line">
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div><span className="label-mono text-ink-3 block mb-0.5">Verification of</span><span className="text-ink">{who === 'myself' ? 'Yourself' : subjectName}</span></div>
              <div><span className="label-mono text-ink-3 block mb-0.5">Categories</span><span className="text-ink">{selected.size}</span></div>
              <div><span className="label-mono text-ink-3 block mb-0.5">Mode</span><span className="text-ink">{who === 'myself' ? 'Mutual — invite the other side' : mode === 'mutual' ? 'Mutual' : 'Single person'}</span></div>
            </div>
            <div className="p-4">
              <span className="label-mono text-ink-3 block mb-1.5">Before anything begins</span>
              <ul className="space-y-1.5 text-xs text-ink-2 leading-relaxed">
                <li>— The person concerned must grant consent, category by category, before any search.</li>
                <li>— Every finding states its source, identity match, coverage, and expiry.</li>
                <li>— Findings are reviewed by a named reviewer before reporting.</li>
                <li>— Default share expiry would be {expires} (14 days). You can revoke at any time.</li>
                <li>— This prototype performs no live checks and transmits nothing.</li>
              </ul>
            </div>
          </div>
          {who === 'other' && (
            <div className="flex items-center gap-3">
              <input id="nv-mutual" type="checkbox" checked={mode === 'mutual'} onChange={(e) => setMode(e.target.checked ? 'mutual' : 'single')} className="w-4 h-4 accent-[var(--terracotta)]" />
              <label htmlFor="nv-mutual" className="text-sm text-ink-2">Invite them to verify themselves too (mutual — neither side's results release until both complete)</label>
            </div>
          )}
          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
            <Button onClick={() => setStep(5)}>Review and create</Button>
          </div>
        </section>
      )}

      {step === 5 && (
        <section aria-labelledby="nv-s5" className="text-center py-8">
          <span className="font-serif text-3xl text-sage" aria-hidden="true">✓</span>
          <h2 id="nv-s5" className="display-m text-ink mt-4 mb-2">Ready to create</h2>
          <p className="body text-ink-2 max-w-md mx-auto mb-8">
            {who === 'myself'
              ? 'Creating the case requests your consent next, category by category. Nothing is checked until you authorise it.'
              : 'Creating the case opens it. Next: invite the other person — their consent will be requested before any check.'}
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => { setStep(1); setWho(null); setSubjectName(''); setSelected(new Set()); }}>Start over</Button>
            <Button onClick={requestCreate}>Create verification</Button>
          </div>
        </section>
      )}

      <Dialog open={replaceOpen} onClose={() => setReplaceOpen(false)} title="Replace the existing case?">
        <p className="text-sm text-ink-2 leading-relaxed mb-4">
          You already have {existing?.id} open. Creating this scope replaces it in the prototype workspace — its findings, shares and receipts are cleared. Nothing here is ever silently overwritten.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setReplaceOpen(false)}>Cancel</Button>
          <Button onClick={() => { setReplaceOpen(false); create(); }}>Replace and create</Button>
        </div>
      </Dialog>
    </div>
  );
}
