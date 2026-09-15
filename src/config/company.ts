/**
 * COMPANY CONFIGURATION — single source of truth for unconfirmed business facts.
 *
 * Every value here is UNCONFIRMED until the founder sets `confirmed: true`.
 * Components must render the fallback when confirmed === false.
 * Never hardcode any of these values into JSX.
 */
export const company = {
  legalName: { value: null, confirmed: false, fallback: 'InaiAram' },
  etymology: {
    value: 'Tamil: inai — to join · aram — virtue',
    confirmed: false,
    fallback: null,
  },
  city: { value: 'Chennai, Tamil Nadu', confirmed: true },
  contactEmail: {
    value: null,
    confirmed: false,
    fallback: 'Contact details coming soon',
  },
  grievanceOfficer: { value: null, confirmed: false, fallback: null },
  turnaroundDays: {
    value: null,
    confirmed: false,
    fallback: 'Timelines confirmed at case start',
  },
  showPrices: false,
  healthModuleStatus: 'planned' as 'planned' | 'live',
  crossBorderStatus: 'planned' as 'planned' | 'live',
  namedRecordSystems: [] as string[],
  statistics: [] as Array<{
    claim: string;
    source: string;
    url: string;
    date: string;
  }>,
} as const;
