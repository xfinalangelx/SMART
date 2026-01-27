import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAppData } from '@/contexts/AppDataContext';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

type AppItem = {
  id: string;
  name: string;
  url?: string;
  description?: string;
};

export default function AppsScreen() {
  const { state } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchApps();
  }, []);

  async function fetchApps() {
    try {
      setLoading(true);
      
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('name');
      
      if (error) {
        console.log('No apps table, using static data');
        // Fallback to static data - useful HIV/AIDS apps
        setApps([
          {
            id: '1',
            name: 'MySejahtera',
            url: 'https://mysejahtera.malaysia.gov.my',
            description: language === 'bm' 
              ? 'Aplikasi kesihatan rasmi Malaysia'
              : 'Official Malaysia health application',
          },
          {
            id: '2',
            name: 'TeleHealth',
            url: 'https://www.doctoroncall.com.my',
            description: language === 'bm'
              ? 'Perkhidmatan kesihatan dalam talian'
              : 'Online healthcare services',
          },
          {
            id: '3',
            name: 'MyHEALTH Portal',
            url: 'http://www.myhealth.gov.my',
            description: language === 'bm'
              ? 'Portal maklumat kesihatan KKM'
              : 'MOH health information portal',
          },
        ]);
      } else {
        setApps(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const openApp = (url: string | undefined, name: string) => {
    if (!url) {
      Alert.alert(
        language === 'bm' ? 'Maklumat' : 'Info',
        language === 'bm' 
          ? `${name} tidak mempunyai pautan`
          : `${name} has no link available`
      );
      return;
    }

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(
          language === 'bm' ? 'Ralat' : 'Error',
          language === 'bm' 
            ? `Tidak dapat membuka ${name}`
            : `Cannot open ${name}`
        );
      }
    });
  };

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9C27B0" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: AppItem }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => openApp(item.url, item.name)}
      style={styles.card}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="phone-portrait" size={32} color="#9C27B0" />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
        {item.url && (
          <View style={styles.urlContainer}>
            <Ionicons name="link" size={16} color="#9C27B0" />
            <Text style={styles.urlText} numberOfLines={1}>
              {item.url}
            </Text>
          </View>
        )}
      </View>

      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        {language === 'bm' ? 'Aplikasi Lain-lain' : 'Other Applications'}
      </Text>

      <Text style={styles.subtitle}>
        {language === 'bm' 
          ? 'Tekan untuk membuka aplikasi'
          : 'Tap to open application'}
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9C27B0" />
          <Text style={styles.loadingText}>
            {language === 'bm' ? 'Memuatkan...' : 'Loading...'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={apps}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'MontserratMedium',
    color: '#666',
  },
  header: {
    marginTop: 21,
    marginLeft: 11,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: 'MontserratBold',
    marginLeft: 17,
    marginTop: 8,
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'MontserratMedium',
    marginLeft: 17,
    marginBottom: 16,
    color: '#666',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#00000040',
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'MontserratBold',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 12,
    fontFamily: 'MontserratMedium',
    color: '#666',
    marginBottom: 6,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  urlText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'MontserratMedium',
    color: '#9C27B0',
  },
});
