import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Appointment = {
  id: string;
  date: string;
  time: string;
  title: string;
  notes?: string;
};

export default function AppointmentsScreen() {
  const { state, dispatch } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
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

  const appointments = state?.appData?.checkList?.appointment || [];

  const handleAddAppointment = async () => {
    if (!title.trim()) {
      Alert.alert(
        language === 'bm' ? 'Ralat' : 'Error',
        language === 'bm' ? 'Sila masukkan tajuk temu janji' : 'Please enter appointment title'
      );
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      date: moment(selectedDate).format('YYYY-MM-DD'),
      time: moment(selectedTime).format('HH:mm'),
      title: title.trim(),
      notes: notes.trim(),
    };

    await dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });

    setTitle('');
    setNotes('');
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setShowAddForm(false);

    Alert.alert(
      language === 'bm' ? 'Berjaya' : 'Success',
      language === 'bm' ? 'Temu janji berjaya ditambah' : 'Appointment added successfully'
    );
  };

  const handleDeleteAppointment = (id: string) => {
    Alert.alert(
      language === 'bm' ? 'Padam Temu Janji' : 'Delete Appointment',
      language === 'bm' ? 'Adakah anda pasti?' : 'Are you sure?',
      [
        { text: language === 'bm' ? 'Batal' : 'Cancel', style: 'cancel' },
        {
          text: language === 'bm' ? 'Padam' : 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = appointments.filter((apt: Appointment) => apt.id !== id);
            await dispatch({ type: 'MODIFY_APPOINTMENT', payload: updated });
          },
        },
      ]
    );
  };

  // Sort appointments by date and time
  const sortedAppointments = [...appointments].sort((a: Appointment, b: Appointment) => {
    const dateTimeA = moment(`${a.date} ${a.time}`);
    const dateTimeB = moment(`${b.date} ${b.time}`);
    return dateTimeB.diff(dateTimeA);
  });

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8F00FF" />
      </View>
    );
  }

  const renderAppointment = ({ item }: { item: Appointment }) => {
    const isPast = moment(`${item.date} ${item.time}`).isBefore(moment());

    return (
      <View style={[styles.appointmentCard, isPast && styles.pastAppointment]}>
        <View style={styles.appointmentHeader}>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.appointmentDate}>{moment(item.date).format('DD MMM YYYY')}</Text>
            <Text style={styles.appointmentTime}>{moment(item.time, 'HH:mm').format('hh:mm A')}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteAppointment(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
        <Text style={styles.appointmentTitle}>{item.title}</Text>
        {item.notes && <Text style={styles.appointmentNotes}>{item.notes}</Text>}
        {isPast && (
          <View style={styles.pastBadge}>
            <Text style={styles.pastBadgeText}>
              {language === 'bm' ? 'Lepas' : 'Past'}
            </Text>
          </View>
        )}
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
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Text style={styles.title}>
          {language === 'bm' ? 'Temu Janji' : 'Appointments'}
        </Text>

        <Text style={styles.description}>
          {language === 'bm'
            ? 'Urus temu janji perubatan anda.'
            : 'Manage your medical appointments.'}
        </Text>

        {appointments.length > 0 ? (
          <FlatList
            data={sortedAppointments}
            renderItem={renderAppointment}
            keyExtractor={(item: Appointment) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={60} color="#CCCCCC" />
            <Text style={styles.emptyText}>
              {language === 'bm'
                ? 'Tiada temu janji. Tambah satu sekarang!'
                : 'No appointments. Add one now!'}
            </Text>
          </View>
        )}

        {!showAddForm && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(true)}>
            <LinearGradient
              colors={['#8F00FF', '#B500B9']}
              style={styles.addButtonGradient}
              start={[0, 0]}
              end={[1, 0]}
            >
              <Text style={styles.addButtonText}>
                {language === 'bm' ? '+ Tambah Temu Janji' : '+ Add Appointment'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {showAddForm && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>
              {language === 'bm' ? 'Temu Janji Baru' : 'New Appointment'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder={language === 'bm' ? 'Tajuk (cth: Lawatan Doktor)' : 'Title (e.g: Doctor Visit)'}
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#999"
            />

            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={20} color="#8F00FF" />
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
                minimumDate={new Date()}
              />
            )}

            <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
              <Ionicons name="time-outline" size={20} color="#8F00FF" />
              <Text style={styles.dateButtonText}>
                {moment(selectedTime).format('hh:mm A')}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, time) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (time) setSelectedTime(time);
                }}
              />
            )}

            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder={language === 'bm' ? 'Nota (pilihan)' : 'Notes (optional)'}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddForm(false);
                  setTitle('');
                  setNotes('');
                }}
              >
                <Text style={styles.cancelButtonText}>{language === 'bm' ? 'Batal' : 'Cancel'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.formButton, styles.saveButton]} onPress={handleAddAppointment}>
                <LinearGradient
                  colors={['#8F00FF', '#B500B9']}
                  style={styles.saveButtonGradient}
                  start={[0, 0]}
                  end={[1, 0]}
                >
                  <Text style={styles.saveButtonText}>{language === 'bm' ? 'Simpan' : 'Save'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pastAppointment: {
    opacity: 0.6,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dateTimeContainer: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#8F00FF',
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 12,
    fontFamily: 'MontserratMedium',
    color: '#999',
  },
  deleteButton: {
    padding: 4,
  },
  appointmentTitle: {
    fontSize: 18,
    fontFamily: 'MontserratSemiBold',
    color: '#333',
    marginBottom: 4,
  },
  appointmentNotes: {
    fontSize: 14,
    fontFamily: 'MontserratMedium',
    color: '#666',
    lineHeight: 20,
  },
  pastBadge: {
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  pastBadgeText: {
    fontSize: 12,
    fontFamily: 'MontserratSemiBold',
    color: '#F57C00',
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
  addButton: {
    marginVertical: 20,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontFamily: 'MontserratBold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'MontserratMedium',
    color: '#333',
    marginBottom: 12,
  },
  notesInput: {
    height: 100,
  },
  dateButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateButtonText: {
    fontSize: 16,
    fontFamily: 'MontserratMedium',
    color: '#333',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
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
