import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
  Image,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '@/contexts/AppDataContext';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { requestNotificationPermission } from '@/utils/notifications';
import { SmartColors } from '@/constants/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const { state, dispatch } = useAppData();
  const [loading, setLoading] = useState(false);

  const notificationsEnabled = !!state?.appData?.settings?.notificationsEnabled;

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

  const handleLanguageChange = async (newLanguage: 'en' | 'bm') => {
    await dispatch({ type: 'SET_LANGUAGE', payload: newLanguage });
  };

  const handleNotificationsToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          language === 'bm' ? 'Notifikasi' : 'Notifications',
          language === 'bm'
            ? 'Kebenaran notifikasi tidak diberikan. Sila benarkan notifikasi dalam tetapan peranti anda.'
            : 'Notification permission was not granted. Please allow notifications in your device settings.'
        );
        return;
      }
    }
    await dispatch({ type: 'SET_NOTIFICATIONS', payload: enabled });
  };

  const handleLogout = () => {
    Alert.alert(
      language === 'bm' ? 'Log Keluar' : 'Logout',
      language === 'bm' ? 'Adakah anda pasti mahu log keluar?' : 'Are you sure you want to logout?',
      [
        {
          text: language === 'bm' ? 'Batal' : 'Cancel',
          style: 'cancel',
        },
        {
          text: language === 'bm' ? 'Log Keluar' : 'Logout',
          onPress: async () => {
            setLoading(true);
            const { error } = await supabase.auth.signOut();
            setLoading(false);

            if (error) {
              Alert.alert(language === 'bm' ? 'Ralat' : 'Error', error.message);
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
        <ActivityIndicator size="large" color={SmartColors.learn} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{language === 'bm' ? 'Tetapan' : 'Settings'}</Text>

        {/* Language first — the most used setting */}
        <View style={styles.card}>
          <View style={styles.cardInfo}>
            <Image
              source={require('../../assets/img/languageIcon.png')}
              style={styles.cardIcon}
              resizeMode="contain"
            />
            <Text style={styles.cardLabel}>{language === 'bm' ? 'Bahasa' : 'Language'}</Text>
          </View>

          <View style={styles.languageToggle}>
            <TouchableOpacity
              onPress={() => handleLanguageChange('bm')}
              style={[styles.toggleButton, language === 'bm' && styles.toggleButtonActive]}
            >
              <Text style={[styles.toggleText, language === 'bm' && styles.toggleTextActive]}>
                BM
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleLanguageChange('en')}
              style={[styles.toggleButton, language === 'en' && styles.toggleButtonActive]}
            >
              <Text style={[styles.toggleText, language === 'en' && styles.toggleTextActive]}>
                EN
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reminder notifications */}
        <View style={styles.card}>
          <View style={styles.cardInfo}>
            <Ionicons name="notifications" size={34} color={SmartColors.manage} />
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardLabel}>
                {language === 'bm' ? 'Notifikasi' : 'Notifications'}
              </Text>
              <Text style={styles.cardHint}>
                {language === 'bm'
                  ? 'Peringatan untuk vaksin, ujian darah dan temu janji.'
                  : 'Reminders for vaccines, blood tests and appointments.'}
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
            trackColor={{ true: SmartColors.manage }}
          />
        </View>

        {/* About + disclaimer */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>
            {language === 'bm' ? 'Tentang SMART' : 'About SMART'}
          </Text>
          <Text style={styles.aboutText}>
            {language === 'bm'
              ? 'SMART (Self-Management of Antiretroviral Therapy) ialah aplikasi pendidikan yang dibangunkan sebagai sebahagian daripada projek penyelidikan PhD. Aplikasi ini bertujuan untuk pendidikan sahaja dan tidak menggantikan nasihat perubatan profesional.'
              : 'SMART (Self-Management of Antiretroviral Therapy) is an educational app developed as part of a PhD research project. It is for education only and does not replace professional medical advice.'}
          </Text>
          <TouchableOpacity
            style={styles.disclaimerButton}
            onPress={() => router.push('/(screens)/disclaimer' as any)}
          >
            <Ionicons name="document-text-outline" size={20} color={SmartColors.learn} />
            <Text style={styles.disclaimerButtonText}>
              {language === 'bm'
                ? 'Penafian & Terma Penggunaan'
                : 'Disclaimer and Terms of Use'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={SmartColors.learn} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
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
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'MontserratBold',
    marginLeft: 17,
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 22,
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
    gap: 12,
  },
  cardInfo: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    flex: 1,
  },
  cardTextBlock: {
    flex: 1,
  },
  cardIcon: {
    height: 40,
    width: 40,
  },
  cardLabel: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 18,
  },
  cardHint: {
    fontFamily: 'MontserratMedium',
    fontSize: 12,
    color: '#888',
    marginTop: 4,
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
    borderColor: '#16B394',
  },
  toggleText: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 15,
    color: '#727272',
  },
  toggleTextActive: {
    color: 'black',
  },
  aboutCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#F7FBFA',
    borderWidth: 1,
    borderColor: '#E0F0EB',
  },
  aboutTitle: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 16,
    color: '#0E7A64',
    marginBottom: 8,
  },
  aboutText: {
    fontFamily: 'MontserratMedium',
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  disclaimerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingVertical: 8,
  },
  disclaimerButtonText: {
    flex: 1,
    fontFamily: 'MontserratSemiBold',
    fontSize: 14,
    color: '#0E7A64',
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
