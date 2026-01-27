import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAppData } from '@/contexts/AppDataContext';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';

type JournalEntry = {
  id: string;
  date: string;
  entry: string;
};

export default function JournalScreen() {
  const { state, dispatch } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState('');
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

  const journals = state?.appData?.checkList?.journal || [];

  const handleAddEntry = async () => {
    if (!newEntry || newEntry.trim().length === 0) {
      Alert.alert(
        language === 'bm' ? 'Ralat' : 'Error',
        language === 'bm' ? 'Sila masukkan catatan' : 'Please enter an entry'
      );
      return;
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: moment().format('YYYY-MM-DD'),
      entry: newEntry.trim(),
    };

    try {
      await dispatch({ type: 'ADD_JOURNAL', payload: entry });
      setNewEntry('');
      setShowAddForm(false);
      Alert.alert(
        language === 'bm' ? 'Berjaya' : 'Success',
        language === 'bm' ? 'Catatan berjaya ditambah' : 'Entry added successfully'
      );
    } catch (error) {
      Alert.alert(
        language === 'bm' ? 'Ralat' : 'Error',
        language === 'bm' ? 'Gagal menambah catatan' : 'Failed to add entry'
      );
    }
  };

  const handleDeleteEntry = (id: string) => {
    Alert.alert(
      language === 'bm' ? 'Padam Catatan' : 'Delete Entry',
      language === 'bm' ? 'Adakah anda pasti?' : 'Are you sure?',
      [
        { text: language === 'bm' ? 'Batal' : 'Cancel', style: 'cancel' },
        {
          text: language === 'bm' ? 'Padam' : 'Delete',
          onPress: async () => {
            await dispatch({ type: 'DELETE_JOURNAL', payload: id });
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8F00FF" />
      </View>
    );
  }

  const sortedJournals = [...journals].sort((a, b) => 
    moment(b.date).diff(moment(a.date))
  );

  const renderJournal = ({ item }: { item: JournalEntry }) => (
    <View style={styles.journalCard}>
      <View style={styles.journalHeader}>
        <View>
          <Text style={styles.journalDate}>{moment(item.date).format('DD MMM YYYY')}</Text>
          <Text style={styles.journalDay}>{moment(item.date).format('dddd')}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteEntry(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
      <Text style={styles.journalText}>{item.entry}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Text style={styles.title}>{language === 'bm' ? 'Jurnal Kesihatan' : 'Health Journal'}</Text>

        <Text style={styles.description}>
          {language === 'bm'
            ? 'Catat perasaan dan pengalaman kesihatan harian anda.'
            : 'Record your daily health feelings and experiences.'}
        </Text>

        {journals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={60} color="#CCCCCC" />
            <Text style={styles.emptyText}>
              {language === 'bm' ? 'Tiada catatan lagi. Tambah catatan pertama anda!' : 'No entries yet. Add your first entry!'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedJournals}
            renderItem={renderJournal}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}

        {!showAddForm && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(true)}>
            <LinearGradient colors={['#8F00FF', '#B500B9']} style={styles.addButtonGradient} start={[0, 0]} end={[1, 0]}>
              <Text style={styles.addButtonText}>{language === 'bm' ? '+ Tambah Catatan' : '+ Add Entry'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {showAddForm && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>{language === 'bm' ? 'Catatan Baru' : 'New Entry'}</Text>

            <TextInput
              style={styles.input}
              placeholder={language === 'bm' ? 'Tulis perasaan anda hari ini...' : 'Write how you feel today...'}
              value={newEntry}
              onChangeText={setNewEntry}
              multiline
              numberOfLines={5}
              placeholderTextColor="#999"
            />

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddForm(false);
                  setNewEntry('');
                }}
              >
                <Text style={styles.cancelButtonText}>{language === 'bm' ? 'Batal' : 'Cancel'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.formButton, styles.saveButton]} onPress={handleAddEntry}>
                <LinearGradient colors={['#8F00FF', '#B500B9']} style={styles.saveButtonGradient} start={[0, 0]} end={[1, 0]}>
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
  journalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  journalDate: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#8F00FF',
  },
  journalDay: {
    fontSize: 12,
    fontFamily: 'MontserratMedium',
    color: '#999',
  },
  journalText: {
    fontSize: 15,
    fontFamily: 'MontserratMedium',
    color: '#333',
    lineHeight: 22,
  },
  addButton: {
    marginBottom: 20,
    marginTop: 10,
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
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formTitle: {
    fontSize: 20,
    fontFamily: 'MontserratBold',
    color: '#333',
    marginBottom: 16,
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
    minHeight: 120,
    textAlignVertical: 'top',
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
