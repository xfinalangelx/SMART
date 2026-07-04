import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAppData } from '@/contexts/AppDataContext';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { BloodTestItem } from '@/lib/supabase';
import { SmartColors } from '@/constants/theme';

type TestKey = 'renal' | 'liver' | 'glucose';

type ListEntry = BloodTestItem & { key: TestKey };

export default function BloodTestScreen() {
  const { state, dispatch } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const [selectedItem, setSelectedItem] = useState<ListEntry | null>(null);
  const [firstDate, setFirstDate] = useState(new Date());
  const [secondDate, setSecondDate] = useState(new Date());
  const [showFirstPicker, setShowFirstPicker] = useState(false);
  const [showSecondPicker, setShowSecondPicker] = useState(false);
  const [fastingReminder, setFastingReminder] = useState(false);
  const insets = useSafeAreaInsets();

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

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  const bloodTests: ListEntry[] = (['renal', 'liver', 'glucose'] as TestKey[]).map((key) => ({
    ...state.appData.checkList.bloodTest[key],
    key,
  }));

  const notificationsEnabled = state.appData.settings.notificationsEnabled;

  const handleUpdate = async () => {
    if (!selectedItem) return;

    const { key, ...item } = selectedItem;

    await dispatch({
      type: 'MODIFY_BLOOD_TEST',
      payload: {
        key,
        item: {
          ...item,
          dateFirst: moment(firstDate).format('YYYY/MM/DD'),
          dateSecond: moment(secondDate).format('YYYY/MM/DD'),
          fastingReminder,
        },
      },
    });

    setSelectedItem(null);
    Alert.alert(
      language === 'bm' ? 'Berjaya' : 'Success',
      language === 'bm' ? 'Ujian darah berjaya dikemaskini' : 'Blood test updated successfully'
    );
  };

  const handleSelectItem = (item: ListEntry) => {
    setSelectedItem(item);
    setFastingReminder(!!item.fastingReminder);

    if (item.dateFirst && item.dateFirst !== 'XXXX/XX/XX') {
      setFirstDate(new Date(item.dateFirst.replace(/\//g, '-')));
    } else {
      setFirstDate(new Date());
    }

    if (item.dateSecond && item.dateSecond !== 'XXXX/XX/XX') {
      setSecondDate(new Date(item.dateSecond.replace(/\//g, '-')));
    } else {
      setSecondDate(new Date());
    }
  };

  const renderItem = ({ item }: { item: ListEntry }) => {
    const today = new Date();
    let remain = 0;
    let color = 'green';

    if (item.dateSecond && item.dateSecond !== 'XXXX/XX/XX') {
      const tempDate = new Date(item.dateSecond.replace(/\//g, '-'));
      const diffInDays = Math.floor((tempDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      remain = diffInDays;

      if (diffInDays <= 7) {
        color = 'red';
      } else if (diffInDays <= 19) {
        color = 'orange';
      }
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <Ionicons name="water" size={60} color="#E91E63" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtext}>
              {language === 'bm' ? 'Tarikh diambil: ' : 'Date taken: '}
              {item.dateFirst}
            </Text>
            <Text style={styles.cardSubtext}>
              {language === 'bm' ? 'Tarikh seterusnya: ' : 'Next date: '}
              {item.dateSecond}
            </Text>
            <Text style={styles.cardSubtext}>
              {language === 'bm' ? 'Hari berbaki: ' : 'Days remaining: '}
              {remain}
            </Text>
            {item.fastingReminder && (
              <View style={styles.fastingChip}>
                <Ionicons name="moon" size={12} color="#7B61FF" />
                <Text style={styles.fastingChipText}>
                  {language === 'bm' ? 'Peringatan berpuasa' : 'Fasting reminder'}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.cardRight}>
          <TouchableOpacity onPress={() => handleSelectItem(item)}>
            <Ionicons name="calendar-outline" size={30} color="#E91E63" />
          </TouchableOpacity>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{remain}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{language === 'bm' ? 'Ujian Darah' : 'Blood Test'}</Text>

      <FlatList
        data={bloodTests}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.list}
      />

      {/* Update Modal */}
      <Modal visible={selectedItem !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedItem?.title}</Text>

            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>{language === 'bm' ? 'Tarikh pertama:' : 'First date:'}</Text>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowFirstPicker(true)}>
                <Text style={styles.dateText}>{moment(firstDate).format('DD/MM/YYYY')}</Text>
                <Ionicons name="calendar-outline" size={20} color="#E91E63" />
              </TouchableOpacity>
            </View>

            {showFirstPicker && (
              <DateTimePicker
                value={firstDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  setShowFirstPicker(Platform.OS === 'ios');
                  if (date) setFirstDate(date);
                }}
              />
            )}

            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>{language === 'bm' ? 'Tarikh kedua:' : 'Second date:'}</Text>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowSecondPicker(true)}>
                <Text style={styles.dateText}>{moment(secondDate).format('DD/MM/YYYY')}</Text>
                <Ionicons name="calendar-outline" size={20} color="#E91E63" />
              </TouchableOpacity>
            </View>

            {showSecondPicker && (
              <DateTimePicker
                value={secondDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  setShowSecondPicker(Platform.OS === 'ios');
                  if (date) setSecondDate(date);
                }}
                minimumDate={firstDate}
              />
            )}

            <View style={styles.fastingRow}>
              <View style={styles.fastingInfo}>
                <Text style={styles.dateLabel}>
                  {language === 'bm' ? 'Ingatkan saya berpuasa' : 'Remind me to fast'}
                </Text>
                <Text style={styles.fastingHint}>
                  {language === 'bm'
                    ? 'Peringatan pada 8 malam sebelum ujian (puasa 8-10 jam).'
                    : 'A reminder at 8pm the night before the test (fast 8-10 hours).'}
                </Text>
              </View>
              <Switch
                value={fastingReminder}
                onValueChange={setFastingReminder}
                trackColor={{ true: SmartColors.manage }}
              />
            </View>
            {fastingReminder && !notificationsEnabled && (
              <Text style={styles.fastingWarning}>
                {language === 'bm'
                  ? 'Nota: hidupkan notifikasi dalam Tetapan untuk menerima peringatan ini.'
                  : 'Note: turn on notifications in Settings to receive this reminder.'}
              </Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.updateButton]} onPress={handleUpdate}>
                <Text style={styles.buttonText}>{language === 'bm' ? 'Kemaskini' : 'Update'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setSelectedItem(null)}>
                <Text style={styles.buttonText}>{language === 'bm' ? 'Batal' : 'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 18,
    fontFamily: 'MontserratSemiBold',
    marginLeft: 17,
    marginTop: 21,
    marginBottom: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#00000040',
    borderRadius: 10,
    padding: 18,
    marginBottom: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 24,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 16,
    marginBottom: 6,
  },
  cardSubtext: {
    fontFamily: 'MontserratMedium',
    fontSize: 10,
    marginTop: 3,
  },
  fastingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0EBFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  fastingChipText: {
    fontSize: 10,
    fontFamily: 'MontserratSemiBold',
    color: '#7B61FF',
  },
  cardRight: {
    alignItems: 'center',
    gap: 40,
  },
  badge: {
    borderRadius: 400,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: 'white',
    fontFamily: 'MontserratBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  dateRow: {
    marginVertical: 10,
  },
  dateLabel: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'MontserratMedium',
  },
  fastingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    gap: 12,
  },
  fastingInfo: {
    flex: 1,
  },
  fastingHint: {
    fontFamily: 'MontserratMedium',
    fontSize: 12,
    color: '#777',
  },
  fastingWarning: {
    fontFamily: 'MontserratMedium',
    fontSize: 12,
    color: '#E65100',
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'MontserratSemiBold',
  },
});
