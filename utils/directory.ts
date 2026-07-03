/**
 * Client-side helpers for the Connect / Support directory screens.
 *
 * The organization, clinic and hospital records are served by Supabase RPCs
 * whose exact columns vary, so these helpers infer a Malaysian state and a
 * service category from whatever text fields are present (state, area,
 * address, services, category, type, description...).
 */

export const MALAYSIA_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Perak',
  'Perlis',
  'Pulau Pinang',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
  'Kuala Lumpur',
  'Labuan',
  'Putrajaya',
];

// Common alternate spellings that should map to a canonical state name
const STATE_ALIASES: Record<string, string> = {
  penang: 'Pulau Pinang',
  malacca: 'Melaka',
  'negri sembilan': 'Negeri Sembilan',
  'n. sembilan': 'Negeri Sembilan',
  kl: 'Kuala Lumpur',
  'w.p. kuala lumpur': 'Kuala Lumpur',
  'wilayah persekutuan kuala lumpur': 'Kuala Lumpur',
  seremban: 'Negeri Sembilan',
};

/** Infer a Malaysian state from a record by scanning its text fields. */
export function inferState(record: Record<string, any>): string | null {
  const explicit = record.state || record.negeri;
  if (typeof explicit === 'string' && explicit.trim()) {
    const matched = matchState(explicit);
    if (matched) return matched;
  }

  const haystack = [record.area, record.place, record.address, record.location, record.name]
    .filter((v) => typeof v === 'string')
    .join(' ');

  return matchState(haystack);
}

function matchState(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [alias, canonical] of Object.entries(STATE_ALIASES)) {
    if (lower.includes(alias)) return canonical;
  }
  for (const state of MALAYSIA_STATES) {
    if (lower.includes(state.toLowerCase())) return state;
  }
  return null;
}

export type ServiceCategory =
  | 'financial'
  | 'peer'
  | 'shelter'
  | 'medical'
  | 'counselling'
  | 'other';

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, { en: string; bm: string }> = {
  financial: { en: 'Financial support', bm: 'Bantuan kewangan' },
  peer: { en: 'Peer support', bm: 'Sokongan rakan sebaya' },
  shelter: { en: 'Shelter homes', bm: 'Rumah perlindungan' },
  medical: { en: 'Medical & treatment', bm: 'Perubatan & rawatan' },
  counselling: { en: 'Counselling', bm: 'Kaunseling' },
  other: { en: 'Other services', bm: 'Perkhidmatan lain' },
};

const SERVICE_KEYWORDS: Record<Exclude<ServiceCategory, 'other'>, string[]> = {
  financial: ['financial', 'funding', 'fund', 'zakat', 'bantuan kewangan', 'welfare', 'aid'],
  peer: ['peer', 'support group', 'community', 'rakan sebaya', 'sokongan'],
  shelter: ['shelter', 'home', 'rumah', 'hostel', 'accommodation', 'refuge'],
  medical: ['clinic', 'klinik', 'medical', 'treatment', 'rawatan', 'health', 'hospital', 'testing', 'ujian'],
  counselling: ['counsel', 'kaunsel', 'mental', 'emotional', 'therapy'],
};

/** Infer service categories for a record. Returns ['other'] if nothing matches. */
export function inferServiceCategories(record: Record<string, any>): ServiceCategory[] {
  const explicit = record.services || record.service || record.category || record.type;
  const haystack = [explicit, record.description, record.name]
    .filter((v) => typeof v === 'string')
    .join(' ')
    .toLowerCase();

  const matched: ServiceCategory[] = [];
  (Object.keys(SERVICE_KEYWORDS) as Exclude<ServiceCategory, 'other'>[]).forEach((category) => {
    if (SERVICE_KEYWORDS[category].some((keyword) => haystack.includes(keyword))) {
      matched.push(category);
    }
  });

  return matched.length > 0 ? matched : ['other'];
}
