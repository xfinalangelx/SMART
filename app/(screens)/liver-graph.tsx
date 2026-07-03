import { useAppData } from '@/contexts/AppDataContext';
import MetricScreen, { MetricSeries } from '@/components/MetricScreen';
import { SeriesKey } from '@/lib/supabase';

export default function LiverGraphScreen() {
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
      key: 'alt',
      label: { en: 'ALT', bm: 'ALT' },
      unit: 'U/L',
      color: '#795548',
      chartType: 'line',
      normalRange: { high: 40 },
      placeholder: { en: 'ALT (e.g: 25)', bm: 'ALT (cth: 25)' },
      ...bind('alt'),
    },
    {
      key: 'ast',
      label: { en: 'AST', bm: 'AST' },
      unit: 'U/L',
      color: '#8D6E63',
      chartType: 'line',
      normalRange: { high: 40 },
      placeholder: { en: 'AST (e.g: 25)', bm: 'AST (cth: 25)' },
      ...bind('ast'),
    },
  ];

  return (
    <MetricScreen
      title={{ en: 'Liver Profile', bm: 'Profil Hati' }}
      description={{
        en: 'Track your liver enzymes (ALT and AST) — select which value you want to record below. The shaded green area shows the normal range. Reference ranges can differ between laboratories; follow your own lab report.',
        bm: 'Pantau enzim hati anda (ALT dan AST) — pilih nilai yang ingin direkod di bawah. Kawasan hijau menunjukkan julat normal. Julat rujukan mungkin berbeza antara makmal; rujuk laporan makmal anda.',
      }}
      series={series}
    />
  );
}
