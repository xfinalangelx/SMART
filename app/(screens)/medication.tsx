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

type MedicationCategory = {
  id: number;
  name: string;
  fullName: string;
  icon: any;
  filter: string;
};

export default function MedicationScreen() {
  const { state } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
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

  const categories: MedicationCategory[] = [
    {
      id: 1,
      name: 'NRTI',
      fullName: 'Nucleoside Reverse Transcriptase Inhibitors',
      icon: require('../../assets/img/medicineIcon.png'),
      filter: 'nrti',
    },
    {
      id: 2,
      name: 'PI',
      fullName: 'Progressive Inhibitors',
      icon: require('../../assets/img/medicineIcon.png'),
      filter: 'pi',
    },
    {
      id: 3,
      name: 'NNRTI',
      fullName: 'Non-Nucleoside Reverse Transcriptase Inhibitors',
      icon: require('../../assets/img/medicineIcon.png'),
      filter: 'nnrti',
    },
    {
      id: 4,
      name: 'NRTI & NNRTI',
      fullName: 'NNRTI & NNRTI',
      icon: require('../../assets/img/medicineIcon.png'),
      filter: 'nnnrti',
    },
    {
      id: 5,
      name: 'II',
      fullName: 'Integrase Inhibitor',
      icon: require('../../assets/img/medicineIcon.png'),
      filter: 'ii',
    },
  ];

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8F00FF" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: MedicationCategory }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => router.push(`/(screens)/med-category?filter=${item.filter}&name=${item.name}` as any)}
      style={styles.card}
    >
      <Image source={item.icon} style={styles.cardIcon} />
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.fullName}</Text>
      </View>
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

      <View style={styles.imageContainer}>
        <Image source={require('../../assets/img/MedicineCover.png')} style={styles.coverImage} resizeMode="contain" />
      </View>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
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
  imageContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  coverImage: {
    height: 197,
    width: 200,
  },
  list: {
    paddingHorizontal: 20,
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
});
