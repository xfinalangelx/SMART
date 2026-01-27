import medicine from '../utils/medicine';
import bmMedicine from '../utils/bmMedicine';

export function getMedicineData(filter: string, language: 'en' | 'bm') {
  const data = language === 'bm' ? bmMedicine : medicine;
  
  switch (filter) {
    case 'nrti':
      return data.nrti;
    case 'pi':
      return data.pi;
    case 'nnrti':
      return data.nnrti;
    case 'nnnrti':
      return data.nnnrti;
    case 'ii':
      return data.ii;
    default:
      return [];
  }
}
