import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GraphPoint } from '@/lib/supabase';
import MetricChart, { NormalRange } from '@/components/MetricChart';
import { useAppData } from '@/contexts/AppDataContext';

export type Localized = { en: string; bm: string };

export type MetricSeries = {
  key: string;
  label: Localized;
  unit: string;
  color: string;
  chartType: 'line' | 'bar';
  normalRange?: NormalRange;
  /** Optional override for the normal-range chip (e.g. "Undetectable: < 50"). */
  normalText?: Localized;
  placeholder: Localized;
  points: GraphPoint[];
  onAdd: (point: GraphPoint) => Promise<void> | void;
  onEdit: (index: number, point: GraphPoint) => Promise<void> | void;
  onDelete: (index: number) => Promise<void> | void;
};

const describeRange = (series: MetricSeries, language: 'en' | 'bm'): string | undefined => {
  if (series.normalText) return series.normalText[language];
  const range = series.normalRange;
  if (!range || (range.low == null && range.high == null)) return undefined;
  const prefix = language === 'bm' ? 'Julat normal' : 'Normal range';
  if (range.low != null && range.high != null)
    return `${prefix}: ${range.low} - ${range.high} ${series.unit}`;
  if (range.high != null) return `${prefix}: < ${range.high} ${series.unit}`;
  return `${prefix}: > ${range.low} ${series.unit}`;
};

/**
 * Chart + records + add/edit form for one selectable series. Shared by the
 * built-in analysis screens and user-created custom analyses.
 */
export function MetricPanel({
  series,
  language,
}: {
  series: MetricSeries[];
  language: 'en' | 'bm';
}) {
  const [activeKey, setActiveKey] = useState(series[0]?.key);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const active = series.find((s) => s.key === activeKey) || series[0];
  if (!active) return null;

  const resetForm = () => {
    setNewValue('');
    setSelectedDate(new Date());
    setShowAddForm(false);
    setEditingIndex(null);
  };

  const switchSeries = (key: string) => {
    setActiveKey(key);
    resetForm();
  };

  const handleSave = async () => {
    const valueNum = parseFloat(newValue.replace(',', '.'));

    if (!newValue || isNaN(valueNum) || valueNum < 0) {
      Alert.alert(
        language === 'bm' ? 'Ralat' : 'Error',
        language === 'bm' ? 'Sila masukkan nilai yang sah' : 'Please enter a valid value'
      );
      return;
    }

    const point: GraphPoint = {
      date: moment(selectedDate).format('YYYY-MM-DD'),
      value: valueNum,
    };

    try {
      if (editingIndex !== null) {
        await active.onEdit(editingIndex, point);
      } else {
        await active.onAdd(point);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving reading:', error);
      Alert.alert(
        language === 'bm' ? 'Ralat' : 'Error',
        language === 'bm' ? 'Gagal menyimpan data' : 'Failed to save data'
      );
    }
  };

  const handleEdit = (item: GraphPoint, index: number) => {
    setEditingIndex(index);
    setNewValue(String(item.value));
    setSelectedDate(new Date(item.date));
    setShowAddForm(true);
  };

  const handleDelete = (index: number) => {
    Alert.alert(
      language === 'bm' ? 'Padam Data' : 'Delete Data',
      language === 'bm' ? 'Adakah anda pasti?' : 'Are you sure?',
      [
        { text: language === 'bm' ? 'Batal' : 'Cancel', style: 'cancel' },
        {
          text: language === 'bm' ? 'Padam' : 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await active.onDelete(index);
              if (editingIndex === index) resetForm();
            } catch (error) {
              console.error('Error deleting reading:', error);
            }
          },
        },
      ]
    );
  };

  const rangeLabel = describeRange(active, language);

  return (
    <View>
      {series.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {series.map((s) => {
            const isActive = s.key === active.key;
            return (
              <TouchableOpacity
                key={s.key}
                onPress={() => switchSeries(s.key)}
                style={[
                  styles.tabChip,
                  { borderColor: s.color },
                  isActive && { backgroundColor: s.color },
                ]}
              >
                <Text style={[styles.tabChipText, { color: isActive ? '#FFF' : s.color }]}>
                  {s.label[language]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <Text style={styles.seriesTitle}>
        {active.label[language]} ({active.unit})
      </Text>
      {rangeLabel && (
        <View style={styles.rangeChip}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.rangeChipText}>{rangeLabel}</Text>
        </View>
      )}

      {active.points.length > 0 ? (
        <MetricChart
          points={active.points}
          color={active.color}
          unit={active.unit}
          chartType={active.chartType}
          normalRange={active.normalRange}
          normalLabel={rangeLabel}
          language={language}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="stats-chart-outline" size={60} color="#CCCCCC" />
          <Text style={styles.emptyText}>
            {language === 'bm'
              ? 'Tiada data tersedia. Tambah bacaan pertama anda!'
              : 'No data available. Add your first reading!'}
          </Text>
        </View>
      )}

      {active.points.length > 0 && (
        <View style={styles.dataListContainer}>
          <Text style={styles.dataListTitle}>
            {language === 'bm' ? 'Rekod Terdahulu' : 'Previous Records'}
          </Text>
          <ScrollView
            style={styles.dataListScroll}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {[...active.points].reverse().map((item, reverseIndex) => {
              const actualIndex = active.points.length - 1 - reverseIndex;
              return (
                <View key={`${item.date}-${actualIndex}`} style={styles.dataItem}>
                  <View style={styles.dataInfo}>
                    <Text style={styles.dataDate}>{moment(item.date).format('DD MMM YYYY')}</Text>
                    <Text style={[styles.dataValue, { color: active.color }]}>
                      {item.value} {active.unit}
                    </Text>
                  </View>
                  <View style={styles.dataActions}>
                    <TouchableOpacity
                      onPress={() => handleEdit(item, actualIndex)}
                      style={styles.editButton}
                    >
                      <Ionicons name="pencil" size={20} color="#555" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(actualIndex)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {!showAddForm && (
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(true)}>
          <LinearGradient
            colors={[active.color, active.color]}
            style={styles.addButtonGradient}
            start={[0, 0]}
            end={[1, 0]}
          >
            <Text style={styles.addButtonText}>
              {language === 'bm'
                ? `+ Tambah ${active.label.bm}`
                : `+ Add ${active.label.en}`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {showAddForm && (
        <View style={styles.addForm}>
          <Text style={styles.formTitle}>
            {editingIndex !== null
              ? language === 'bm'
                ? `Kemaskini ${active.label.bm}`
                : `Edit ${active.label.en}`
              : language === 'bm'
                ? `Tambah ${active.label.bm}`
                : `Add ${active.label.en}`}
          </Text>

          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color={active.color} style={{ marginRight: 8 }} />
            <Text style={styles.dateButtonText}>{moment(selectedDate).format('DD MMM YYYY')}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (date) setSelectedDate(date);
              }}
              maximumDate={new Date()}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder={`${active.placeholder[language]} (${active.unit})`}
            value={newValue}
            onChangeText={setNewValue}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <View style={styles.formButtons}>
            <TouchableOpacity style={[styles.formButton, styles.cancelButton]} onPress={resetForm}>
              <Text style={styles.cancelButtonText}>
                {language === 'bm' ? 'Batal' : 'Cancel'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.formButton, styles.saveButton]} onPress={handleSave}>
              <LinearGradient
                colors={[active.color, active.color]}
                style={styles.saveButtonGradient}
                start={[0, 0]}
                end={[1, 0]}
              >
                <Text style={styles.saveButtonText}>
                  {editingIndex !== null
                    ? language === 'bm'
                      ? 'Kemaskini'
                      : 'Update'
                    : language === 'bm'
                      ? 'Simpan'
                      : 'Save'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

type MetricScreenProps = {
  title: Localized;
  description: Localized;
  series: MetricSeries[];
};

/** Full analysis screen: header + description + MetricPanel. */
export default function MetricScreen({ title, description, series }: MetricScreenProps) {
  const { state } = useAppData();
  const insets = useSafeAreaInsets();
  const language = state?.appData?.settings?.language === 'en' ? 'en' : 'bm';

  const [loaded] = useFonts({
    MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
    MontserratSemiBold: require('../assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratMedium: require('../assets/fonts/Montserrat-Medium.ttf'),
  });

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>{title[language]}</Text>
          <Text style={styles.description}>{description[language]}</Text>
          <MetricPanel series={series} language={language} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginTop: 21,
    marginLeft: 11,
  },
  backButton: {
    padding: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'MontserratBold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    fontFamily: 'MontserratMedium',
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  tabsRow: {
    gap: 8,
    paddingBottom: 14,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  tabChipText: {
    fontSize: 13,
    fontFamily: 'MontserratSemiBold',
  },
  seriesTitle: {
    fontSize: 18,
    fontFamily: 'MontserratSemiBold',
    color: '#333',
    marginBottom: 8,
  },
  rangeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 14,
  },
  rangeChipText: {
    fontSize: 13,
    fontFamily: 'MontserratMedium',
    color: '#2E7D32',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'MontserratMedium',
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
  },
  dataListContainer: {
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
  dataListScroll: {
    maxHeight: 300,
  },
  dataListTitle: {
    fontSize: 18,
    fontFamily: 'MontserratSemiBold',
    color: '#333',
    marginBottom: 16,
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dataInfo: {
    flex: 1,
  },
  dataDate: {
    fontSize: 15,
    fontFamily: 'MontserratMedium',
    color: '#666',
  },
  dataValue: {
    fontSize: 15,
    fontFamily: 'MontserratSemiBold',
    marginTop: 4,
  },
  dataActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFE6E6',
  },
  addButton: {
    marginBottom: 20,
  },
  addButtonGradient: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'MontserratBold',
  },
  addForm: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formTitle: {
    fontSize: 20,
    fontFamily: 'MontserratBold',
    color: '#333',
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateButtonText: {
    fontSize: 16,
    fontFamily: 'MontserratMedium',
    color: '#333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'MontserratMedium',
    color: '#333',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  formButton: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#666',
  },
  saveButton: {
    flex: 1,
  },
  saveButtonGradient: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#FFFFFF',
  },
});
