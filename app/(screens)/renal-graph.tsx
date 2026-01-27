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
import { useState, useEffect } from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartesianChart, Line } from 'victory-native';
import { useFont } from '@shopify/react-native-skia';

type GraphDataPoint = {
  date: string;
  value: number;
};

export default function RenalGraphScreen() {
  const { state, dispatch } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const insets = useSafeAreaInsets();

  const font = useFont(require('../../assets/fonts/Montserrat-Medium.ttf'), 12);

  const [loaded] = useFonts({
    MontserratBold: require('../../assets/fonts/Montserrat-Bold.ttf'),
    MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratMedium: require('../../assets/fonts/Montserrat-Medium.ttf'),
  });

  useEffect(() => {
    if (state?.appData?.settings) {
      setLanguage(state.appData.settings.language);
    }
  }, [state]);

  const handleAddData = async () => {
    const valueNum = parseFloat(newValue);
    
    if (!newValue || isNaN(valueNum) || valueNum < 0) {
      Alert.alert(
        language === 'bm' ? 'Ralat' : 'Error',
        language === 'bm' ? 'Sila masukkan nilai yang sah' : 'Please enter a valid value'
      );
      return;
    }

    const dataPoint: GraphDataPoint = {
      date: moment(selectedDate).format('YYYY-MM-DD'),
      value: valueNum,
    };

    try {
      await dispatch({ type: 'ADD_RENAL', payload: dataPoint });
      
      setNewValue('');
      setSelectedDate(new Date());
      setShowAddForm(false);
      
      Alert.alert(
        language === 'bm' ? 'Berjaya' : 'Success',
        language === 'bm' ? 'Data berjaya ditambah' : 'Data added successfully'
      );
    } catch (error) {
      console.error('Error adding renal data:', error);
      Alert.alert(
        language === 'bm' ? 'Ralat' : 'Error',
        language === 'bm' ? 'Gagal menambah data' : 'Failed to add data'
      );
    }
  };

  if (!loaded || !font) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const graphData = state?.appData?.graphData?.renal || [];

  const chartData = Array.isArray(graphData) && graphData.length > 0
    ? graphData
        .filter((item: any) => item && item.date && item.value != null)
        .map((item: GraphDataPoint, index: number) => ({
          x: index,
          y: typeof item.value === 'number' ? item.value : parseFloat(String(item.value)) || 0,
          label: moment(item.date).format('MMM DD'),
        }))
    : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>{language === 'bm' ? 'Profil Renal' : 'Renal Profile'}</Text>

          <Text style={styles.description}>
            {language === 'bm'
              ? 'Jejaki fungsi buah pinggang anda.'
              : 'Track your kidney function.'}
          </Text>

          {chartData.length > 0 ? (
            <View style={styles.chartCard}>
              <CartesianChart
                data={chartData}
                xKey="x"
                yKeys={['y']}
                domainPadding={{ left: 50, right: 50, top: 30, bottom: 30 }}
              >
                {({ points }) => (
                  <Line
                    points={points.y}
                    color="#4CAF50"
                    strokeWidth={3}
                    animate={{ type: 'timing', duration: 300 }}
                  />
                )}
              </CartesianChart>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="stats-chart-outline" size={60} color="#CCCCCC" />
              <Text style={styles.emptyText}>
                {language === 'bm' ? 'Tiada data tersedia. Tambah bacaan pertama anda!' : 'No data available. Add your first reading!'}
              </Text>
            </View>
          )}

          {graphData.length > 0 && (
            <View style={styles.dataListContainer}>
              <Text style={styles.dataListTitle}>{language === 'bm' ? 'Rekod Terdahulu' : 'Previous Records'}</Text>
              <ScrollView 
                style={styles.dataListScroll} 
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {[...graphData].reverse().map((item: GraphDataPoint, reverseIndex: number) => {
                  const actualIndex = graphData.length - 1 - reverseIndex;
                  return (
                    <View key={reverseIndex} style={styles.dataItem}>
                      <View style={styles.dataInfo}>
                        <Text style={styles.dataDate}>{moment(item.date).format('DD MMM YYYY')}</Text>
                        <Text style={styles.dataValue}>{item.value} eGFR</Text>
                      </View>
                      <View style={styles.dataActions}>
                        <TouchableOpacity
                          onPress={() => {
                            alert(language === 'bm' ? 'Kemaskini akan datang' : 'Edit coming soon');
                          }}
                          style={styles.editButton}
                        >
                          <Ionicons name="pencil" size={20} color="#4CAF50" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            Alert.alert(
                              language === 'bm' ? 'Padam Rekod' : 'Delete Record',
                              language === 'bm' ? 'Padam rekod ini?' : 'Delete this record?',
                              [
                                { text: language === 'bm' ? 'Batal' : 'Cancel', style: 'cancel' },
                                {
                                  text: language === 'bm' ? 'Padam' : 'Delete',
                                  style: 'destructive',
                                  onPress: () => {
                                    dispatch({ type: 'DELETE_RENAL', payload: actualIndex });
                                  },
                                },
                              ]
                            );
                          }}
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
              <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.addButtonGradient} start={[0, 0]} end={[1, 0]}>
                <Text style={styles.addButtonText}>{language === 'bm' ? '+ Tambah Bacaan' : '+ Add Reading'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {showAddForm && (
            <View style={styles.addForm}>
              <Text style={styles.formTitle}>{language === 'bm' ? 'Tambah Bacaan Baru' : 'Add New Reading'}</Text>

              <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color="#4CAF50" style={{ marginRight: 8 }} />
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
                placeholder={language === 'bm' ? 'Nilai eGFR (cth: 90)' : 'eGFR Value (e.g: 90)'}
                value={newValue}
                onChangeText={setNewValue}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddForm(false);
                    setNewValue('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>{language === 'bm' ? 'Batal' : 'Cancel'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.formButton, styles.saveButton]} onPress={handleAddData}>
                  <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.saveButtonGradient} start={[0, 0]} end={[1, 0]}>
                    <Text style={styles.saveButtonText}>{language === 'bm' ? 'Simpan' : 'Save'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
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
  },
  title: {
    fontSize: 24,
    fontFamily: 'MontserratBold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'MontserratMedium',
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    height: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    maxHeight: 300, // Fixed height - scrollable
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
    color: '#4CAF50',
    marginTop: 4,
  },
  dataActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
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
    fontSize: 18,
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
