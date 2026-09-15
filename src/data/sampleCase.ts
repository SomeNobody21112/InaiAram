/**
 * SAMPLE CASE DATA
 * Illustrative fictional data for the Trust Profile demo.
 * All data is fictional, internally consistent, and clearly labelled.
 *
 * Subject: A. Meera Krishnan
 * All dates fixed — the demo never drifts.
 */

export type ClaimState =
  | 'verified'
  | 'supported'
  | 'noMatchFound'
  | 'conflicting'
  | 'requiresClarification'
  | 'unavailable'
  | 'candidateControlled'
  | 'underReview'
  | 'requiresConsent';

export interface ClaimRecord {
  id: string;
  pillarName: string;
  value: string;
  sourceType: string;
  identityMatch: string;
  certainty: ClaimState;
  coverage: string;
  establishedAt: string;
  expiresAt: string;
  consentState: string;
  doesNotMean: string;
  evidence: EvidenceItem[];
  pathsThroughThread: string[];
}

export interface EvidenceItem {
  id: string;
  sourceType: string;
  retrievedAt: string;
  artifactHash: string;
  identityMatchReasoning: string;
}

export interface CoverageJurisdiction {
  name: string;
  status: 'searched' | 'partial' | 'not-searched';
  reason: string;
}

export interface ConsentReceipt {
  id: string;
  timestamp: string;
  action: string;
  accessor: string;
  purpose: string;
  scope: string;
  expiresAt: string;
  previousHash: string | null;
  hash: string;
}

export interface SampleCase {
  caseId: string;
  subject: {
    name: string;
    initials: string;
    age: number;
    location: string;
    originalFrom: string;
  };
  claims: ClaimRecord[];
  coverage: CoverageJurisdiction[];
  receipts: ConsentReceipt[];
  summary: {
    sourcesReviewed: number;
    requiresClarification: number;
    supported: number;
    unavailable: number;
  };
}

export const sampleCase: SampleCase = {
  caseId: 'IA-DEMO-0001',
  subject: {
    name: 'A. Meera Krishnan',
    initials: 'MK',
    age: 28,
    location: 'Chennai, Tamil Nadu',
    originalFrom: 'Chennai, TN',
  },

  claims: [
    {
      id: 'identity-dob',
      pillarName: 'Identity',
      value: 'A. Meera Krishnan, DOB 14 March 1998, Indian Citizen',
      sourceType: 'Government identity registry',
      identityMatch: 'Strong: name, date of birth and father\'s name agree across two documents; no competing record within the searched set.',
      certainty: 'verified',
      coverage: 'National identity database and passport registry',
      establishedAt: '2026-06-08',
      expiresAt: '2027-06-08',
      consentState: 'Consented — 8 June 2026',
      doesNotMean: 'This confirms the identity document is genuine and the details are consistent. It does not confirm anything else about this person.',
      evidence: [
        {
          id: 'ev-id-1',
          sourceType: 'Government identity registry',
          retrievedAt: '2026-06-08T10:15:00+05:30',
          artifactHash: 'sha256:7f3a…b2e1',
          identityMatchReasoning: 'Strong: name, DOB and father\'s name agree across Aadhaar and passport records. No competing identity within the searched set.',
        },
        {
          id: 'ev-id-2',
          sourceType: 'Passport verification gateway',
          retrievedAt: '2026-06-08T10:18:00+05:30',
          artifactHash: 'sha256:a4c8…d9f3',
          identityMatchReasoning: 'Cross-referenced against identity registry. Name permutation consistent. DOB matches exactly.',
        },
      ],
      pathsThroughThread: ['claim', 'source', 'identityMatch', 'corroboration', 'humanReview', 'coverage', 'result'],
    },
    {
      id: 'education-degree',
      pillarName: 'Education',
      value: 'B.Tech Computer Science, Anna University, 2020',
      sourceType: 'Institutional confirmation',
      identityMatch: 'Strong: registration number matches person and institution records.',
      certainty: 'verified',
      coverage: 'Anna University digital records and National Academic Depository',
      establishedAt: '2026-06-10',
      expiresAt: '2027-06-10',
      consentState: 'Consented — 8 June 2026',
      doesNotMean: 'This confirms the institution records the degree as awarded. It does not confirm grades, attendance, or the quality of education.',
      evidence: [
        {
          id: 'ev-ed-1',
          sourceType: 'National Academic Depository',
          retrievedAt: '2026-06-10T14:30:00+05:30',
          artifactHash: 'sha256:c2d5…e8a7',
          identityMatchReasoning: 'Strong: registration number, name and institution all match. Degree confirmed as awarded in 2020.',
        },
      ],
      pathsThroughThread: ['claim', 'source', 'identityMatch', 'corroboration', 'humanReview', 'coverage', 'result'],
    },
    {
      id: 'employment-current',
      pillarName: 'Employment',
      value: 'Senior Software Engineer at TechVista Solutions, Chennai — since January 2022',
      sourceType: 'EPFO payroll records',
      identityMatch: 'Moderate: name and UAN match; employer code consistent with declared company.',
      certainty: 'supported',
      coverage: 'EPFO payroll records and employer HR confirmation',
      establishedAt: '2026-06-12',
      expiresAt: '2026-12-12',
      consentState: 'Consented — 8 June 2026',
      doesNotMean: 'This confirms employment contributions exist. It does not confirm current role, salary, or job title.',
      evidence: [
        {
          id: 'ev-emp-1',
          sourceType: 'EPFO payroll records',
          retrievedAt: '2026-06-12T09:45:00+05:30',
          artifactHash: 'sha256:e9b2…1c4d',
          identityMatchReasoning: 'Moderate: UAN matches declared identity. Employer code maps to TechVista Solutions Pvt. Ltd. Monthly contributions since January 2022.',
        },
        {
          id: 'ev-emp-2',
          sourceType: 'Employer HR confirmation',
          retrievedAt: '2026-06-12T16:20:00+05:30',
          artifactHash: 'sha256:f1a3…7e5b',
          identityMatchReasoning: 'Employer confirmed the person\'s employment, stating role as Senior Software Engineer. Tenure band: 2–4 years.',
        },
      ],
      pathsThroughThread: ['claim', 'source', 'identityMatch', 'humanReview', 'coverage', 'result'],
    },
    {
      id: 'employment-dates',
      pillarName: 'Employment',
      value: 'Previous employment: DataBridge Analytics, June 2020 – December 2021',
      sourceType: 'EPFO payroll records',
      identityMatch: 'Moderate: UAN match, employer code verified.',
      certainty: 'conflicting',
      coverage: 'EPFO payroll records',
      establishedAt: '2026-06-12',
      expiresAt: '2026-12-12',
      consentState: 'Consented — 8 June 2026',
      doesNotMean: 'This does not mean either source is wrong. It means the discrepancy needs your attention. A reviewer examines this before it appears in any report.',
      evidence: [
        {
          id: 'ev-empd-1',
          sourceType: 'EPFO payroll records',
          retrievedAt: '2026-06-12T09:45:00+05:30',
          artifactHash: 'sha256:b3c7…2d8e',
          identityMatchReasoning: 'EPFO records show contributions from DataBridge Analytics from April 2020 to November 2021 — differing from the declared dates by approximately two months.',
        },
        {
          id: 'ev-empd-2',
          sourceType: 'Declared employment history',
          retrievedAt: '2026-06-08T11:00:00+05:30',
          artifactHash: 'sha256:d5f9…a1c3',
          identityMatchReasoning: 'Subject declared employment from June 2020 to December 2021. The discrepancy between declared and EPFO-recorded dates may reflect joining date vs. first contribution date.',
        },
      ],
      pathsThroughThread: ['claim', 'source', 'identityMatch', 'humanReview', 'coverage', 'result'],
    },
    {
      id: 'legal-records',
      pillarName: 'Court & legal records',
      value: 'No matching record found within the coverage searched',
      sourceType: 'Court record databases',
      identityMatch: 'Name-based search across declared jurisdictions.',
      certainty: 'noMatchFound',
      coverage: 'Chennai Metropolitan Court, Madras High Court, Chengalpattu District Court — searched 3 of 4 relevant jurisdictions. One district court holds incomplete digital records for 2019–2022.',
      establishedAt: '2026-06-14',
      expiresAt: '2026-12-14',
      consentState: 'Consented — 8 June 2026',
      doesNotMean: 'This is not a clean record. It means that within the specific jurisdictions searched, no matching record was found. The coverage may be incomplete.',
      evidence: [
        {
          id: 'ev-legal-1',
          sourceType: 'Chennai Metropolitan Court database',
          retrievedAt: '2026-06-14T11:30:00+05:30',
          artifactHash: 'sha256:8e2a…f4c6',
          identityMatchReasoning: 'Name search conducted. No matching record found. Note: this court\'s digital records begin from 2015.',
        },
        {
          id: 'ev-legal-2',
          sourceType: 'Madras High Court database',
          retrievedAt: '2026-06-14T11:35:00+05:30',
          artifactHash: 'sha256:1d9f…b7a2',
          identityMatchReasoning: 'Name search conducted. No matching record found.',
        },
      ],
      pathsThroughThread: ['claim', 'source', 'identityMatch', 'humanReview', 'coverage'],
    },
    {
      id: 'marital-status',
      pillarName: 'Marital status',
      value: 'No marriage registration found in searched jurisdictions',
      sourceType: 'Marriage registration databases',
      identityMatch: 'Name-based search in Tamil Nadu and declared jurisdictions.',
      certainty: 'verified',
      coverage: 'Tamil Nadu marriage registration — digital records searched. No national federated marriage database exists.',
      establishedAt: '2026-06-10',
      expiresAt: '2027-06-10',
      consentState: 'Consented — 8 June 2026',
      doesNotMean: 'This confirms no registration was found in the searched databases. It does not confirm the person has never been married — registrations elsewhere, particularly abroad, would not appear.',
      evidence: [
        {
          id: 'ev-mar-1',
          sourceType: 'Tamil Nadu marriage registration database',
          retrievedAt: '2026-06-10T15:10:00+05:30',
          artifactHash: 'sha256:4a6c…d3e8',
          identityMatchReasoning: 'Name-based search across Tamil Nadu digital marriage records. No matching registration found. Note: national federated search is not available.',
        },
      ],
      pathsThroughThread: ['claim', 'source', 'identityMatch', 'corroboration', 'humanReview', 'coverage', 'result'],
    },
    {
      id: 'business-directorship',
      pillarName: 'Business & directorship',
      value: 'No company directorships or partnership roles found',
      sourceType: 'Corporate filings database',
      identityMatch: 'Name-based search across corporate registries.',
      certainty: 'noMatchFound',
      coverage: 'Ministry of Corporate Affairs digital filings searched',
      establishedAt: '2026-06-12',
      expiresAt: '2026-12-12',
      consentState: 'Consented — 8 June 2026',
      doesNotMean: 'This is not a clean record. It means no directorships or partnerships were found in the searched registries. Informal business interests would not appear.',
      evidence: [
        {
          id: 'ev-biz-1',
          sourceType: 'Ministry of Corporate Affairs filings',
          retrievedAt: '2026-06-12T14:00:00+05:30',
          artifactHash: 'sha256:9f3d…c5a1',
          identityMatchReasoning: 'Name search across MCA21 database. No matching director identification number found.',
        },
      ],
      pathsThroughThread: ['claim', 'source', 'identityMatch', 'humanReview', 'coverage'],
    },
    {
      id: 'digital-footprint',
      pillarName: 'Digital footprint',
      value: 'Professional profiles consistent with declared employment and education',
      sourceType: 'Public professional profiles',
      identityMatch: 'Name and employment details cross-referenced.',
      certainty: 'supported',
      coverage: 'LinkedIn and professional profiles self-published by the subject',
      establishedAt: '2026-06-11',
      expiresAt: '2026-12-11',
      consentState: 'Consented — 8 June 2026',
      doesNotMean: 'This confirms publicly available professional information is consistent with declared claims. It does not assess personality, opinions, or private life.',
      evidence: [
        {
          id: 'ev-dig-1',
          sourceType: 'LinkedIn professional profile',
          retrievedAt: '2026-06-11T13:20:00+05:30',
          artifactHash: 'sha256:2e7b…f9d4',
          identityMatchReasoning: 'Profile declares employment at TechVista Solutions and education at Anna University — consistent with other evidence.',
        },
      ],
      pathsThroughThread: ['claim', 'source', 'identityMatch', 'corroboration', 'humanReview', 'coverage', 'result'],
    },
  ],

  coverage: [
    { name: 'Chennai Metropolitan Court', status: 'searched', reason: 'Digital records available from 2015' },
    { name: 'Madras High Court', status: 'searched', reason: 'Full digital records available' },
    { name: 'Chengalpattu District Court', status: 'searched', reason: 'Partial digital records — limited coverage for 2019–2022' },
    { name: 'Kancheepuram District Court', status: 'not-searched', reason: 'No declared address history in this jurisdiction' },
    { name: 'Tamil Nadu Marriage Registration', status: 'searched', reason: 'Digital records available' },
    { name: 'Ministry of Corporate Affairs', status: 'searched', reason: 'National digital filings database' },
    { name: 'EPFO National Database', status: 'searched', reason: 'Contribution records available' },
    { name: 'National Academic Depository', status: 'partial', reason: 'Some institutions not yet enrolled in NAD' },
  ],

  receipts: [
    {
      id: 'r-001',
      timestamp: '2026-06-08T09:00:00+05:30',
      action: 'Consent granted',
      accessor: 'A. Meera Krishnan (Subject)',
      purpose: 'Matrimonial verification',
      scope: 'Full verification scope',
      expiresAt: '2026-12-08',
      previousHash: null,
      hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    },
    {
      id: 'r-002',
      timestamp: '2026-06-08T09:05:00+05:30',
      action: 'Scope confirmed',
      accessor: 'InaiAram system',
      purpose: 'Matrimonial verification',
      scope: 'Identity, Education, Employment, Legal, Marital, Business, Digital',
      expiresAt: '2026-12-08',
      previousHash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
      hash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    },
    {
      id: 'r-003',
      timestamp: '2026-06-10T14:32:00+05:30',
      action: 'Identity claim accessed',
      accessor: 'Partner (verified account)',
      purpose: 'Matrimonial evaluation',
      scope: 'Identity status and verification level only',
      expiresAt: '2026-06-24',
      previousHash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
      hash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    },
    {
      id: 'r-004',
      timestamp: '2026-06-12T16:25:00+05:30',
      action: 'Employment claim accessed',
      accessor: 'Partner (verified account)',
      purpose: 'Matrimonial evaluation',
      scope: 'Employment status and tenure band only',
      expiresAt: '2026-06-26',
      previousHash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
      hash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    },
    {
      id: 'r-005',
      timestamp: '2026-06-14T11:40:00+05:30',
      action: 'Legal records claim accessed',
      accessor: 'Family delegate (status view)',
      purpose: 'Family verification overview',
      scope: 'Status only — no values shown',
      expiresAt: '2026-06-28',
      previousHash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
      hash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    },
  ],

  summary: {
    sourcesReviewed: 17,
    requiresClarification: 1,
    supported: 3,
    unavailable: 0,
  },
};
