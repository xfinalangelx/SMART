import { useAppData } from '@/contexts/AppDataContext';
import MetricScreen, { MetricSeries } from '@/components/MetricScreen';
import { SeriesKey } from '@/lib/supabase';

export default function BloodSugarGraphScreen() {
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
      key: 'bloodSugar',
      label: { en: 'Fasting Blood Glucose', bm: 'Glukosa Darah Berpuasa' },
      unit: 'mmol/L',
      color: '#E91E63',
      chartType: 'line',
      normalRange: { low: 3.9, high: 5.6 },
      placeholder: { en: 'Fasting glucose (e.g: 5.5)', bm: 'Glukosa puasa (cth: 5.5)' },
      ...bind('bloodSugar'),
    },
    {
      key: 'hba1c',
      label: { en: 'HbA1c', bm: 'HbA1c' },
      unit: '%',
      color: '#9C27B0',
      chartType: 'line',
      normalRange: { low: 4.0, high: 5.6 },
      placeholder: { en: 'HbA1c (e.g: 5.4)', bm: 'HbA1c (cth: 5.4)' },
      ...bind('hba1c'),
    },
  ];

  return (
    <MetricScreen
      title={{ en: 'Blood Sugar', bm: 'Gula Darah' }}
      description={{
        en: 'Record your fasting blood glucose and HbA1c separately — select which value you want to record below. The shaded green area shows the normal range. Reference ranges can differ between laboratories; follow your own lab report.',
        bm: 'Rekod glukosa darah berpuasa dan HbA1c secara berasingan — pilih nilai yang ingin direkod di bawah. Kawasan hijau menunjukkan julat normal. Julat rujukan mungkin berbeza antara makmal; rujuk laporan makmal anda.',
      }}
      series={series}
    />
  );
}
