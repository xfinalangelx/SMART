import { useAppData } from '@/contexts/AppDataContext';
import MetricScreen, { MetricSeries } from '@/components/MetricScreen';
import { SeriesKey } from '@/lib/supabase';

export default function RenalGraphScreen() {
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
      key: 'creatinine',
      label: { en: 'Creatinine', bm: 'Kreatinin' },
      unit: 'µmol/L',
      color: '#4CAF50',
      chartType: 'line',
      normalRange: { low: 44, high: 106 },
      placeholder: { en: 'Creatinine (e.g: 80)', bm: 'Kreatinin (cth: 80)' },
      ...bind('creatinine'),
    },
    {
      key: 'uacr',
      label: { en: 'Urine Albumin-Creatinine Ratio', bm: 'Nisbah Albumin-Kreatinin Urin' },
      unit: 'mg/mmol',
      color: '#009688',
      chartType: 'line',
      normalRange: { high: 3 },
      placeholder: { en: 'UACR (e.g: 1.5)', bm: 'UACR (cth: 1.5)' },
      ...bind('uacr'),
    },
  ];

  return (
    <MetricScreen
      title={{ en: 'Renal Profile', bm: 'Profil Buah Pinggang' }}
      description={{
        en: 'Track your kidney health with creatinine and urine albumin-creatinine ratio (UACR) — select which value you want to record below. The shaded green area shows the normal range. Reference ranges can differ between laboratories; follow your own lab report.',
        bm: 'Pantau kesihatan buah pinggang anda dengan kreatinin dan nisbah albumin-kreatinin urin (UACR) — pilih nilai yang ingin direkod di bawah. Kawasan hijau menunjukkan julat normal. Julat rujukan mungkin berbeza antara makmal; rujuk laporan makmal anda.',
      }}
      series={series}
    />
  );
}
