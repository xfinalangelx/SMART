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
  TextInput,
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAppData } from '@/contexts/AppDataContext';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { VaccineKey } from '@/lib/supabase';
import { SmartColors } from '@/constants/theme';

type ListEntry = {
  /** Built-in vaccines carry their state key; custom entries carry `custom:<id>`. */
  refKey: string;
  isCustom: boolean;
  title: string;
  dateFirst: string;
  dateSecond: string;
};

const VACCINE_ORDER: VaccineKey[] = [
  'influenza',
  'pneumococcal',
  'pneumo13',
  'pneumo20',
  'pneumo23',
  'hepatitisB',
  'menACWY',
  'menB',
  'hpv',
];

export default function VaccinationScreen() {
  const { state, dispatch } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const [selectedItem, setSelectedItem] = useState<ListEntry | null>(null);
  const [firstDate, setFirstDate] = useState(new Date());
  const [secondDate, setSecondDate] = useState(new Date());
  const [showFirstPicker, setShowFirstPicker] = useState(false);
  const [showSecondPicker, setShowSecondPicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
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
        <ActivityIndicator size="large" color={SmartColors.manage} />
      </View>
    );
  }

  const vaccineMap = state.appData.checkList.vaccine;
  const customVaccines = state.appData.checkList.customVaccines || [];

  const entries: ListEntry[] = [
    ...VACCINE_ORDER.filter((key) => vaccineMap[key]).map((key) => ({
      refKey: key as string,
      isCustom: false,
      title: vaccineMap[key].title,
      dateFirst: vaccineMap[key].dateFirst,
      dateSecond: vaccineMap[key].dateSecond,
    })),
    ...customVaccines.map((item) => ({
      refKey: `custom:${item.id}`,
      isCustom: true,
      title: item.title,
      dateFirst: item.dateFirst,
      dateSecond: item.dateSecond,
    })),
  ];

  const handleUpdate = async () => {
    if (!selectedItem) return;

    const dateFirst = moment(firstDate).format('YYYY/MM/DD');
    const dateSecond = moment(secondDate).format('YYYY/MM/DD');

    if (selectedItem.isCustom) {
      const id = selectedItem.refKey.replace('custom:', '');
      await dispatch({
        type: 'UPDATE_CUSTOM_VACCINE',
        payload: { id, patch: { dateFirst, dateSecond } },
      });
    } else {
      const key = selectedItem.refKey as VaccineKey;
      await dispatch({
        type: 'MODIFY_VACCINE',
        payload: { key, item: { ...vaccineMap[key], dateFirst, dateSecond } },
      });
    }

    setSelectedItem(null);
    Alert.alert(
      language === 'bm' ? 'Berjaya' : 'Success',
      language === 'bm' ? 'Rekod berjaya dikemaskini' : 'Record updated successfully'
    );
  };

  const handleAddCustom = async () => {
    if (!newTitle.trim()) {
      Alert.alert(
        language === 'bm' ? 'Ralat' : 'Error',
        language === 'bm' ? 'Sila masukkan nama' : 'Please enter a name'
      );
      return;
    }
    await dispatch({
      type: 'ADD_CUSTOM_VACCINE',
      payload: {
        id: Date.now().toString(),
        title: newTitle.trim(),
        dateFirst: 'XXXX/XX/XX',
        dateSecond: 'XXXX/XX/XX',
      },
    });
    setNewTitle('');
    setShowAddForm(false);
  };

  const handleDeleteCustom = (entry: ListEntry) => {
    Alert.alert(
      language === 'bm' ? 'Padam' : 'Delete',
      language === 'bm' ? `Padam "${entry.title}"?` : `Delete "${entry.title}"?`,
      [
        { text: language === 'bm' ? 'Batal' : 'Cancel', style: 'cancel' },
        {
          text: language === 'bm' ? 'Padam' : 'Delete',
          style: 'destructive',
          onPress: () =>
            dispatch({
              type: 'DELETE_CUSTOM_VACCINE',
              payload: entry.refKey.replace('custom:', ''),
            }),
        },
      ]
    );
  };

  const handleSelectItem = (item: ListEntry) => {
    setSelectedItem(item);

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
          <Ionicons
            name={item.isCustom ? 'clipboard' : 'medkit'}
            size={54}
            color={SmartColors.manage}
          />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtext}>
              {language === 'bm' ? 'Suntikan terakhir: ' : 'Last inject: '}
              {item.dateFirst}
            </Text>
            <Text style={styles.cardSubtext}>
              {language === 'bm' ? 'Suntikan seterusnya: ' : 'Next injection: '}
              {item.dateSecond}
            </Text>
            <Text style={styles.cardSubtext}>
              {language === 'bm' ? 'Hari berbaki: ' : 'Days remaining: '}
              {remain}
            </Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => handleSelectItem(item)}>
              <Ionicons name="calendar-outline" size={28} color={SmartColors.manage} />
            </TouchableOpacity>
            {item.isCustom && (
              <TouchableOpacity onPress={() => handleDeleteCustom(item)}>
                <Ionicons name="trash-outline" size={26} color="#FF3B30" />
              </TouchableOpacity>
            )}
          </View>
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

      <Text style={styles.title}>{language === 'bm' ? 'Vaksinasi' : 'Vaccination'}</Text>

      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.refKey}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(true)}>
            <Ionicons name="add-circle-outline" size={22} color="#FFF" />
            <Text style={styles.addButtonText}>
              {language === 'bm' ? 'Tambah Lain-lain' : 'Add Others'}
            </Text>
          </TouchableOpacity>
        }
      />

      {/* Add custom item modal */}
      <Modal visible={showAddForm} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {language === 'bm' ? 'Tambah Senarai Lain' : 'Add Other Checklist Item'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                language === 'bm' ? 'Nama (cth: Vaksin Hepatitis A)' : 'Name (e.g: Hepatitis A vaccine)'
              }
              value={newTitle}
              onChangeText={setNewTitle}
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.updateButton]} onPress={handleAddCustom}>
                <Text style={styles.buttonText}>{language === 'bm' ? 'Tambah' : 'Add'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddForm(false);
                  setNewTitle('');
                }}
              >
                <Text style={styles.buttonText}>{language === 'bm' ? 'Batal' : 'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Modal */}
      <Modal visible={selectedItem !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedItem?.title}</Text>

            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>{language === 'bm' ? 'Tarikh pertama:' : 'First date:'}</Text>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowFirstPicker(true)}>
                <Text style={styles.dateText}>{moment(firstDate).format('DD/MM/YYYY')}</Text>
                <Ionicons name="calendar-outline" size={20} color={SmartColors.manage} />
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
                <Ionicons name="calendar-outline" size={20} color={SmartColors.manage} />
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
    paddingBottom: 40,
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
    gap: 20,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 15,
    marginBottom: 6,
  },
  cardSubtext: {
    fontFamily: 'MontserratMedium',
    fontSize: 10,
    marginTop: 3,
  },
  cardRight: {
    alignItems: 'center',
    gap: 24,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: SmartColors.manage,
    borderRadius: 10,
    padding: 15,
    marginTop: 4,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    fontFamily: 'MontserratMedium',
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
