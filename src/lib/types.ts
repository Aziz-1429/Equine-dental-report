export type ToothStatus = 'normal' | 'attention' | 'pathology' | 'absent';
export type ToothSeverity = 'Mild' | 'Moderate' | 'Severe' | '';

export interface ToothRecord {
  id: string;
  status: ToothStatus;
  findings: string[];
  severity: ToothSeverity;
  note: string;
}

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
  time: string;
}

export interface DentalReportData {
  // Step 1 — Administrative
  clientName: string;
  phone: string;
  email: string;
  stableLocation: string;
  examDate: string;

  // Step 2 — Patient
  horseName: string;
  age: string;
  breed: string;
  sex: string;
  bodyConditionScore: string;
  horseUse: string;
  sedationUsed: boolean;
  sedationDrugs: SedationEntry[];

  // Step 3 — Charting
  teeth: Record<string, ToothRecord>;
  pathologies: PathologyFinding[];
  softTissue: SoftTissueFinding[];
  chartingNotes: string;

  // Step 4 — Treatment
  treatments: TreatmentPerformed[];
  dietRecommendations: string;
  followUpTimeline: string;
  additionalNotes: string;

  // Step 5 — Finalize
  practitionerName: string;
  practitionerCredentials: string;
  clinicName: string;
  signature: string;
  signatureDate: string;
}

export const SEDATION_DRUGS = [
  'Detomidine', 'Xylazine', 'Butorphanol', 'Acepromazine',
  'Romifidine', 'Diazepam', 'Ketamine',
] as const;

export const HORSE_USE_OPTIONS = [
  'Racing', 'Endurance', 'Show Jumping', 'Dressage', 'Eventing',
  'Polo', 'Breeding', 'Pleasure / Trail', 'Western', 'Working / Ranch',
  'Retired', 'Other',
] as const;

export const BCS_OPTIONS = [
  '1 — Poor', '2 — Very Thin', '3 — Thin', '4 — Moderate',
  '5 — Moderate (Ideal)', '6 — Moderately Fleshy', '7 — Fleshy',
  '8 — Fat', '9 — Extremely Fat',
] as const;

export const PATHOLOGY_OPTIONS = [
  'Sharp enamel points', 'Hooks', 'Ramps', 'Wave mouth', 'Step mouth',
  'EOTRH', 'Caries', 'Diastemata', 'Overgrown crowns', 'Missing teeth',
  'Fractured teeth', 'Periodontal disease',
] as const;

export const SOFT_TISSUE_OPTIONS = [
  'Cheeks — normal', 'Cheeks — ulceration/laceration',
  'Tongue — normal', 'Tongue — laceration/ulcer',
  'Palate — normal', 'Palate — abnormal',
  'Gingiva — normal', 'Gingiva — inflammation/recession',
] as const;

export const TREATMENT_OPTIONS = [
  'Floating (rasping)', 'Extraction', 'Bit seat applied',
  'Wolf teeth removal', 'Hook reduction', 'Ramp reduction',
  'Diastema treatment', 'Fracture repair', 'No treatment required',
] as const;

export const FOLLOW_UP_OPTIONS = [
  '3 months', '6 months', '12 months', '18 months', '24 months', 'As needed',
] as const;

export const SEX_OPTIONS = ['Stallion', 'Gelding', 'Mare', 'Colt', 'Filly'] as const;

export const HORSE_BREEDS = [
  'Thoroughbred', 'Arabian', 'Quarter Horse', 'Warmblood',
  'Standardbred', 'Appaloosa', 'Paint', 'Draft', 'Pony', 'Mixed/Other',
] as const;

// Modified Triadan numbering — upper arcades (1xx right, 2xx left)
// Incisors 01-03, Canine 04, Premolars 06-08, Molar 09-11
export const UPPER_RIGHT_TEETH = [
  '101', '102', '103', '104', '106', '107', '108', '109', '110', '111',
];
export const UPPER_LEFT_TEETH = [
  '201', '202', '203', '204', '206', '207', '208', '209', '210', '211',
];
export const LOWER_RIGHT_TEETH = [
  '301', '302', '303', '304', '306', '307', '308', '309', '310', '311',
];
export const LOWER_LEFT_TEETH = [
  '401', '402', '403', '404', '406', '407', '408', '409', '410', '411',
];

// Findings loggable for an individual tooth via the tooth detail modal.
// Reference: Floyd MR, "The Modified Triadan System: Nomenclature for
// Veterinary Dentistry," J Vet Dent 1991;8(4):18-19.
export const TOOTH_FINDING_OPTIONS = [
  'Excessive Transverse Ridges (ETR)',
  'Sharp Enamel Points',
  'Hook',
  'Ramp',
  'Step Mouth',
  'Wave Mouth',
  'Periodontal Pocket',
  'Diastema / Feed Packing',
  'Fracture',
  'Missing Tooth',
] as const;

export const TOOTH_SEVERITY_OPTIONS = ['Mild', 'Moderate', 'Severe'] as const;

export function toothType(toothId: string): string {
  const suffix = toothId.slice(-2);
  if (['01', '02', '03'].includes(suffix)) return 'Incisor';
  if (suffix === '04') return 'Canine';
  if (['06', '07', '08'].includes(suffix)) return 'Premolar';
  if (['09', '10', '11'].includes(suffix)) return 'Molar';
  return 'Tooth';
}

export const TOOTH_GROUPS = [
  { label: 'Incisors', ids: ['01', '02', '03'] },
  { label: 'Canine', ids: ['04'] },
  { label: 'Premolars', ids: ['06', '07', '08'] },
  { label: 'Molars', ids: ['09', '10', '11'] },
];

export function getToothGroup(toothId: string): string {
  const suffix = toothId.slice(-2);
  const group = TOOTH_GROUPS.find((g) => g.ids.includes(suffix));
  return group ? group.label : 'Other';
}

export function createInitialTeeth(): Record<string, ToothRecord> {
  const all = [
    ...UPPER_RIGHT_TEETH, ...UPPER_LEFT_TEETH,
    ...LOWER_RIGHT_TEETH, ...LOWER_LEFT_TEETH,
  ];
  const teeth: Record<string, ToothRecord> = {};
  for (const id of all) {
    teeth[id] = { id, status: 'normal', findings: [], severity: '', note: '' };
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
  return [{ id: 'sed-0', drug: '', dose: '', time: '' }];
}

export function createInitialReport(): DentalReportData {
  return {
    clientName: '',
    phone: '',
    email: '',
    stableLocation: '',
    examDate: new Date().toISOString().split('T')[0],
    horseName: '',
    age: '',
    breed: '',
    sex: '',
    bodyConditionScore: '',
    horseUse: '',
    sedationUsed: false,
    sedationDrugs: createInitialSedationDrugs(),
    teeth: createInitialTeeth(),
    pathologies: createInitialPathologies(),
    softTissue: createInitialSoftTissue(),
    chartingNotes: '',
    treatments: createInitialTreatments(),
    dietRecommendations: '',
    followUpTimeline: '6 months',
    additionalNotes: '',
    practitionerName: '',
    practitionerCredentials: '',
    clinicName: '',
    signature: '',
    signatureDate: new Date().toISOString().split('T')[0],
  };
}
