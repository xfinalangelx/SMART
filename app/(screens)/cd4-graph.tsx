import { useAppData } from '@/contexts/AppDataContext';
import MetricScreen, { MetricSeries } from '@/components/MetricScreen';
import { SeriesKey } from '@/lib/supabase';
import { SmartColors } from '@/constants/theme';

export default function Cd4GraphScreen() {
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
      key: 'cd4',
      label: { en: 'CD4 Count', bm: 'Kiraan CD4' },
      unit: 'cells/mm³',
      color: SmartColors.track,
      chartType: 'bar',
      normalRange: { low: 500, high: 1500 },
      placeholder: { en: 'CD4 value (e.g: 500)', bm: 'Nilai CD4 (cth: 500)' },
      ...bind('cd4'),
    },
    {
      key: 'viralLoad',
      label: { en: 'Viral Load', bm: 'Viral Load' },
      unit: 'copies/mL',
      color: SmartColors.manage,
      chartType: 'line',
      normalRange: { high: 50 },
      normalText: {
        en: 'Target: undetectable (< 50 copies/mL)',
        bm: 'Sasaran: tidak dapat dikesan (< 50 salinan/mL)',
      },
      placeholder: { en: 'Viral load (e.g: 20)', bm: 'Viral load (cth: 20)' },
      ...bind('viralLoad'),
    },
  ];

  return (
    <MetricScreen
      title={{ en: 'CD4 & Viral Load', bm: 'CD4 & Viral Load' }}
      description={{
        en: 'Track your CD4 count (bar chart) and viral load (line chart) separately — select which value you want to record below. The shaded green area shows the normal range. Reference ranges can differ between laboratories; follow your own lab report.',
        bm: 'Jejaki kiraan CD4 (carta bar) dan viral load (carta garis) secara berasingan — pilih nilai yang ingin direkod di bawah. Kawasan hijau menunjukkan julat normal. Julat rujukan mungkin berbeza antara makmal; rujuk laporan makmal anda.',
      }}
      series={series}
    />
  );
}
