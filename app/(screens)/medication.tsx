import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAppData } from '@/contexts/AppDataContext';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAllMedicines, MedicineEntry } from '@/utils/medicineHelper';
import { SmartColors } from '@/constants/theme';

type MedicationCategory = {
  id: number;
  name: string;
  fullName: string;
  bmFullName: string;
  icon: any;
  filter: string;
};

const categories: MedicationCategory[] = [
  {
    id: 1,
    name: 'NRTI',
    fullName: 'Nucleoside Reverse Transcriptase Inhibitors',
    bmFullName: 'Nucleoside Reverse Transcriptase Inhibitors',
    icon: require('../../assets/img/medicineIcon.png'),
    filter: 'nrti',
  },
  {
    id: 2,
    name: 'NNRTI',
    fullName: 'Non-Nucleoside Reverse Transcriptase Inhibitors',
    bmFullName: 'Non-Nucleoside Reverse Transcriptase Inhibitors',
    icon: require('../../assets/img/medicineIcon.png'),
    filter: 'nnrti',
  },
  {
    id: 3,
    name: 'PI',
    fullName: 'Protease Inhibitors',
    bmFullName: 'Protease Inhibitors',
    icon: require('../../assets/img/medicineIcon.png'),
    filter: 'pi',
  },
  {
    id: 4,
    name: 'II',
    fullName: 'Integrase Inhibitors',
    bmFullName: 'Integrase Inhibitors',
    icon: require('../../assets/img/medicineIcon.png'),
    filter: 'ii',
  },
  {
    id: 5,
    name: 'Combination',
    fullName: 'Fixed-Dose Combinations',
    bmFullName: 'Kombinasi Dos Tetap',
    icon: require('../../assets/img/medicineIcon.png'),
    filter: 'combination',
  },
];

export default function MedicationScreen() {
  const { state } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const [sortBy, setSortBy] = useState<'class' | 'name'>('class');
  const insets = useSafeAreaInsets();

  const [loaded] = useFonts({
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
        <ActivityIndicator size="large" color={SmartColors.learn} />
      </View>
    );
  }

  const renderCategory = ({ item }: { item: MedicationCategory }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() =>
        router.push(`/(screens)/med-category?filter=${item.filter}&name=${item.name}` as any)
      }
      style={styles.card}
    >
      <Image source={item.icon} style={styles.cardIcon} />
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>
          {language === 'bm' ? item.bmFullName : item.fullName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMedicine = ({ item }: { item: MedicineEntry }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() =>
        router.push(
          `/(screens)/medicine-detail?filter=${item.id}&name=${item.name}&category=${item.categoryKey}` as any
        )
      }
      style={styles.card}
    >
      <Image source={item.image} style={styles.cardIcon} resizeMode="contain" />
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.brand}</Text>
      </View>
      <Text style={styles.classChip}>{item.categoryKey === 'combination' ? 'Combo' : item.categoryKey.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{language === 'en' ? 'Medication' : 'Perubatan'}</Text>

      {/* Arrange by medication class or by medication name */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>
          {language === 'bm' ? 'Susun mengikut:' : 'Arrange by:'}
        </Text>
        <View style={styles.sortToggle}>
          <TouchableOpacity
            onPress={() => setSortBy('class')}
            style={[styles.sortButton, sortBy === 'class' && styles.sortButtonActive]}
          >
            <Text style={[styles.sortButtonText, sortBy === 'class' && styles.sortButtonTextActive]}>
              {language === 'bm' ? 'Kelas Ubat' : 'Class'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSortBy('name')}
            style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]}
          >
            <Text style={[styles.sortButtonText, sortBy === 'name' && styles.sortButtonTextActive]}>
              {language === 'bm' ? 'Nama Ubat (A-Z)' : 'Name (A-Z)'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {sortBy === 'class' ? (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/img/MedicineCover.png')}
                style={styles.coverImage}
                resizeMode="contain"
              />
            </View>
          }
        />
      ) : (
        <FlatList
          data={getAllMedicines(language)}
          renderItem={renderMedicine}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
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
  title: {
    fontSize: 18,
    fontFamily: 'MontserratSemiBold',
    marginLeft: 17,
    marginTop: 21,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 17,
    marginTop: 14,
    marginBottom: 6,
    gap: 10,
  },
  sortLabel: {
    fontFamily: 'MontserratMedium',
    fontSize: 13,
    color: '#666',
  },
  sortToggle: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 3,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  sortButtonActive: {
    backgroundColor: SmartColors.learn,
  },
  sortButtonText: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 12,
    color: '#777',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  coverImage: {
    height: 197,
    width: 200,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#00000040',
    borderRadius: 10,
    padding: 20,
    marginBottom: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cardIcon: {
    width: 40,
    height: 40,
  },
  cardText: {
    marginLeft: 22,
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 16,
  },
  cardSubtitle: {
    fontFamily: 'MontserratMedium',
    fontSize: 10,
    color: 'gray',
    marginTop: 2,
  },
  classChip: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 10,
    color: SmartColors.learn,
    backgroundColor: '#E8F8F4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
