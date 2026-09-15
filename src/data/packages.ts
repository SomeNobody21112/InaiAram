/**
 * PACKAGES
 * Illustrative sample data. Prices are UNCONFIRMED.
 * showPrices: false renders "Pricing shared on enquiry" everywhere.
 */

export interface PackageItem {
  name: string;
  description: string;
  turnaround: string;
  included: string[];
  notIncluded: string[];
  mutual: string;
  price: number | null;
  status?: 'planned';
}

export const packages: PackageItem[] = [
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
];
