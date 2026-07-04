import medicine from '../utils/medicine';
import bmMedicine from '../utils/bmMedicine';

export type MedicineCategoryKey = 'nrti' | 'nnrti' | 'pi' | 'ii' | 'combination';

export const MEDICINE_CATEGORY_KEYS: MedicineCategoryKey[] = [
  'nrti',
  'nnrti',
  'pi',
  'ii',
  'combination',
];

export function getMedicineData(filter: string, language: 'en' | 'bm') {
  const data = language === 'bm' ? bmMedicine : medicine;

  switch (filter) {
    case 'nrti':
      return data.nrti;
    case 'nnrti':
      return data.nnrti;
    case 'pi':
      return data.pi;
    case 'ii':
      return data.ii;
    case 'combination':
    case 'nnnrti': // legacy filter value for the old combined group
      return data.combination;
    default:
      return [];
  }
}

export type MedicineEntry = ReturnType<typeof getMedicineData>[number] & {
  categoryKey: MedicineCategoryKey;
};

/** Every medicine across all classes, sorted alphabetically by name. */
export function getAllMedicines(language: 'en' | 'bm'): MedicineEntry[] {
  const all = MEDICINE_CATEGORY_KEYS.flatMap((key) =>
    getMedicineData(key, language).map((item) => ({ ...item, categoryKey: key }))
  );
  return all.sort((a, b) => a.name.localeCompare(b.name));
}
