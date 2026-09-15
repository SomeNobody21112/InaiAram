/**
 * PROTOTYPE STATE MODEL — InaiAram web-app prototype.
 * All data is fictional demo data. Nothing here connects to a live system.
 */
import type { ClaimRecord } from '../data/sampleCase';

// ---------- Canonical 9 result states ----------
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

// ---------- Canonical 8 pillars ----------
export type PillarId =
  | 'identity'
  | 'education'
  | 'employment'
  | 'income'
  | 'marital'
  | 'legal'
  | 'business'
  | 'digital';

export interface PillarMeta {
  id: PillarId;
  name: string;
  shortDescription: string;
  whatWillBeChecked: string;
  sourceTypes: string;
  whoMaySee: string;
  knownLimitation: string;
}

export const PILLARS: PillarMeta[] = [
  {
    id: 'identity',
    name: 'Identity',
    shortDescription: 'Name, date of birth, and identity-document consistency',
    whatWillBeChecked: 'That the name, date of birth and identity documents the person provides are consistent with each other.',
    sourceTypes: 'Government-issued identity documents provided by the person, verified offline. Only verified attributes and a salted hash are retained — never the number itself.',
    whoMaySee: 'Verification status by default. Underlying values only with a specific grant.',
    knownLimitation: 'Confirms the document and its consistency. It does not confirm everything else the person has said.',
  },
  {
    id: 'education',
    name: 'Education',
    shortDescription: 'Degree, institution, year',
    whatWillBeChecked: 'That the claimed qualification — degree, institution and year — is recorded as awarded.',
    sourceTypes: 'The issuing institution, or an authorised digital credential the person authorises.',
    whoMaySee: 'Verification status by default. Institution and year with a specific grant.',
    knownLimitation: 'Older records and some institutions require manual confirmation and may take longer, or may not be confirmable at all.',
  },
  {
    id: 'employment',
    name: 'Employment',
    shortDescription: 'Current employer, role and tenure band',
    whatWillBeChecked: 'That the current employer, role and duration of employment match what was declared.',
    sourceTypes: 'Employer response and corroborating contribution records, where available.',
    whoMaySee: 'Verification status by default. Employer and tenure band with a specific grant.',
    knownLimitation: 'Recent joins may not appear in contribution records; small and unregistered employers may have no verifiable trace.',
  },
  {
    id: 'income',
    name: 'Income band',
    shortDescription: 'A verified range, not an exact figure',
    whatWillBeChecked: 'That the documents the person chooses to provide support the claimed income range.',
    sourceTypes: 'Documents provided voluntarily by the person, such as salary slips or tax documents.',
    whoMaySee: 'The band only — never an exact figure. No credit scores or credit reports, ever.',
    knownLimitation: 'Income outside salaried employment is frequently not verifiable at all.',
  },
  {
    id: 'marital',
    name: 'Marital status',
    shortDescription: 'Marriage-registration search in declared jurisdictions',
    whatWillBeChecked: 'Marriage-registration records in the jurisdictions the person declares, for consistency with the declared status.',
    sourceTypes: 'Marriage-registration databases in declared jurisdictions. Registration is state-level and not federated — no national search exists.',
    whoMaySee: 'Whether a registration was or was not found in the searched jurisdictions.',
    knownLimitation: 'A marriage registered elsewhere — particularly abroad — will not appear.',
  },
  {
    id: 'legal',
    name: 'Court & legal records',
    shortDescription: 'Search of available court record systems',
    whatWillBeChecked: 'Available court record systems for the jurisdictions in the declared address history, searched by name.',
    sourceTypes: 'Available court record databases for relevant jurisdictions.',
    whoMaySee: 'The coverage searched, and whether anything matched within it.',
    knownLimitation: 'Uneven digitisation, incomplete records, name collisions and missing dates of birth produce both false matches and missed matches.',
  },
  {
    id: 'business',
    name: 'Business & directorship',
    shortDescription: 'Company directorships and partnership roles',
    whatWillBeChecked: 'Public corporate filings for registered directorships and partnership roles.',
    sourceTypes: 'Public corporate filings and ministry records.',
    whoMaySee: 'Whether registered roles were found.',
    knownLimitation: 'Identifies registered roles only; informal business interests do not appear.',
  },
  {
    id: 'digital',
    name: 'Digital footprint',
    shortDescription: 'Professional profiles and public statements',
    whatWillBeChecked: 'Only publicly available professional content the person has themselves published, to corroborate claims already made.',
    sourceTypes: 'Public professional profiles self-published by the person.',
    whoMaySee: 'Whether public professional information is consistent with declared claims.',
    knownLimitation: 'No private social media, no personality profile, no reporting on opinions, associations or relationships.',
  },
];

export const PILLAR_BY_ID: Record<PillarId, PillarMeta> = Object.fromEntries(
  PILLARS.map((p) => [p.id, p])
) as Record<PillarId, PillarMeta>;

// ---------- Consent ----------
export type ConsentState = 'pending' | 'granted' | 'declined' | 'withdrawn';
/** Derived presentation — an expired grant is still stored as 'granted'. */
export type ConsentDisplayState = ConsentState | 'expired';

export interface ConsentRecord {
  pillar: PillarId;
  state: ConsentState;
  grantedAt: string | null;
  withdrawnAt: string | null;
  /** Set when granted. Expiry never silently reactivates — re-granting creates a fresh grant. */
  expiresAt: string | null;
}

// ---------- Shares ----------
export type Granularity = 'status-only' | 'status-and-values';

export interface Share {
  id: string;
  pillar: PillarId;
  accessor: 'partner' | 'family';
  purpose: string;
  granularity: Granularity;
  createdAt: string;
  expiresAt: string;
  revokedAt: string | null;
}

export function shareStatus(share: Share, now: string): 'active' | 'expired' | 'revoked' {
  if (share.revokedAt) return 'revoked';
  if (new Date(share.expiresAt).getTime() < new Date(now).getTime()) return 'expired';
  return 'active';
}

// ---------- Ledger receipts ----------
export type LedgerAction =
  | 'consent-granted'
  | 'consent-declined'
  | 'consent-withdrawn'
  | 'scope-created'
  | 'scope-confirmed'
  | 'share-created'
  | 'share-accessed'
  | 'share-revoked'
  | 'invitation-sent'
  | 'invitation-accepted'
  | 'invitation-declined'
  | 'mutual-release'
  | 'finding-established'
  | 'dispute-submitted'
  | 'expiry-simulated';

export interface Receipt {
  id: string;
  timestamp: string;
  action: LedgerAction;
  actor: string;
  detail: string;
  purpose: string;
  scope: string;
  expiresAt: string | null;
  previousHash: string | null;
  hash: string;
}

// ---------- Invitations ----------
export type InvitationStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
export type InvitationLang = 'english' | 'hindi' | 'tamil';

export interface Invitation {
  id: string;
  toName: string;
  lang: InvitationLang;
  status: InvitationStatus;
  sentAt: string | null;
  respondedAt: string | null;
  /** Set when sent; an unanswered invitation expires on its own — never interpreted as refusal. */
  expiresAt: string | null;
}

// ---------- Disputes ----------
export type DisputeStatus = 'submitted' | 'under-review' | 'resolved';

export interface Dispute {
  id: string;
  claimId: string;
  reason: string;
  context: string;
  submittedAt: string;
  status: DisputeStatus;
}

// ---------- Simulation ----------
export type SimPhase = 0 | 1 | 2 | 3 | 4 | 5;

// ---------- Verification case ----------
export type CaseStatus =
  | 'draft'
  | 'awaiting-consent'
  | 'awaiting-participant'
  | 'in-progress'
  | 'complete';

export type CaseMode = 'single' | 'mutual';

export interface VerificationCase {
  id: string;
  subjectName: string;
  mode: CaseMode;
  status: CaseStatus;
  scope: PillarId[];
  createdAt: string;
  updatedAt: string;
  consents: Record<PillarId, ConsentRecord>;
  claims: Partial<Record<PillarId, ClaimRecord[]>>;
  shares: Share[];
  receipts: Receipt[];
  invitation: Invitation | null;
  disputes: Dispute[];
  /** Simulation clock: advances when the user requests progress */
  simPhase: SimPhase;
  /** True once both sides have completed participation (mutual mode) */
  mutualReleased: boolean;
}

// ---------- App-level session ----------
export type OnboardingPath = 'verify-someone' | 'invited' | 'verify-self';

export interface AppUser {
  name: string;
  email: string;
  onboarded: boolean;
  path: OnboardingPath | null;
  /** Phone is collected at signup (optional) and displayed on the account screen. */
  phone?: string;
  /** Invited-person journey: pending until the user accepts or declines. */
  invitedStatus?: 'pending' | 'accepted' | 'declined' | null;
  /** Session marker — logout keeps the profile (and workspace) on the device. */
  session?: boolean;
}

export interface AppState {
  user: AppUser | null;
  caseData: VerificationCase | null;
  demoViewRole: 'subject' | 'partner' | 'family';
}
