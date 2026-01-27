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
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAppData } from '@/contexts/AppDataContext';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

type BloodTestItem = {
  id: string;
  title: string;
  dateFirst: string;
  dateSecond: string;
  firstCap: string;
  secondCap: string;
};

export default function BloodTestScreen() {
  const { state, dispatch } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const [selectedItem, setSelectedItem] = useState<BloodTestItem | null>(null);
  const [firstDate, setFirstDate] = useState(new Date());
  const [secondDate, setSecondDate] = useState(new Date());
  const [showFirstPicker, setShowFirstPicker] = useState(false);
  const [showSecondPicker, setShowSecondPicker] = useState(false);
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
        <ActivityIndicator size="large" color="#8F00FF" />
      </View>
    );
  }

  const bloodTests = [
    state.appData.checkList.bloodTest.renal,
    state.appData.checkList.bloodTest.liver,
    state.appData.checkList.bloodTest.glucose,
  ];

  const handleUpdate = () => {
    if (!selectedItem) return;

    const firstDateStr = moment(firstDate).format('YYYY/MM/DD');
    const secondDateStr = moment(secondDate).format('YYYY/MM/DD');

    const newData = {
      ...selectedItem,
      dateFirst: firstDateStr,
      dateSecond: secondDateStr,
    };

    console.log('📊 Updating blood test:', selectedItem.id, selectedItem.title);
    console.log('📊 New dates:', firstDateStr, secondDateStr);
    console.log('📊 Full payload:', JSON.stringify(newData, null, 2));

    // Dispatch based on test ID (convert to number for comparison)
    const testId = typeof selectedItem.id === 'string' ? parseInt(selectedItem.id) : selectedItem.id;
    
    switch (testId) {
      case 6:
        dispatch({ type: 'MODIFY_RENAL_TEST', payload: newData });
        break;
      case 7:
        dispatch({ type: 'MODIFY_LIVER_TEST', payload: newData });
        break;
      case 8:
        dispatch({ type: 'MODIFY_GLUCOSE_TEST', payload: newData });
        break;
      default:
        console.error('❌ Unknown test ID:', testId);
    }

    console.log('✅ Dispatch called, check for Supabase save logs');

    setSelectedItem(null);
    Alert.alert(
      language === 'bm' ? 'Berjaya' : 'Success',
      language === 'bm' ? 'Ujian darah berjaya dikemaskini' : 'Blood test updated successfully'
    );
  };

  const handleSelectItem = (item: BloodTestItem) => {
    setSelectedItem(item);
    
    // Pre-fill dates with existing values
    if (item.dateFirst && item.dateFirst !== 'XXXX/XX/XX') {
      const firstStr = item.dateFirst.replace(/\//g, '-');
      setFirstDate(new Date(firstStr));
    } else {
      setFirstDate(new Date());
    }
    
    if (item.dateSecond && item.dateSecond !== 'XXXX/XX/XX') {
      const secondStr = item.dateSecond.replace(/\//g, '-');
      setSecondDate(new Date(secondStr));
    } else {
      setSecondDate(new Date());
    }
  };

  const renderItem = ({ item }: { item: BloodTestItem }) => {
    const today = new Date();
    let remain = 0;
    let color = 'green';

    if (item.dateSecond && item.dateSecond !== 'XXXX/XX/XX') {
      const tempString = item.dateSecond.replace(/\//g, '-');
      const tempDate = new Date(tempString);
      const diffInDays = Math.floor((tempDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      remain = diffInDays;

      if (diffInDays <= 7) {
        color = 'red';
      } else if (diffInDays >= 8 && diffInDays <= 19) {
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
        keyExtractor={(item) => item.id}
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
