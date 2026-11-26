import { DentalChartSide, ToothFinding } from '@/components/dental/dentalTypes';
import { DENTAL_CHART_SIDES, createEmptyFinding } from '@/components/dental/dentalData';

export type { ToothStatus, ToothSeverity, ToothFinding } from '@/components/dental/dentalTypes';

export interface PathologyFinding {
  id: string;
  label: string;
  checked: boolean;
  location?: string;
  note?: string;
}

export interface SoftTissueFinding {
  id: string;
  label: string;
  checked: boolean;
  note?: string;
}

export interface TreatmentPerformed {
  id: string;
  label: string;
  checked: boolean;
  note?: string;
}

export interface SedationEntry {
  id: string;
  drug: string;
  dose: string;
}

export type NerveBlockSide = 'Left' | 'Right' | 'Bilateral' | '';

export interface NerveBlockEntry {
  id: string;
  block: string;
  /** Which side was anaesthetised — a block record without laterality
   * tells the next clinician nothing. */
  side: NerveBlockSide;
  drug: string;
  /** Volume of local anaesthetic injected, in mL. */
  volume: string;
}

/** One clinical photograph attached to the report. `dataUrl` is a
 * browser-compressed JPEG (see components/wizard/photo-upload.tsx) so a
 * dozen phone photos still fit comfortably in the localStorage draft. */
export interface ReportPhoto {
  id: string;
  dataUrl: string;
  caption: string;
  /** Optional Triadan number this photo documents. */
  toothNumber: string;
}

export const MAX_REPORT_PHOTOS = 12;

export type LateralExcursion = 'Smooth' | 'Step' | 'Mouth opens to slide' | '';
export type RostrocaudalExcursion = 'Normal' | 'Reduced' | 'Painful' | '';
export type TableAngle = 'Flat' | 'Normal' | 'Steep' | '';
export type TmjPainLevel = 'None' | 'Mild' | 'Moderate' | 'Severe' | '';
/** Replaces the old free-text "Percent of occlusion": how much of the
 * cheek-tooth arcade is in occlusal contact. */
export type OcclusalContact = 'Full' | 'Partial' | 'Minimal' | '';

export interface ExcursionAssessment {
  excursion: LateralExcursion;
  postDentalExcursion: LateralExcursion;
  occlusalContact: OcclusalContact;
  postDentalOcclusalContact: OcclusalContact;
}

export interface TableAngleAssessment {
  before: TableAngle;
  after: TableAngle;
}

/** The farside/nearside oral examination measurements from the clinic's
 * printed exam form — lateral excursion, occlusion percentage, table
 * angles, and TMJ pain scale, each tracked before/after the dental work. */
export interface ExamMeasurements {
  farside: ExcursionAssessment;
  nearside: ExcursionAssessment;
  rostrocaudalExcursion: RostrocaudalExcursion;
  postDentalRostrocaudalExcursion: RostrocaudalExcursion;
  molarAngleFarside: TableAngleAssessment;
  incisorAngle: TableAngleAssessment;
  molarAngleNearside: TableAngleAssessment;
  tmjPainFarside: TmjPainLevel;
  tmjPainNearside: TmjPainLevel;
}

export interface DentalReportData {
  // Step 1 — Administrative
  clientName: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  stableLocation: string;
  examDate: string;

  // Step 2 — Patient
  horseName: string;
  horseCode: string;
  age: string;
  /** Body weight in kg (estimated or measured) — needed to interpret
   * any sedation dose. */
  weightKg: string;
  breed: string;
  sex: string;
  bodyConditionScore: string;
  color: string;
  history: string[];
  /** Multi-select general / extra-oral physical examination findings. */
  physicalExam: string[];
  sedationUsed: boolean;
  sedationDrugs: SedationEntry[];
  nerveBlockUsed: boolean;
  nerveBlocks: NerveBlockEntry[];

  // Step 3 — Charting
  teeth: Record<string, ToothFinding>;
  pathologies: PathologyFinding[];
  softTissue: SoftTissueFinding[];
  chartingNotes: string;
  examMeasurements: ExamMeasurements;
  photos: ReportPhoto[];

  // Step 4 — Treatment
  treatments: TreatmentPerformed[];
  followUpTimeline: string;
  /** Ticked quick-pick client instructions (labels from
   * RECOMMENDATION_GROUPS); `additionalNotes` holds anything extra. */
  recommendations: string[];
  additionalNotes: string;
}

/** Ready-made client instructions, grouped as they appear in Step 4.
 * Sedation/feeding advice follows published owner guidance (AAEP, Merck
 * Vet Manual, MSU CVM); the rest is routine post-floating care wording
 * agreed with the clinic. */
export const RECOMMENDATION_GROUPS: { title: string; items: string[] }[] = [
  {
    title: 'After sedation',
    items: [
      'Withhold feed and water until fully awake (about 1–2 hours); keep in a stable or paddock without a hay net.',
      'No riding or lunging for 24 hours.',
    ],
  },
  {
    title: 'After routine floating',
    items: [
      'Offer soaked / soft feed for 24–48 hours if the mouth is tender.',
      'Bit rest for 3–5 days; check the bit fits and sits clear of the treated area.',
      'Some feed dropping is normal for a few days — call the clinic if not eating normally after 48 hours.',
    ],
  },
  {
    title: 'Diet / long-term',
    items: [
      'Transition to soaked senior feed, hay replacer or chopped forage (reduced grinding surface).',
      'Feed forage from the ground where possible to encourage natural lateral chewing.',
    ],
  },
  {
    title: 'Monitoring — call the clinic if',
    items: [
      'Nasal discharge (especially one-sided or foul-smelling), facial swelling, quidding, bad breath or reluctance to eat.',
    ],
  },
];

export const SEDATION_DRUGS = [
  'Detomidine', 'Xylazine', 'Butorphanol', 'Acepromazine',
  'Romifidine', 'Diazepam', 'Ketamine',
] as const;

export const HISTORY_OPTIONS = [
  'No abnormalities reported',
  'Weight loss', 'Dropping feed', 'Quidding', 'Dunking feed in water', 'Head tossing',
  'Nasal discharge', 'Foul odor (halitosis)', 'Facial swelling',
  'Reluctance to chew', 'Bit resistance', 'Excessive salivation',
  'Previous dental treatment (date known)', 'Diet / forage change', 'Current medication',
] as const;

export const PHYSICAL_EXAM_OPTIONS = [
  'No abnormalities detected on physical examination',
  'Poor body condition / weight loss',
  'Facial asymmetry',
  'Facial swelling — maxillary',
  'Facial swelling — mandibular',
  'Draining tract (facial / mandibular)',
  'Nasal discharge — unilateral',
  'Nasal discharge — bilateral',
  'Submandibular lymph node enlargement',
  'Halitosis',
  'Quidding observed',
  'Feed packing in cheeks',
  'Masseter / temporal muscle asymmetry or atrophy',
  'Pain on TMJ palpation',
  'Head shy / resents handling of the head',
  'Lip / commissure lesions (bit-related)',
  'Ocular discharge',
  'Elevated temperature',
] as const;

/** Regional anaesthesia named by the nerve actually blocked, not the
 * trunk. The "mandibular" block of older forms is the inferior alveolar
 * nerve at the mandibular foramen. */
export const NERVE_BLOCK_OPTIONS = [
  'Infraorbital',
  'Maxillary',
  'Middle mental',
  'Inferior alveolar (mandibular foramen)',
  'Intra-oral local infiltration',
] as const;

export const NERVE_BLOCK_SIDE_OPTIONS: NerveBlockSide[] = ['Left', 'Right', 'Bilateral'];

export const LOCAL_ANESTHETIC_DRUGS = [
  'Lidocaine', 'Mepivacaine', 'Bupivacaine',
] as const;

export const HORSE_COLOR_OPTIONS = [
  'Bay', 'Black', 'Chestnut', 'Sorrel', 'Grey', 'Palomino',
  'Buckskin', 'Dun', 'Roan', 'Pinto / Paint', 'White', 'Other',
] as const;

export const BCS_OPTIONS = [
  '1 — Poor', '2 — Very Thin', '3 — Thin', '4 — Moderate',
  '5 — Moderate (Ideal)', '6 — Moderately Fleshy', '7 — Fleshy',
  '8 — Fat', '9 — Extremely Fat',
] as const;

/** One whole-mouth or soft-tissue checklist entry: the stored `label`
 * is "CODE — Name" today; `aliases` are earlier spellings of the same
 * finding so old saved reports keep their ticks. */
export interface CodedOption {
  code: string;
  name: string;
  /** False for findings the clinic's reference has no code for (short
   * clinic code used instead). */
  fromReference: boolean;
  aliases?: string[];
}

export function codedLabel(o: CodedOption): string {
  return `${o.code} — ${o.name}`;
}

/** Whole-mouth (arcade-level) findings: conditions that are normally
 * recorded for the arcade as a whole (sharp points along a row, hooks,
 * ramps, wave…). A lesion on ONE specific tooth is charted on that tooth
 * via TOOTH_FINDING_CATALOG; the codes are the same so the report reads
 * consistently. */
export const PATHOLOGY_CATALOG: CodedOption[] = [
  { code: 'PTS', name: 'Sharp enamel points (generalised)', fromReference: true, aliases: ['Sharp enamel points'] },
  { code: 'HK', name: 'Hooks', fromReference: true, aliases: ['Hooks'] },
  { code: 'RMP', name: 'Ramps', fromReference: true, aliases: ['Ramps'] },
  { code: 'ETR', name: 'Excessive transverse ridges', fromReference: true, aliases: ['Excessive transverse ridges'] },
  { code: 'DIA', name: 'Multiple diastemata', fromReference: false, aliases: ['Multiple diastemata', 'Diastemata'] },
  { code: 'WV', name: 'Wave mouth', fromReference: true, aliases: ['Wave mouth'] },
  { code: 'STP', name: 'Step mouth', fromReference: true, aliases: ['Step mouth'] },
  { code: 'SHR', name: 'Shear mouth', fromReference: false, aliases: ['Shear mouth'] },
  { code: 'CV', name: 'Ventral curvature (smile) incisors', fromReference: true, aliases: ['Smile (ventral curvature) incisors'] },
  { code: 'CD', name: 'Dorsal curvature (frown) incisors', fromReference: true, aliases: ['Frown (dorsal curvature) incisors'] },
  { code: 'DGL/3', name: 'Diagonal incisor bite — lower left longer', fromReference: true, aliases: ['Diagonal incisor malocclusion'] },
  { code: 'DGL/4', name: 'Diagonal incisor bite — lower right longer', fromReference: true },
  { code: 'MAL2', name: 'Overbite / parrot mouth (mandibular brachygnathism)', fromReference: true, aliases: ['Overjet (parrot mouth)'] },
  { code: 'MAL3', name: 'Underbite / sow mouth (mandibular prognathism)', fromReference: true, aliases: ['Underjet (sow mouth)'] },
  { code: 'AB', name: 'Dental abrasion (bit / cribbing wear)', fromReference: true },
  { code: 'EOTRH', name: 'EOTRH', fromReference: false, aliases: ['EOTRH'] },
  { code: 'PD', name: 'Generalised periodontal disease', fromReference: true, aliases: ['Generalised periodontal disease', 'Periodontal disease'] },
  { code: 'ULC', name: 'Generalised oral ulceration', fromReference: false, aliases: ['Generalised oral ulceration'] },
];

export const PATHOLOGY_OPTIONS: readonly string[] = PATHOLOGY_CATALOG.map(codedLabel);

/** Soft-tissue pairs (normal / abnormal) consumed by index in Step 3. */
export const SOFT_TISSUE_CATALOG: CodedOption[] = [
  { code: 'CHK', name: 'Cheeks — normal', fromReference: false, aliases: ['Cheeks — normal'] },
  { code: 'LAC/B', name: 'Buccal (cheek) laceration / ulceration', fromReference: true, aliases: ['Cheeks — ulceration/laceration'] },
  { code: 'TNG', name: 'Tongue — normal', fromReference: false, aliases: ['Tongue — normal'] },
  { code: 'LAC/L', name: 'Lingual (tongue) laceration / ulcer', fromReference: true, aliases: ['Tongue — laceration/ulcer'] },
  { code: 'PAL', name: 'Palate — normal', fromReference: false, aliases: ['Palate — normal'] },
  { code: 'PAL/AB', name: 'Palate — abnormal', fromReference: false, aliases: ['Palate — abnormal'] },
  { code: 'GIN', name: 'Gingiva — normal', fromReference: false, aliases: ['Gingiva — normal'] },
  { code: 'GIN/INF', name: 'Gingiva — inflammation / recession', fromReference: false, aliases: ['Gingiva — inflammation/recession'] },
];

export const SOFT_TISSUE_OPTIONS: readonly string[] = SOFT_TISSUE_CATALOG.map((o) =>
  // normal entries read better without a code in front of them
  o.name.endsWith('— normal') ? o.name : codedLabel(o)
);

/** Things the clinician DID. Findings (what was wrong) live in
 * TOOTH_FINDING_OPTIONS / PATHOLOGY_OPTIONS, never here. */
export const TREATMENT_OPTIONS = [
  'Routine float (occlusal equilibration)',
  'Sharp enamel point reduction',
  'Bit seat',
  'Hook reduction',
  'Ramp reduction',
  'Step reduction',
  'Wave correction',
  'ETR reduction',
  'Incisor reduction / realignment',
  'Canine reduction',
  'Wolf tooth extraction',
  'Cheek tooth extraction',
  'Incisor extraction',
  'Retained cap removal',
  'Cap fragment removal',
  'Supernumerary tooth extraction',
  'Fracture fragment removal',
  'Mobile tooth extraction',
  'Diastema widening',
  'Periodontal pocket debridement / packing',
  'Radiographs taken',
] as const;

export const FOLLOW_UP_OPTIONS = [
  '3 months', '6 months', '12 months', '18 months', '24 months', 'As needed',
] as const;

export const SEX_OPTIONS = ['Stallion', 'Gelding', 'Mare', 'Colt', 'Filly'] as const;

export interface CountryCode {
  dialCode: string;
  name: string;
  flag: string;
}

/** Dial codes for the client phone field, Gulf/Middle East countries
 * first (the clinic's own region) followed by other common ones. */
export const COUNTRY_CODES: CountryCode[] = [
  { dialCode: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { dialCode: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { dialCode: '+965', name: 'Kuwait', flag: '🇰🇼' },
  { dialCode: '+973', name: 'Bahrain', flag: '🇧🇭' },
  { dialCode: '+974', name: 'Qatar', flag: '🇶🇦' },
  { dialCode: '+968', name: 'Oman', flag: '🇴🇲' },
  { dialCode: '+20', name: 'Egypt', flag: '🇪🇬' },
  { dialCode: '+962', name: 'Jordan', flag: '🇯🇴' },
  { dialCode: '+961', name: 'Lebanon', flag: '🇱🇧' },
  { dialCode: '+964', name: 'Iraq', flag: '🇮🇶' },
  { dialCode: '+1', name: 'United States / Canada', flag: '🇺🇸' },
  { dialCode: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { dialCode: '+33', name: 'France', flag: '🇫🇷' },
  { dialCode: '+49', name: 'Germany', flag: '🇩🇪' },
  { dialCode: '+39', name: 'Italy', flag: '🇮🇹' },
  { dialCode: '+34', name: 'Spain', flag: '🇪🇸' },
  { dialCode: '+91', name: 'India', flag: '🇮🇳' },
  { dialCode: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { dialCode: '+63', name: 'Philippines', flag: '🇵🇭' },
  { dialCode: '+61', name: 'Australia', flag: '🇦🇺' },
] as const;

export const LATERAL_EXCURSION_OPTIONS: LateralExcursion[] = ['Smooth', 'Step', 'Mouth opens to slide'];
export const OCCLUSAL_CONTACT_OPTIONS: OcclusalContact[] = ['Full', 'Partial', 'Minimal'];
export const ROSTROCAUDAL_EXCURSION_OPTIONS: RostrocaudalExcursion[] = ['Normal', 'Reduced', 'Painful'];
export const TABLE_ANGLE_OPTIONS: TableAngle[] = ['Flat', 'Normal', 'Steep'];
export const TMJ_PAIN_OPTIONS: TmjPainLevel[] = ['None', 'Mild', 'Moderate', 'Severe'];

export const HORSE_BREEDS = [
  'Thoroughbred', 'Arabian', 'Quarter Horse', 'Warmblood',
  'Standardbred', 'Appaloosa', 'Paint', 'Draft', 'Pony', 'Mixed/Other',
] as const;

export function toothType(toothId: string): string {
  const suffix = toothId.slice(-2);
  if (['01', '02', '03'].includes(suffix)) return 'Incisor';
  if (suffix === '04') return 'Canine';
  if (suffix === '05') return 'Wolf tooth (P1)';
  if (['06', '07', '08'].includes(suffix)) return 'Premolar';
  if (['09', '10', '11'].includes(suffix)) return 'Molar';
  return 'Tooth';
}

/** Every tooth across all charted sides (both real-image cheek-teeth
 * charts plus the schematic incisor grid), keyed by Triadan number. */
export function createInitialTeeth(): Record<string, ToothFinding> {
  const teeth: Record<string, ToothFinding> = {};
  for (const side of DENTAL_CHART_SIDES as DentalChartSide[]) {
    for (const region of side.regions) {
      teeth[region.toothNumber] = createEmptyFinding(region.toothNumber);
    }
  }
  return teeth;
}

export function createInitialPathologies(): PathologyFinding[] {
  return PATHOLOGY_OPTIONS.map((label, i) => ({
    id: `path-${i}`, label, checked: false,
  }));
}

export function createInitialSoftTissue(): SoftTissueFinding[] {
  return SOFT_TISSUE_OPTIONS.map((label, i) => ({
    id: `soft-${i}`, label, checked: false,
  }));
}

export function createInitialTreatments(): TreatmentPerformed[] {
  return TREATMENT_OPTIONS.map((label, i) => ({
    id: `treat-${i}`, label, checked: false,
  }));
}

export function createInitialSedationDrugs(): SedationEntry[] {
  return [{ id: 'sed-0', drug: '', dose: '' }];
}

export function createInitialNerveBlocks(): NerveBlockEntry[] {
  return [{ id: 'block-0', block: '', side: '', drug: 'Lidocaine', volume: '' }];
}

function createEmptyExcursionAssessment(): ExcursionAssessment {
  return { excursion: '', postDentalExcursion: '', occlusalContact: '', postDentalOcclusalContact: '' };
}

function createEmptyTableAngleAssessment(): TableAngleAssessment {
  return { before: '', after: '' };
}

export function createInitialExamMeasurements(): ExamMeasurements {
  return {
    farside: createEmptyExcursionAssessment(),
    nearside: createEmptyExcursionAssessment(),
    rostrocaudalExcursion: '',
    postDentalRostrocaudalExcursion: '',
    molarAngleFarside: createEmptyTableAngleAssessment(),
    incisorAngle: createEmptyTableAngleAssessment(),
    molarAngleNearside: createEmptyTableAngleAssessment(),
    tmjPainFarside: '',
    tmjPainNearside: '',
  };
}

export function createInitialReport(): DentalReportData {
  return {
    clientName: '',
    phoneCountryCode: '+966',
    phone: '',
    email: '',
    stableLocation: '',
    examDate: new Date().toISOString().split('T')[0],
    horseName: '',
    horseCode: '',
    age: '',
    weightKg: '',
    breed: '',
    sex: '',
    bodyConditionScore: '',
    color: '',
    history: [],
    physicalExam: [],
    sedationUsed: false,
    sedationDrugs: createInitialSedationDrugs(),
    nerveBlockUsed: false,
    nerveBlocks: createInitialNerveBlocks(),
    teeth: createInitialTeeth(),
    pathologies: createInitialPathologies(),
    softTissue: createInitialSoftTissue(),
    chartingNotes: '',
    examMeasurements: createInitialExamMeasurements(),
    photos: [],
    treatments: createInitialTreatments(),
    followUpTimeline: '6 months',
    recommendations: [],
    additionalNotes: '',
  };
}
