import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { Callout } from '../ui/Callout';
import { en } from '../../content/en';
import { useState } from 'react';
import { SelectedClaimContext } from '../../hooks/useSelectedClaim';
import { sampleCase } from '../../data/sampleCase';

export function EvidenceThreadSection() {
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const selectedClaim = sampleCase.claims.find((c) => c.id === selectedClaimId) ?? null;

  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  return (
    <SelectedClaimContext.Provider value={{ selectedClaimId, setSelectedClaimId, selectedClaim }}>
      <Section id="evidence-thread" ariaLabelledBy="et-title">
        <Container>
          <h2 id="et-title" className="display-m text-center mb-4">
            {en.evidenceThread.title}
          </h2>

          <p className="text-center body max-w-2xl mx-auto mb-12">
            Every claim follows a strict verification thread through authoritative sources before it is accepted as factual.
          </p>

          {/* Visual chain — horizontal on desktop, vertical on mobile */}
          <div className="max-w-4xl mx-auto mb-10">
            {/* Desktop: horizontal chain (lg+ only — 7 nodes need space) */}
            <div className="hidden lg:flex items-stretch gap-0">
              {en.evidenceThread.nodes.map((node, i) => {
                const isLast = i === en.evidenceThread.nodes.length - 1;
                return (
                  <div key={node.name} className="flex items-center flex-1">
                    <button
                      onClick={() => setExpandedNode(expandedNode === node.name ? null : node.name)}
                      aria-expanded={expandedNode === node.name}
                      className={`flex-1 text-left p-4 rounded-lg border transition-all duration-200 ${
                        expandedNode === node.name
                          ? isLast
                            ? 'border-terracotta/40 bg-terracotta/5 shadow-sm'
                            : 'border-gold/40 bg-gold/5 shadow-sm'
                          : 'border-line bg-surface hover:border-line-strong hover:bg-surface-raised'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.625rem] font-mono font-medium ${
                          isLast ? 'bg-terracotta/10 text-terracotta' : 'bg-bg-alt text-ink-3'
                        }`}>
                          {i + 1}
                        </span>
                        <span className="label-mono text-[0.625rem]">{node.name}</span>
                      </div>
                      <p className="text-[0.8125rem] text-ink-2 leading-relaxed">{node.description}</p>
                      {expandedNode === node.name && (
                        <p className="text-[0.75rem] text-terracotta-deep mt-2 italic">
                          Fails when: {node.failsWhen}
                        </p>
                      )}
                    </button>
                    {i < en.evidenceThread.nodes.length - 1 && (
                      <div className="w-4 h-px bg-line-strong shrink-0 mx-0.5" aria-hidden="true" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile + tablet: vertical chain */}
            <div className="lg:hidden space-y-3">
              {en.evidenceThread.nodes.map((node, i) => {
                const isLast = i === en.evidenceThread.nodes.length - 1;
                return (
                  <button
                    key={node.name}
                    onClick={() => setExpandedNode(expandedNode === node.name ? null : node.name)}
                    aria-expanded={expandedNode === node.name}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      expandedNode === node.name
                        ? 'border-terracotta/40 bg-terracotta/5 shadow-sm'
                        : 'border-line bg-surface hover:border-line-strong'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.625rem] font-mono font-medium ${
                        isLast ? 'bg-terracotta/10 text-terracotta' : 'bg-bg-alt text-ink-3'
                      }`}>
                        {i + 1}
                      </span>
                      <span className="label-mono text-[0.625rem]">{node.name}</span>
                    </div>
                    <p className="text-[0.8125rem] text-ink-2 leading-relaxed ml-10">{node.description}</p>
                    {expandedNode === node.name && (
                      <p className="text-[0.75rem] text-terracotta-deep mt-2 italic ml-10">
                        Fails when: {node.failsWhen}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Callout */}
          <Callout variant="gold" className="max-w-3xl mx-auto text-center">
            <p className="text-[0.8125rem] text-ink leading-relaxed font-medium">
              {en.evidenceThread.callout}
            </p>
          </Callout>
        </Container>
      </Section>
    </SelectedClaimContext.Provider>
  );
}
