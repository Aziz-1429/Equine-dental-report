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
  color: string;
  sedationUsed: boolean;
  sedationDrugs: SedationEntry[];

  // Step 3 — Charting
  teeth: Record<string, ToothFinding>;
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

export const HORSE_COLOR_OPTIONS = [
  'Bay', 'Black', 'Chestnut', 'Sorrel', 'Grey', 'Palomino',
  'Buckskin', 'Dun', 'Roan', 'Pinto / Paint', 'White', 'Other',
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
    color: '',
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
