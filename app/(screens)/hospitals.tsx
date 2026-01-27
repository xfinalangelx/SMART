import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAppData } from '@/contexts/AppDataContext';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import * as Clipboard from 'expo-clipboard';

type HospitalItem = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

export default function HospitalsScreen() {
  const { state } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const [hospitals, setHospitals] = useState<HospitalItem[]>([]);
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
    fetchHospitals();
  }, []);

  async function fetchHospitals() {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_all_hospital');
      
      if (error) {
        console.error('Error fetching hospitals:', error);
        Alert.alert(
          language === 'bm' ? 'Ralat' : 'Error',
          language === 'bm' ? 'Gagal memuatkan data hospital' : 'Failed to load hospitals'
        );
      } else {
        setHospitals(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = async (text: string, type: 'address' | 'phone') => {
    await Clipboard.setStringAsync(text);
    Alert.alert(
      language === 'bm' ? 'Disalin' : 'Copied',
      language === 'bm' 
        ? `${type === 'address' ? 'Alamat' : 'Nombor telefon'} disalin`
        : `${type === 'address' ? 'Address' : 'Phone number'} copied to clipboard`
    );
  };

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8F00FF" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: HospitalItem }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>
          {language === 'bm' ? 'Alamat:' : 'Address:'}
        </Text>
        <View style={styles.infoContent}>
          <Text style={styles.infoText}>{item.address}</Text>
          <TouchableOpacity
            onPress={() => copyToClipboard(item.address, 'address')}
            style={styles.copyButton}
          >
            <Ionicons name="copy-outline" size={20} color="#8F00FF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>
          {language === 'bm' ? 'Telefon:' : 'Phone:'}
        </Text>
        <View style={styles.infoContent}>
          <Text style={styles.infoText}>{item.phone}</Text>
          <TouchableOpacity
            onPress={() => copyToClipboard(item.phone, 'phone')}
            style={styles.copyButton}
          >
            <Ionicons name="copy-outline" size={20} color="#8F00FF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        {language === 'bm' ? 'Senarai Hospital' : 'List of Hospitals'}
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8F00FF" />
          <Text style={styles.loadingText}>
            {language === 'bm' ? 'Memuatkan...' : 'Loading...'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={hospitals}
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
    marginBottom: 16,
    color: '#333',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#00000040',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    marginTop: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#666',
    marginBottom: 6,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'MontserratMedium',
    color: '#333',
    lineHeight: 20,
  },
  copyButton: {
    padding: 4,
  },
});
