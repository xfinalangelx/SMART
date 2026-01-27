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

type WebsiteItem = {
  id: string;
  name: string;
  url: string;
  description?: string;
};

export default function WebsitesScreen() {
  const { state } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const [websites, setWebsites] = useState<WebsiteItem[]>([]);
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
    fetchWebsites();
  }, []);

  async function fetchWebsites() {
    try {
      setLoading(true);
      
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('name');
      
      if (error) {
        console.log('No websites table, using static data');
        // Fallback to static data
        setWebsites([
          {
            id: '1',
            name: 'World Health Organization (WHO)',
            url: 'https://www.who.int/health-topics/hiv-aids',
            description: 'Global health information and resources',
          },
          {
            id: '2',
            name: 'UNAIDS',
            url: 'https://www.unaids.org',
            description: 'Joint United Nations Programme on HIV/AIDS',
          },
          {
            id: '3',
            name: 'Ministry of Health Malaysia',
            url: 'https://www.moh.gov.my',
            description: 'Kementerian Kesihatan Malaysia',
          },
          {
            id: '4',
            name: 'Malaysian AIDS Council (MAC)',
            url: 'https://mac.org.my',
            description: 'National coordinating body for HIV/AIDS in Malaysia',
          },
        ]);
      } else {
        setWebsites(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const openWebsite = (url: string, name: string) => {
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
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: WebsiteItem }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => openWebsite(item.url, item.name)}
      style={styles.card}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="globe" size={32} color="#2196F3" />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
        <View style={styles.urlContainer}>
          <Ionicons name="link" size={16} color="#2196F3" />
          <Text style={styles.urlText} numberOfLines={1}>
            {item.url}
          </Text>
        </View>
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
        {language === 'bm' ? 'Laman Web' : 'Websites'}
      </Text>

      <Text style={styles.subtitle}>
        {language === 'bm' 
          ? 'Tekan untuk membuka laman web'
          : 'Tap to open website'}
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>
            {language === 'bm' ? 'Memuatkan...' : 'Loading...'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={websites}
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
    backgroundColor: '#E3F2FD',
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
    color: '#2196F3',
  },
});
