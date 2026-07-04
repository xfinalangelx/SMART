import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '@/contexts/AppDataContext';
import { CustomAnalysis } from '@/lib/supabase';
import { MetricPanel } from '@/components/MetricScreen';
import { SmartColors } from '@/constants/theme';

const parseOptionalNumber = (raw: string): number | undefined => {
  const trimmed = raw.trim().replace(',', '.');
  if (!trimmed) return undefined;
  const value = parseFloat(trimmed);
  return isNaN(value) ? undefined : value;
};

export default function CustomAnalysisScreen() {
  const { state, dispatch } = useAppData();
  const insets = useSafeAreaInsets();
  const language = state?.appData?.settings?.language === 'en' ? 'en' : 'bm';
  const analyses = state?.appData?.customAnalyses || [];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [low, setLow] = useState('');
  const [high, setHigh] = useState('');

  const [loaded] = useFonts({
    MontserratBold: require('../../assets/fonts/Montserrat-Bold.ttf'),
    MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratMedium: require('../../assets/fonts/Montserrat-Medium.ttf'),
  });

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={SmartColors.track} />
      </View>
    );
  }

  const selected = analyses.find((a) => a.id === selectedId) || null;

  const resetCreateForm = () => {
    setName('');
    setUnit('');
    setLow('');
    setHigh('');
    setShowCreateForm(false);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert(
        language === 'bm' ? 'Ralat' : 'Error',
        language === 'bm' ? 'Sila masukkan nama analisis' : 'Please enter an analysis name'
      );
      return;
    }
    const normalLow = parseOptionalNumber(low);
    const normalHigh = parseOptionalNumber(high);
    if (normalLow != null && normalHigh != null && normalLow >= normalHigh) {
      Alert.alert(
        language === 'bm' ? 'Ralat' : 'Error',
        language === 'bm'
          ? 'Julat rendah mesti kurang daripada julat tinggi'
          : 'The low value must be less than the high value'
      );
      return;
    }
    const analysis: CustomAnalysis = {
      id: Date.now().toString(),
      name: name.trim(),
      unit: unit.trim() || '-',
      normalLow,
      normalHigh,
      data: [],
    };
    await dispatch({ type: 'ADD_CUSTOM_ANALYSIS', payload: analysis });
    resetCreateForm();
    setSelectedId(analysis.id);
  };

  const handleDeleteAnalysis = (analysis: CustomAnalysis) => {
    Alert.alert(
      language === 'bm' ? 'Padam Analisis' : 'Delete Analysis',
      language === 'bm'
        ? `Padam "${analysis.name}" dan semua rekodnya?`
        : `Delete "${analysis.name}" and all of its records?`,
      [
        { text: language === 'bm' ? 'Batal' : 'Cancel', style: 'cancel' },
        {
          text: language === 'bm' ? 'Padam' : 'Delete',
          style: 'destructive',
          onPress: async () => {
            await dispatch({ type: 'DELETE_CUSTOM_ANALYSIS', payload: analysis.id });
            if (selectedId === analysis.id) setSelectedId(null);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => (selected ? setSelectedId(null) : router.back())}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {!selected ? (
            <>
              <Text style={styles.title}>
                {language === 'bm' ? 'Analisis Lain' : 'Other Analyses'}
              </Text>
              <Text style={styles.description}>
                {language === 'bm'
                  ? 'Tambah sebarang ujian darah lain yang anda ingin pantau dan tetapkan julat normal anda sendiri.'
                  : 'Add any other blood analysis you want to track and set your own normal range.'}
              </Text>

              {analyses.length === 0 && !showCreateForm && (
                <View style={styles.emptyState}>
                  <Ionicons name="flask-outline" size={60} color="#CCCCCC" />
                  <Text style={styles.emptyText}>
                    {language === 'bm'
                      ? 'Tiada analisis lagi. Cipta analisis pertama anda!'
                      : 'No analyses yet. Create your first one!'}
                  </Text>
                </View>
              )}

              {analyses.map((analysis) => (
                <TouchableOpacity
                  key={analysis.id}
                  style={styles.analysisCard}
                  activeOpacity={0.8}
                  onPress={() => setSelectedId(analysis.id)}
                >
                  <View style={styles.analysisInfo}>
                    <Text style={styles.analysisName}>{analysis.name}</Text>
                    <Text style={styles.analysisMeta}>
                      {analysis.unit !== '-' ? `${analysis.unit} · ` : ''}
                      {analysis.normalLow != null && analysis.normalHigh != null
                        ? `${language === 'bm' ? 'Normal' : 'Normal'}: ${analysis.normalLow} - ${analysis.normalHigh}`
                        : analysis.normalHigh != null
                          ? `${language === 'bm' ? 'Normal' : 'Normal'}: < ${analysis.normalHigh}`
                          : analysis.normalLow != null
                            ? `${language === 'bm' ? 'Normal' : 'Normal'}: > ${analysis.normalLow}`
                            : language === 'bm'
                              ? 'Tiada julat ditetapkan'
                              : 'No range set'}
                      {' · '}
                      {analysis.data.length}{' '}
                      {language === 'bm' ? 'rekod' : analysis.data.length === 1 ? 'record' : 'records'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteAnalysis(analysis)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                  <Ionicons name="chevron-forward" size={22} color="#BBB" />
                </TouchableOpacity>
              ))}

              {!showCreateForm ? (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowCreateForm(true)}
                >
                  <Text style={styles.addButtonText}>
                    {language === 'bm' ? '+ Cipta Analisis Baru' : '+ Create New Analysis'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.addForm}>
                  <Text style={styles.formTitle}>
                    {language === 'bm' ? 'Analisis Baru' : 'New Analysis'}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder={
                      language === 'bm' ? 'Nama (cth: Hemoglobin)' : 'Name (e.g: Haemoglobin)'
                    }
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={language === 'bm' ? 'Unit (cth: g/dL)' : 'Unit (e.g: g/dL)'}
                    value={unit}
                    onChangeText={setUnit}
                    placeholderTextColor="#999"
                  />
                  <View style={styles.rangeRow}>
                    <TextInput
                      style={[styles.input, styles.rangeInput]}
                      placeholder={language === 'bm' ? 'Normal rendah' : 'Normal low'}
                      value={low}
                      onChangeText={setLow}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                    <TextInput
                      style={[styles.input, styles.rangeInput]}
                      placeholder={language === 'bm' ? 'Normal tinggi' : 'Normal high'}
                      value={high}
                      onChangeText={setHigh}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.formButtons}>
                    <TouchableOpacity
                      style={[styles.formButton, styles.cancelButton]}
                      onPress={resetCreateForm}
                    >
                      <Text style={styles.cancelButtonText}>
                        {language === 'bm' ? 'Batal' : 'Cancel'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.formButton, styles.saveButton]}
                      onPress={handleCreate}
                    >
                      <Text style={styles.saveButtonText}>
                        {language === 'bm' ? 'Cipta' : 'Create'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          ) : (
            <>
              <Text style={styles.title}>{selected.name}</Text>
              <MetricPanel
                language={language}
                series={[
                  {
                    key: selected.id,
                    label: { en: selected.name, bm: selected.name },
                    unit: selected.unit,
                    color: SmartColors.track,
                    chartType: 'line',
                    normalRange:
                      selected.normalLow != null || selected.normalHigh != null
                        ? { low: selected.normalLow, high: selected.normalHigh }
                        : undefined,
                    placeholder: {
                      en: `${selected.name} value`,
                      bm: `Nilai ${selected.name}`,
                    },
                    points: selected.data,
                    onAdd: (point) =>
                      dispatch({ type: 'ADD_CUSTOM_POINT', payload: { id: selected.id, point } }),
                    onEdit: (index, point) =>
                      dispatch({
                        type: 'EDIT_CUSTOM_POINT',
                        payload: { id: selected.id, index, point },
                      }),
                    onDelete: (index) =>
                      dispatch({
                        type: 'DELETE_CUSTOM_POINT',
                        payload: { id: selected.id, index },
                      }),
                  },
                ]}
              />
            </>
          )}
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
  analysisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00000012',
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analysisInfo: {
    flex: 1,
  },
  analysisName: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#333',
  },
  analysisMeta: {
    fontSize: 13,
    fontFamily: 'MontserratMedium',
    color: '#888',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFE6E6',
  },
  addButton: {
    backgroundColor: SmartColors.track,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
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
    marginTop: 8,
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
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'MontserratMedium',
    color: '#333',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rangeInput: {
    flex: 1,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  formButton: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#666',
  },
  saveButton: {
    backgroundColor: SmartColors.track,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#FFFFFF',
  },
});
