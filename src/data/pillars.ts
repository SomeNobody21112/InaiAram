/**
 * VERIFICATION PILLARS
 * Illustrative sample content for the eight verification categories.
 */

export interface Pillar {
  id: string;
  name: string;
  icon: string;
  shortDescription: string;
  whatItIs: string;
  whatMaySupportIt: string;
  consentRequired: boolean;
  whatResultMeans: string;
  knownLimitation: string;
}

export const pillars: Pillar[] = [
  {
    id: 'identity',
    name: 'Identity',
    icon: 'shield',
    shortDescription: 'Name, date of birth, and identity-document consistency',
    whatItIs: 'Verification of the person\'s primary identity — name, date of birth, and the consistency of identity documents they provide.',
    whatMaySupportIt: 'Government-issued identity documents provided by the person, verified offline. The platform stores a salted hash and the verified attributes, never the identity number itself.',
    consentRequired: true,
    whatResultMeans: 'The document is genuine and matches the person. Identity documents confirm the document is authentic and the details are consistent.',
    knownLimitation: 'Identity documents confirm the document is genuine and matches the person; they do not confirm anything else the person has told you.',
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'graduation',
    shortDescription: 'Degree, institution, year',
    whatItIs: 'Confirmation of claimed educational qualifications — degree, institution, and year of completion.',
    whatMaySupportIt: 'Confirmed with the issuing institution or through a digital credential source the person authorises.',
    consentRequired: true,
    whatResultMeans: 'The institution confirms the qualification was awarded to this person.',
    knownLimitation: 'Older records and some institutions require manual confirmation and may take longer, or may not be confirmable at all.',
  },
  {
    id: 'employment',
    name: 'Employment',
    icon: 'briefcase',
    shortDescription: 'Current employer, role and tenure band',
    whatItIs: 'Verification of current employer, role, and duration of employment.',
    whatMaySupportIt: 'Employer response and corroborating contribution records.',
    consentRequired: true,
    whatResultMeans: 'The employer confirms the person\'s employment status within the stated parameters.',
    knownLimitation: 'Very recent joins may not yet appear in contribution records; small and unregistered employers may have no verifiable trace.',
  },
  {
    id: 'income',
    name: 'Income band',
    icon: 'chart',
    shortDescription: 'A verified range, not an exact figure',
    whatItIs: 'Verification of an income range based on documents the person chooses to provide.',
    whatMaySupportIt: 'Documents provided voluntarily by the person, such as salary slips or tax documents.',
    consentRequired: true,
    whatResultMeans: 'The documents support the claimed income range. We report a band and say what it was based on.',
    knownLimitation: 'Income from sources outside salaried employment is frequently not verifiable at all. We do not access credit scores or credit reports.',
  },
  {
    id: 'maritalStatus',
    name: 'Marital status',
    icon: 'ring',
    shortDescription: 'Marriage registration search',
    whatItIs: 'Search of marriage-registration records for declared jurisdictions.',
    whatMaySupportIt: 'Marriage registration databases in declared jurisdictions.',
    consentRequired: true,
    whatResultMeans: 'Whether a marriage registration was found in the searched jurisdictions matching the declared status.',
    knownLimitation: 'Marriage registration in India is maintained at state level and is not federated. A national search does not exist. A marriage registered elsewhere — particularly abroad — will not appear.',
  },
  {
    id: 'legalRecords',
    name: 'Court & legal records',
    icon: 'gavel',
    shortDescription: 'Search of available court record systems',
    whatItIs: 'Search of available court record systems for jurisdictions relevant to the declared address history.',
    whatMaySupportIt: 'Available court record databases for relevant jurisdictions, searched by name.',
    consentRequired: true,
    whatResultMeans: 'Records found or not found within the specific jurisdictions searched.',
    knownLimitation: 'This is the check most often oversold. Records are unevenly digitised, frequently omit date of birth, and are searched by name — which produces both false matches and missed matches. We report the jurisdictions searched and the gaps. We never report an absence as a clean record.',
  },
  {
    id: 'business',
    name: 'Business & directorship',
    icon: 'building',
    shortDescription: 'Company directorships and partnership roles',
    whatItIs: 'Identification of company directorships and partnership roles from public corporate filings.',
    whatMaySupportIt: 'Public corporate filings and ministry records.',
    consentRequired: true,
    whatResultMeans: 'Whether the person holds registered roles in any companies or partnerships.',
    knownLimitation: 'Identifies registered roles only; informal business interests do not appear.',
  },
  {
    id: 'digitalFootprint',
    name: 'Digital footprint',
    icon: 'globe',
    shortDescription: 'Professional profiles and public statements',
    whatItIs: 'Review of professional profiles and public statements the person has themselves published.',
    whatMaySupportIt: 'Only publicly available content the person has published themselves.',
    consentRequired: true,
    whatResultMeans: 'Corroboration of claims already made — not an independent discovery process.',
    knownLimitation: 'We do not trawl private social media, we do not build a personality profile, and we do not report on someone\'s opinions, associations or relationships.',
  },
];
