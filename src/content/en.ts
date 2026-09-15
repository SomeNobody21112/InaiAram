/**
 * ENGLISH CONTENT STRINGS
 * All display text for the InaiAram application.
 * Structure allows future Tamil/Hindi translation.
 */

export const en = {
  // Navigation
  nav: {
    howItWorks: 'How it works',
    whatWeVerify: 'What we verify',
    whyInaiAram: 'Why InaiAram',
    pricing: 'Pricing',
    faq: 'FAQ',
    resources: 'Resources',
    login: 'Log in',
    startVerification: 'Start Verification',
    // Resources dropdown
    resourcesItems: {
      evidenceThread: 'Evidence Thread',
      eightPillars: 'The eight pillars',
      certaintyLevels: 'Certainty levels',
      coverageAndLimitations: 'Coverage & limitations',
      sampleCase: 'Sample case',
      howWeHandleData: 'How we handle your data',
    },
  },

  // Hero
  hero: {
    eyebrow: 'EVIDENCE-BACKED TRUST BEFORE MARRIAGE',
    h1: 'Know what can be verified before you say',
    h1Accent: 'yes.',
    sub: 'InaiAram helps you verify important claims about a prospective partner using evidence from sources we name — with consent, and with the limits of each check stated plainly.',
    primaryCta: 'Start a Verification',
    secondaryCta: 'See How It Works',
    principles: 'Consent-first · Transparent · Evidence-backed',
  },

  // Core Promise
  corePromise: {
    interstitial: 'And, just as clearly, what cannot.',
    h2: 'Everyone in this category sells certainty.',
    body: 'Indian public records cannot deliver it. Names collide and mutate across transliterations and initials. Many court records carry no date of birth. Digitisation is uneven across districts, court levels and years. Any service that hands you a clean green tick is telling you something it does not know.\n\nSo we built the opposite product. We tell you what we searched, what matched, what didn\'t, and what we couldn\'t reach. Then you decide.',
    columns: {
      whatWeEstablish: {
        title: 'What we establish',
        items: [
          'Identity consistency across documents',
          'Employment and tenure bands',
          'Education credentials with issuing institutions',
          'Court records in searchable jurisdictions',
          'Marriage registration status where records exist',
        ],
      },
      howWeEstablish: {
        title: 'How we establish it',
        items: [
          'From named source types, never unnamed "databases"',
          'With explicit consent from the person being verified',
          'Cross-referenced across independent sources',
          'Reviewed by a named human before reporting',
          'With coverage and gaps stated in the report',
        ],
      },
      whatWeWillNotClaim: {
        title: 'What we will not claim',
        items: [
          '"No criminal record" — we report what was searched, not an absence',
          'A score or rating for any human being',
          'Certainty where Indian records cannot provide it',
          'Access to records that require the person\'s participation',
          'Character judgment, personality assessment, or "suitability"',
        ],
      },
    },
  },

  // The Ask
  theAsk: {
    h2: 'The hardest part isn\'t the check. It\'s the asking.',
    body: 'Nobody wants to be the family that asked. Raising income, health, past marriages or court records directly can feel like an accusation, so the questions get avoided and everyone proceeds on assumption.\n\nInaiAram is built so nobody has to be the one who doubted. Both people verify. Neither side\'s results release until both are complete. The invitation is written to be sendable without insult — and if the other side declines, that is information too, held privately, without a verdict attached.',
  },

  // How It Works
  howItWorks: {
    h2: 'How it works',
    steps: [
      {
        title: 'Agree the scope',
        description: 'You decide which categories matter. Most families care about two or three, not all of them.',
      },
      {
        title: 'Both sides authorise',
        description: 'Each person authorises the checks that concern them. Nothing begins without that.',
      },
      {
        title: 'Records are searched',
        description: 'From the sources that exist for each category, with the coverage recorded as we go.',
      },
      {
        title: 'A person reviews',
        description: 'Every finding is reviewed before it is reported. Any adverse finding is reviewed by a named reviewer.',
      },
      {
        title: 'You read it together',
        description: 'Findings, sources, coverage, gaps and conflicts, in plain language. We do not tell you what to do with it.',
      },
    ],
  },

  // Evidence Thread
  evidenceThread: {
    title: 'THE EVIDENCE THREAD',
    nodes: [
      {
        name: 'Claim',
        description: 'What the person stated',
        failsWhen: 'A claim nobody checks stays a claim, however confidently it was made.',
      },
      {
        name: 'Source',
        description: 'A record system, institution or document',
        failsWhen: 'For some claims no source exists at all. That is a real answer and we report it as one.',
      },
      {
        name: 'Identity Match',
        description: 'Is this record about this person?',
        failsWhen: 'Indian names collide across people and mutate across transliterations, initials and spellings.',
      },
      {
        name: 'Corroboration',
        description: 'A second, independent source',
        failsWhen: 'A single source is stale, wrong, or about someone else.',
      },
      {
        name: 'Human Review',
        description: 'A named reviewer checks the reasoning',
        failsWhen: 'Automation is fast, confident, and occasionally very wrong about a person\'s life.',
      },
      {
        name: 'Coverage',
        description: 'What was searched, and what was not',
        failsWhen: 'A service reports an absence without saying where it looked.',
      },
      {
        name: 'Result',
        description: 'Recorded with source, certainty, coverage and expiry',
        failsWhen: 'Findings age. Ours carry an expiry and say when they were established.',
      },
    ],
    callout: 'Certainty attaches to a claim. Never to a person. InaiAram does not produce a score, a rating, or a verdict about anyone.',
  },

  // Information Asymmetry
  informationAsymmetry: {
    eyebrow: 'THE INFORMATION ASYMMETRY',
    h2: 'A matrimonial profile is a',
    h2Accent: 'claim.',
    body: 'Marriage is among the most consequential financial, emotional, and legal partnerships in human life. Yet, families and individuals are routinely asked to make decisions based on unverified declarations.',
    cards: [
      {
        number: '01',
        label: 'THE PROFILE CLAIM',
        title: 'Unverified Assertions',
        description: 'Traditional matchmaking profiles represent self-declared assertions with zero cryptographic proof:',
        items: ['VP of Product at Tech Corp', 'Masters Degree from IIM', 'Zero active litigation or disputes'],
      },
      {
        number: '02',
        label: 'INAIARAM VERIFICATION ENGINE',
        title: 'Authoritative Triangulation',
        description: 'InaiAram evaluates claims through multi-source digital pipelines and human-guided analysis:',
        items: ['Statutory Identity Registries', 'EPFO Payroll & Directorship Filings', 'eCourts Judicial Disambiguation', 'Cross-Source Inconsistency Matrix'],
      },
      {
        number: '03',
        label: 'EVIDENCE-BACKED VIEW',
        title: 'Decisive Clarity',
        description: 'A transparent trust passport distinguishing established facts from declared claims:',
        items: [
          { text: 'Identity & DOB', badge: 'Verified' },
          { text: 'Degree & College', badge: 'Supported' },
          { text: 'Career & Tenure', badge: 'Verified' },
          { text: 'Legal Dockets', badge: 'Disambiguated' },
        ],
      },
    ],
  },

  // Consent & Privacy
  consentPrivacy: {
    consent: {
      h2: 'Your consent. Your terms.',
      items: [
        'Every check requires your explicit authorisation',
        'You are told what is being verified before it starts',
        'Shares are scoped to a purpose and expire by default',
        'Withdrawal is one action and needs no reason',
        'A family delegate can never gain silent access — you see every grant',
      ],
    },
    privacy: {
      h2: 'Practised privacy.',
      items: [
        'Collect the minimum needed for the agreed scope',
        'Store the finding, not the document, once verification is complete',
        'Never store an identity number — only a salted hash and the verified attributes',
        'Shares are purpose-bound and time-boxed',
        'Every access generates a receipt you can see',
        'Default deletion after the case concludes, confirmed to you',
        'We never receive medical results',
      ],
    },
    documentsNote: 'These documents are drafts under review. We will publish the final versions before we take our first case.',
  },

  // Limitations
  limitations: {
    h2: 'Where verification stops',
    items: [
      { statement: 'No database contains everything about a person.', consequence: 'Absence of a result is not proof of absence.' },
      { statement: 'Name-based searching is imperfect in both directions.', consequence: 'It can match the wrong person and miss the right one, which is why identity matching is reviewed rather than assumed.' },
      { statement: 'Some records exist only if the person requests them.', consequence: 'Without their participation, those checks cannot be done at all.' },
      { statement: 'Some things are simply not in any record.', consequence: 'Character, intention, how someone treats people, and how they will behave in a marriage. We do not assess any of them.' },
      { statement: 'Findings age.', consequence: 'Everything we report carries the date it was established and an expiry.' },
      { statement: 'We do not tell you whether to proceed.', consequence: 'We have no view on your decision and we will not pretend to.' },
    ],
    closing: 'We would rather lose a customer to honesty than keep one on a claim we cannot support.',
  },

  // Why InaiAram
  whyInaiAram: {
    h2: 'Why InaiAram?',
    pillars: [
      { title: 'Evidence-First', description: 'We show what can be verified with proof and explain what cannot be.' },
      { title: 'Consent-First', description: 'Everything is done with explicit consent and controlled by you.' },
      { title: 'Transparent', description: 'We clearly communicate sources, coverage and limitations.' },
      { title: 'Mutual Trust', description: 'Encourages both partners to verify and share confidently.' },
    ],
    comparison: {
      usualApproach: 'The usual approach',
      inaiaram: 'InaiAram',
      rows: [
        ['A green tick', 'A finding with its source, coverage and date'],
        ['"No record found"', '"No matching record within the coverage searched", with the coverage stated'],
        ['A score or a rating for a person', 'Confidence on each claim; never a rating for a human being'],
        ['A PDF that is out of date the day it arrives', 'Findings that carry an expiry and can be refreshed'],
        ['One side proves themselves', 'Both sides verify; neither releases until both are done'],
        ['The family sees everything or nothing', 'A family view that shows verification status without private values'],
        ['Medical results handled by the platform', 'Medical results never reach us'],
        ['Limitations left unsaid', 'Limitations printed in the report'],
      ],
    },
  },

  // Mutual Trust
  mutualTrust: {
    eyebrow: 'SYMMETRIC RESPECT & EQUALITY',
    h2: 'Trust works both ways.',
    h2Accent: 'Two people. Two verified perspectives. One informed decision.',
    body: 'Verification shouldn\'t feel like a one-sided investigation. Both people should have the opportunity to know and be known with equal dignity and privacy.',
    subtitle: 'Two independent verifications. One shared commitment.',
    labels: { secure: 'Secure', private: 'Private', neutral: 'Neutral' },
  },

  // Packages
  packages: {
    h2: 'Start with what matters to you.',
    subtitle: 'Most families want two or three answers, not eleven. Tell us what those are and we will tell you honestly whether they can be established.',
    items: [
      {
        name: 'Foundation',
        description: 'Essential identity and foundational verification for early discussions.',
        turnaround: '24–48 Hours',
        included: [
          'Government-issued identity verification',
          'Date of birth and address consistency',
          'Education credential check',
          'Employment and tenure confirmation',
          'Address history for jurisdiction coverage',
        ],
        notIncluded: [
          'Income band verification',
          'Court and legal record search',
          'Marriage registration search',
          'Cross-border verification',
          'Health screening',
        ],
        mutual: 'Single person',
        price: null,
      },
      {
        name: 'Considered',
        description: 'Comprehensive verification. The standard for serious discussions.',
        turnaround: '48–96 Hours',
        included: [
          'Everything in Foundation',
          'Income band verification from provided documents',
          'Marriage registration search',
          'Court and legal records with coverage statement',
          'Business and directorship check',
          'Digital footprint corroboration',
        ],
        notIncluded: [
          'Cross-border verification',
          'Health screening',
        ],
        mutual: 'Mutual by default — both people, both reports',
        price: null,
      },
      {
        name: 'Cross-border',
        description: 'For a person residing outside India. Includes subject-initiated foreign document workflow.',
        turnaround: '5–10 Business Days',
        included: [
          'Everything in Considered',
          'Subject-initiated foreign document verification',
          'Authenticity attestation of overseas records',
        ],
        notIncluded: [
          'Health screening',
        ],
        mutual: 'Mutual — both parties participate',
        price: null,
        status: 'planned',
      },
    ],
    cta: 'Discuss this package',
  },

  // FAQ
  faq: {
    h2: 'Frequently asked questions',
    items: [
      { q: 'What is matrimonial verification?', a: 'Establishing which factual claims about a prospective match can be confirmed from records, with that person\'s authorisation, and stating clearly which cannot.' },
      { q: 'Does the other person have to consent?', a: 'Yes. Every check that concerns a person requires their authorisation. There is no route through InaiAram to check someone without their knowledge, and we will not build one.' },
      { q: 'What if they refuse?', a: 'That is their right, and we do not attach a verdict to it. You will know what could not be established, and you can decide what that means to you.' },
      { q: 'What does "no matching record found" mean?', a: 'That within the specific coverage we searched, nothing matched. It is not a clean record and we will never present it as one. The report states exactly what was searched.' },
      { q: 'Do you check everything online?', a: 'No. Much of what matters is not online, some records exist only if the person requests them, and some are not searchable at all. The report says which.' },
      { q: 'Do you give a score?', a: 'No. Confidence describes how well a single claim is supported by evidence. We do not rate people and we do not tell you whether to proceed.' },
      { q: 'How does health verification work?', a: 'We arrange the appointment and the consent. An accredited laboratory conducts the tests, a doctor explains them to the individual privately, and the individual receives their own results. We never receive them.' },
      { q: 'Do you check credit scores?', a: 'No. Access to credit information in India is restricted to specified users, and a matrimonial verification service is not one. Anyone offering it to you should be asked how.' },
      { q: 'Can I verify myself?', a: 'Yes, and it is the most common way to start. You verify yourself and invite the other side to do the same.' },
      { q: 'Who can see my information?', a: 'Only the people you share with, at the granularity you choose, for a period that expires. A family delegate sees verification status without the underlying values. Every access is receipted and visible to you.' },
      { q: 'Can I withdraw?', a: 'Yes, in one action, without giving a reason. Access ends when you end it.' },
      { q: 'What if two sources disagree?', a: 'We show you both and say they conflict. We do not quietly pick one, and we do not resolve it on your behalf.' },
      { q: 'What\'s in the report?', a: 'Each finding with its source type, how identity was matched, confidence, the coverage searched, the date established and its expiry — plus everything we could not establish, and why.' },
      { q: 'How long does it take?', a: 'Timelines depend on the categories chosen and on how quickly institutions respond. We confirm expected timelines when the scope is agreed.' },
      { q: 'What happens to my data afterwards?', a: 'We keep findings rather than documents, delete on the schedule set at the start of the case, and confirm the deletion to you.' },
    ],
  },

  // Final CTA
  finalCta: {
    h2: 'Start with what matters to you.',
    body: 'Most families want two or three answers, not eleven. Tell us what those are and we will tell you honestly whether they can be established.',
    primaryCta: 'Start Verification',
    secondaryCta: 'Open the sample case',
  },

  // Footer
  footer: {
    tagline: 'Authoritative digital source verification, identity matching, and consent-driven trust intelligence in India. Enabling informed decisions before life-changing commitments.',
    columns: {
      verificationEngine: {
        title: 'VERIFICATION ENGINE',
        links: [
          'Evidence Thread',
          'The eight pillars',
          'Coverage & limitations',
          'Evidence provenance',
          'Interactive sample case',
        ],
      },
      trustAndEthics: {
        title: 'TRUST & ETHICS',
        links: [
          'Certainty levels',
          'Mutual verification',
          'Health & lab protocol',
          'Operational boundaries',
          'How we handle your data',
        ],
      },
      company: {
        title: 'COMPANY',
        links: [
          'Chennai, Tamil Nadu',
          'Contact details coming soon',
        ],
      },
    },
    regulatory: 'InaiAram operates strictly as an objective evidence verification and identity matching technology platform. It is not a detective agency, does not offer covert surveillance services, does not judge moral character, and does not guarantee the absence of non-indexed police records. All verification is conducted with the explicit consent of the person being verified, using publicly or institutionally available records. InaiAram does not fabricate, assume, or imply data that cannot be established through verified sources. We do not report an absence of records as a clean record; every search states the coverage it was able to reach.',
    bottomLinks: ['Privacy Policy', 'Terms of Verification', 'How we handle your data'],
  },

  // Demo
  demo: {
    sampleLabel: 'SAMPLE CASE',
    caseId: 'IA-DEMO-0001',
    illustrationLabel: 'ILLUSTRATIVE — NOT A REAL PERSON',
    subjectName: 'A. Meera Krishnan',
    roles: { subject: 'Subject', partner: 'Partner', family: 'Family' },
    tabs: ['Overview', 'Evidence', 'Analysis', 'Report', 'Sharing', 'Activity'],
    openFullDemo: 'Open full demo',
    familyCaption: 'The same case shows different things to different people. A family sees that a check was done — not what it found.',
    overallAssessment: 'Evidence-backed view — not a judgment of character.',
    notShared: 'Not shared in this view',
    valueNotShown: 'Value not shown in this view',
    exportDisabled: 'The prototype does not generate downloadable files',
  },

  // Scope Builder
  scope: {
    step1Title: 'Who is this verification for?',
    step1Options: ['Myself', 'Myself and my match', 'On behalf of my family'],
    step2Title: 'Which questions matter to you?',
    step3Title: 'What this scope can and cannot establish',
    emailPlaceholder: 'Your email (for prototype demo only)',
    prototypeNotice: 'Prototype — nothing on this page is submitted, stored or transmitted. No verification is started.',
  },

  // Ask Kit
  ask: {
    h2: 'The invitation',
    templates: {
      english: 'I\'ve started my own verification on InaiAram. If you do the same, both families can begin with the same set of verified facts. Not suspicion — just a clear starting point.',
      tamil: 'நான் இணையறம் மூலம் என் விவரங்களைச் சரிபார்க்கத் தொடங்கியுள்ளேன். நீங்களும் அவ்வாறே செய்தால், இரு தரப்பும் ஒரே தகவலோடு தொடங்கலாம். இது சந்தேகம் அல்ல — இது வெளிப்படைத்தன்மை.',
      hindi: 'मैंने InaiAram पर अपना सत्यापन शुरू कर दिया है। अगर आप भी करें, तो दोनों परिवार एक ही जानकारी के साथ आगे बढ़ सकते हैं। यह शक नहीं — यह पारदर्शिता है।',
    },
    sampleLabel: 'Sample wording — pending native-speaker review',
    neitherSideFirst: 'Neither side sees anything first.',
    completeBoth: 'Both verifications must be complete before either side\'s findings are released.',
  },

  // Health
  health: {
    status: 'Planned module — not offered at launch.',
    h2: 'Health, handled at arm\'s length.',
    body: 'Couples plan the wedding for a year and their family health for no days at all. If you want a shared health baseline, we can arrange it — but we have designed ourselves out of the middle of it.',
    steps: [
      { actor: 'InaiAram', action: 'Arranges the appointment, handles consent and logistics.', holds: 'Scheduling information only.' },
      { actor: 'An accredited laboratory', action: 'Conducts the tests.', holds: 'The samples and the results.' },
      { actor: 'A doctor', action: 'Interprets the results and counsels the individual privately.', holds: 'The clinical picture.' },
      { actor: 'The individual', action: 'Receives their own results. Only them.', holds: 'They may later choose to discuss or attest something to their partner.' },
    ],
    callout: 'What InaiAram receives: that a panel was completed, on a date, at an accredited facility. Nothing else. Not a value, not a flag, not a summary. We are not able to see your results, because we never receive them.',
    scope: 'Where health screening is arranged, it is framed as preparation for a shared future — not as a test anyone passes or fails. We do not arrange infectious-disease screening as part of any shareable package. We do not produce a health score, a compatibility rating, or an opinion about anyone\'s suitability for marriage. We do not perform tests ourselves; a licensed facility does.',
  },

  // Dispute
  dispute: {
    h3: 'If we get something wrong.',
    body: 'Records contain errors, and name-based searching can attach the wrong person\'s history to yours. If a finding about you is wrong, you can dispute it. We will show you the reasoning and the source behind it, re-examine it, and correct the record with everyone it was shared with. A correction is not a favour; it is part of the service.',
  },

  // Login stub
  login: {
    title: 'Accounts are not yet available',
    body: 'InaiAram is currently in its early stages. Account creation and login will be available before we take our first case. If you\'d like to be notified, please reach out to us.',
  },

  // Certainty states
  states: {
    verified: {
      label: 'Verified',
      description: 'Established from an identifiable source with a strong identity match',
      doesNotMean: 'This does not mean the claim is universally true — it means the evidence supports it within the coverage searched.',
    },
    supported: {
      label: 'Supported',
      description: 'Corroborated, but by a source that cannot independently confirm it',
      doesNotMean: 'This does not mean the claim has been independently verified — the supporting source may be limited in scope.',
    },
    requiresConsent: {
      label: 'Requires consent',
      description: 'Cannot be checked without the person\'s authorisation and participation',
      doesNotMean: 'This does not mean the claim is true or false — the check simply has not been performed.',
    },
    candidateControlled: {
      label: 'Candidate-controlled',
      description: 'The person holds this. It reaches you only if they choose to share it',
      doesNotMean: 'This does not mean the information is being withheld suspiciously — some records can only be obtained by the individual.',
    },
    noMatchFound: {
      label: 'No matching record found',
      description: 'Within the coverage searched, nothing matched',
      doesNotMean: 'This is not a clean record. The coverage may be incomplete.',
    },
    conflicting: {
      label: 'Conflicting',
      description: 'Two sources disagree. Both are shown. Neither is resolved for you',
      doesNotMean: 'This does not mean one source is wrong — it means the discrepancy needs your attention.',
    },
    requiresClarification: {
      label: 'Requires clarification',
      description: 'A further step is needed before this can be reported',
      doesNotMean: 'This does not mean the claim has failed — it means the verification process needs more information.',
    },
    unavailable: {
      label: 'Unavailable',
      description: 'The source could not be reached, or does not exist for this person',
      doesNotMean: 'This does not mean the information does not exist — the source may simply be inaccessible.',
    },
    underReview: {
      label: 'Under review',
      description: 'A named reviewer is checking this before it is reported',
      doesNotMean: 'This does not mean the finding is in question — it is a standard quality check.',
    },
  },

  // Prototype notices
  prototype: {
    interactionNotice: 'Prototype — nothing is submitted, stored or transmitted.',
  },
} as const;
