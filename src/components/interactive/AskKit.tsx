import { useState } from 'react';
import { en } from '../../content/en';
import type { InvitationLang } from '../../store/types';

/**
 * ASK KIT — the landing-page invitation preview.
 * Pure presentation: shows how a mutual invitation reads, in three languages.
 * Nothing is submitted from this surface.
 */
export function AskKit() {
  const [lang, setLang] = useState<InvitationLang>('english');

  const langLabel: Record<InvitationLang, string> = {
    english: 'English',
    hindi: 'हिन्दी',
    tamil: 'தமிழ்',
  };

  return (
    <div className="max-w-2xl mx-auto rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
      <p className="label-mono text-ink-3 mb-5">{en.ask.h2}</p>

      <div className="flex flex-wrap gap-2 mb-6" role="radiogroup" aria-label="Invitation language">
        {(['english', 'hindi', 'tamil'] as const).map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={lang === l}
            onClick={() => setLang(l)}
            className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
              lang === l ? 'border-terracotta/50 bg-terracotta/5 text-ink font-medium' : 'border-line bg-surface text-ink-2 hover:border-line-strong'
            }`}
          >
            {langLabel[l]}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-6 rounded-xl bg-bg-alt border border-line">
        <p className="font-serif text-lg sm:text-xl text-ink leading-relaxed italic">
          &ldquo;{en.ask.templates[lang]}&rdquo;
        </p>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-ink-3">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="text-gold">◆</span>
          {en.ask.neitherSideFirst}
        </span>
        <span aria-hidden="true" className="hidden sm:inline text-line-strong">·</span>
        <span>{en.ask.completeBoth}</span>
      </div>

      <p className="mt-4 text-[0.6875rem] text-ink-3 italic">{en.ask.sampleLabel}</p>
    </div>
  );
}