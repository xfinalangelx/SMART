import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAppData } from '@/contexts/AppDataContext';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CheckItem = {
  id: string;
  title: string;
  bmTitle: string;
  navi: string;
  icon: any;
};

export default function AllChecklistScreen() {
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

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8F00FF" />
      </View>
    );
  }

  const allItems: CheckItem[] = [
    {
      id: '1',
      title: 'Vaccination',
      bmTitle: 'Vaksinasi',
      navi: 'vaccination',
      icon: require('../../assets/img/vaccinelist.png'),
    },
    {
      id: '2',
      title: 'Blood Test',
      bmTitle: 'Ujian Darah',
      navi: 'blood-test',
      icon: require('../../assets/img/testlist.png'),
    },
    {
      id: '3',
      title: 'Appointments',
      bmTitle: 'Temu Janji',
      navi: 'appointments',
      icon: require('../../assets/img/appointment.png'),
    },
    {
      id: '4',
      title: 'Health Journal',
      bmTitle: 'Jurnal Kesihatan',
      navi: 'journal',
      icon: require('../../assets/img/journal.png'),
    },
  ];

  const renderItem = ({ item }: { item: CheckItem }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => router.push(`/(screens)/${item.navi}` as any)}
      style={styles.card}
    >
      <Image source={item.icon} style={styles.cardIcon} />
      <Text style={styles.cardTitle}>{language === 'bm' ? item.bmTitle : item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{language === 'bm' ? 'Semua Senarai' : 'All Checklists'}</Text>

      <View style={styles.imageContainer}>
        <Image source={require('../../assets/img/checklistCover.png')} style={styles.coverImage} resizeMode="contain" />
      </View>

      <FlatList
        data={allItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
  title: {
    fontSize: 18,
    fontFamily: 'MontserratSemiBold',
    marginLeft: 17,
    marginTop: 21,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
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
    marginRight: 42,
  },
  cardTitle: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 16,
  },
});
