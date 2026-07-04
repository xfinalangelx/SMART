import { useAppData } from '@/contexts/AppDataContext';
import MetricScreen, { MetricSeries } from '@/components/MetricScreen';
import { SeriesKey } from '@/lib/supabase';

export default function LipidGraphScreen() {
  const { state, dispatch } = useAppData();

  const bind = (series: SeriesKey) => ({
    points: state?.appData?.graphData?.[series] || [],
    onAdd: (point: { date: string; value: number }) =>
      dispatch({ type: 'ADD_POINT', payload: { series, point } }),
    onEdit: (index: number, point: { date: string; value: number }) =>
      dispatch({ type: 'EDIT_POINT', payload: { series, index, point } }),
    onDelete: (index: number) => dispatch({ type: 'DELETE_POINT', payload: { series, index } }),
  });

  const series: MetricSeries[] = [
    {
      // Legacy generic "lipid" readings are shown as total cholesterol
      key: 'lipid',
      label: { en: 'Total Cholesterol', bm: 'Kolesterol Keseluruhan' },
      unit: 'mmol/L',
      color: '#FF9800',
      chartType: 'line',
      normalRange: { high: 5.2 },
      placeholder: { en: 'Total cholesterol (e.g: 4.8)', bm: 'Kolesterol keseluruhan (cth: 4.8)' },
      ...bind('lipid'),
    },
    {
      key: 'ldl',
      label: { en: 'LDL', bm: 'LDL' },
      unit: 'mmol/L',
      color: '#F44336',
      chartType: 'line',
      normalRange: { high: 3.4 },
      placeholder: { en: 'LDL (e.g: 2.6)', bm: 'LDL (cth: 2.6)' },
      ...bind('ldl'),
    },
    {
      key: 'hdl',
      label: { en: 'HDL', bm: 'HDL' },
      unit: 'mmol/L',
      color: '#4CAF50',
      chartType: 'line',
      normalRange: { low: 1.0 },
      placeholder: { en: 'HDL (e.g: 1.3)', bm: 'HDL (cth: 1.3)' },
      ...bind('hdl'),
    },
    {
      key: 'triglycerides',
      label: { en: 'Triglycerides', bm: 'Trigliserida' },
      unit: 'mmol/L',
      color: '#FF5722',
      chartType: 'line',
      normalRange: { high: 1.7 },
      placeholder: { en: 'Triglycerides (e.g: 1.2)', bm: 'Trigliserida (cth: 1.2)' },
      ...bind('triglycerides'),
    },
  ];

  return (
    <MetricScreen
      title={{ en: 'Lipid Profile', bm: 'Profil Lipid' }}
      description={{
        en: 'Track each lipid value separately: total cholesterol, LDL, HDL and triglycerides — select which value you want to record below. The shaded green area shows the normal range. Reference ranges can differ between laboratories; follow your own lab report.',
        bm: 'Jejaki setiap nilai lipid secara berasingan: kolesterol keseluruhan, LDL, HDL dan trigliserida — pilih nilai yang ingin direkod di bawah. Kawasan hijau menunjukkan julat normal. Julat rujukan mungkin berbeza antara makmal; rujuk laporan makmal anda.',
      }}
      series={series}
    />
  );
}
