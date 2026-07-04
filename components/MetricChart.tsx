import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import { CartesianChart, Line, Bar, Scatter, AreaRange } from 'victory-native';
import { useFont } from '@shopify/react-native-skia';
import { GraphPoint } from '@/lib/supabase';
import { SmartColors } from '@/constants/theme';

export type NormalRange = { low?: number; high?: number };

type MetricChartProps = {
  points: GraphPoint[];
  color: string;
  unit: string;
  chartType: 'line' | 'bar';
  normalRange?: NormalRange;
  /** Ready-made label describing the normal range (e.g. "Normal: 3.9 - 5.6 mmol/L"). */
  normalLabel?: string;
  language: 'en' | 'bm';
};

const formatValue = (value: number): string => {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 10_000) return `${Math.round(value / 1000)}k`;
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return `${Math.round(value * 100) / 100}`;
};

export default function MetricChart({
  points,
  color,
  unit,
  chartType,
  normalRange,
  normalLabel,
  language,
}: MetricChartProps) {
  const font = useFont(require('../assets/fonts/Montserrat-Medium.ttf'), 11);

  const sorted = [...points]
    .filter((p) => p && p.date && p.value != null && !isNaN(new Date(p.date).getTime()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (sorted.length === 0 || !font) return null;

  const values = sorted.map((p) => Number(p.value) || 0);
  const dataMax = Math.max(...values);

  // Resolve open-ended ranges into a drawable band
  const hasBand = normalRange && (normalRange.low != null || normalRange.high != null);
  const bandLow = normalRange?.low ?? 0;
  const bandHigh =
    normalRange?.high ?? Math.max(dataMax * 1.15, (normalRange?.low ?? 0) * 1.5, bandLow + 1);

  const chartData = sorted.map((p) => ({
    x: new Date(p.date).getTime(),
    value: Number(p.value) || 0,
    bandLow,
    bandHigh,
  }));

  // Give a single reading some horizontal room so bars/points stay visible
  if (chartData.length === 1) {
    const only = chartData[0];
    const daySpan = 24 * 60 * 60 * 1000;
    chartData.unshift({ ...only, x: only.x - daySpan, value: only.value });
    chartData[0] = { ...chartData[0] };
  }

  const spanDays =
    (chartData[chartData.length - 1].x - chartData[0].x) / (24 * 60 * 60 * 1000);
  const dateFormat = spanDays > 150 ? 'MMM YY' : 'DD MMM';

  const yKeys: ('value' | 'bandLow' | 'bandHigh')[] = hasBand
    ? ['value', 'bandLow', 'bandHigh']
    : ['value'];

  const single = sorted.length === 1;

  return (
    <View style={styles.card}>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: color }]} />
          <Text style={styles.legendText}>{unit}</Text>
        </View>
        {hasBand && (
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: SmartColors.normalBand }]} />
            <Text style={styles.legendText}>
              {normalLabel || (language === 'bm' ? 'Julat normal' : 'Normal range')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.chartArea}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={yKeys}
          domainPadding={{ left: chartType === 'bar' ? 32 : 16, right: chartType === 'bar' ? 32 : 16, top: 24, bottom: 24 }}
          axisOptions={{
            font,
            tickCount: { x: Math.min(4, chartData.length), y: 5 },
            labelColor: '#777777',
            lineColor: '#EAEAEA',
            formatXLabel: (ms) => (ms ? moment(Number(ms)).format(dateFormat) : ''),
            formatYLabel: (v) => formatValue(Number(v)),
          }}
        >
          {({ points: chartPoints, chartBounds }) => (
            <>
              {hasBand && (
                <AreaRange
                  upperPoints={chartPoints.bandHigh!}
                  lowerPoints={chartPoints.bandLow!}
                  color={SmartColors.normalBand}
                />
              )}
              {chartType === 'bar' ? (
                <Bar
                  points={single ? chartPoints.value.slice(-1) : chartPoints.value}
                  chartBounds={chartBounds}
                  color={color}
                  barWidth={Math.max(10, Math.min(36, 220 / chartData.length))}
                  roundedCorners={{ topLeft: 4, topRight: 4 }}
                  animate={{ type: 'timing', duration: 300 }}
                />
              ) : (
                <>
                  {!single && (
                    <Line
                      points={chartPoints.value}
                      color={color}
                      strokeWidth={3}
                      animate={{ type: 'timing', duration: 300 }}
                    />
                  )}
                  <Scatter
                    points={single ? chartPoints.value.slice(-1) : chartPoints.value}
                    color={color}
                    radius={4}
                  />
                </>
              )}
            </>
          )}
        </CartesianChart>
      </View>

      <Text style={styles.xCaption}>{language === 'bm' ? 'Tarikh' : 'Date'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'MontserratMedium',
    color: '#666',
  },
  chartArea: {
    height: 260,
  },
  xCaption: {
    textAlign: 'center',
    marginTop: 6,
    fontSize: 12,
    fontFamily: 'MontserratMedium',
    color: '#999',
  },
});
