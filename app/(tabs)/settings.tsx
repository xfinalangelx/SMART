import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '@/contexts/AppDataContext';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const { state, dispatch } = useAppData();
  const [loading, setLoading] = useState(false);

  const [loaded] = useFonts({
    MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
  });

  useEffect(() => {
    if (state?.appData?.settings) {
      setLanguage(state.appData.settings.language);
    }
  }, [state]);

  const handleLanguageChange = async (newLanguage: 'en' | 'bm') => {
    await dispatch({ type: 'SET_LANGUAGE', payload: newLanguage });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            setLoading(true);
            const { error } = await supabase.auth.signOut();
            setLoading(false);
            
            if (error) {
              Alert.alert('Error', error.message);
            } else {
              router.replace('/(auth)/login');
            }
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/img/Setting.png')}
          style={styles.settingsImage}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.languageCard}>
        <View style={styles.languageInfo}>
          <Image
            source={require('../../assets/img/languageIcon.png')}
            style={styles.languageIcon}
            resizeMode="contain"
          />
          <Text style={styles.languageLabel}>
            {language === 'bm' ? 'Bahasa' : 'Language'}
          </Text>
        </View>
        
        <View style={styles.languageToggle}>
          <TouchableOpacity
            onPress={() => handleLanguageChange('bm')}
            style={[
              styles.toggleButton,
              language === 'bm' && styles.toggleButtonActive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                language === 'bm' && styles.toggleTextActive,
              ]}
            >
              BM
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleLanguageChange('en')}
            style={[
              styles.toggleButton,
              language === 'en' && styles.toggleButtonActive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                language === 'en' && styles.toggleTextActive,
              ]}
            >
              EN
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.logoutText}>
              {language === 'bm' ? 'Log Keluar' : 'Logout'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
  },
  settingsImage: {
    height: 181,
    width: 181,
  },
  languageCard: {
    margin: 16,
    paddingHorizontal: 25,
    paddingVertical: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00000012',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  languageInfo: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
  },
  languageIcon: {
    height: 40,
    width: 40,
  },
  languageLabel: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 20,
  },
  languageToggle: {
    flexDirection: 'row',
    backgroundColor: '#C4C4C4',
    borderRadius: 4,
  },
  toggleButton: {
    backgroundColor: '#c4c4c4',
    padding: 11,
    borderRadius: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#8F00FF',
  },
  toggleText: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 15,
    color: '#727272',
  },
  toggleTextActive: {
    color: 'black',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    margin: 16,
    padding: 16,
    borderRadius: 10,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'MontserratSemiBold',
  },
});
