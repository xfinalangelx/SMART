import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useAppData } from '@/contexts/AppDataContext';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function VideoScreen() {
  const { state } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const insets = useSafeAreaInsets();

  const [loaded] = useFonts({
    MontserratBold: require('../../assets/fonts/Montserrat-Bold.ttf'),
    MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratMedium: require('../../assets/fonts/Montserrat-Medium.ttf'),
  });

  // Initialize video players (only the video matching the app language is shown)
  const smartVideoPlayer = useVideoPlayer(require('../../assets/video/smart.mp4'), (player) => {
    player.loop = false;
  });

  const smartBmVideoPlayer = useVideoPlayer(require('../../assets/video/smartbm.mp4'), (player) => {
    player.loop = false;
  });

  useEffect(() => {
    if (state?.appData?.settings) {
      setLanguage(state.appData.settings.language);
    }
  }, [state]);

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16B394" />
      </View>
    );
  }

  const activePlayer = language === 'bm' ? smartBmVideoPlayer : smartVideoPlayer;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {language === 'bm'
              ? 'Bagaimana Terapi Antiretroviral (ART) Berfungsi'
              : 'How Antiretroviral Therapy (ART) Works'}
          </Text>

          <Text style={styles.description}>
            {language === 'bm'
              ? 'Tonton video ini untuk memahami bagaimana ubat antiretroviral berfungsi dan cara menguruskan kesihatan anda.'
              : 'Watch this video to understand how antiretroviral medication works and how to manage your health.'}
          </Text>

          {/* Only the video matching the selected language is shown */}
          <View style={styles.videoCard}>
            <Text style={styles.videoTitle}>
              {language === 'bm' ? 'SMART - Bahasa Malaysia' : 'SMART - English'}
            </Text>
            <VideoView
              style={styles.video}
              player={activePlayer}
              allowsFullscreen
              allowsPictureInPicture
              contentFit="contain"
            />
          </View>

          <View style={styles.languageHint}>
            <Ionicons name="language" size={18} color="#1976D2" />
            <Text style={styles.languageHintText}>
              {language === 'bm'
                ? 'Untuk menonton versi Bahasa Inggeris, tukar bahasa aplikasi di Tetapan.'
                : 'To watch the Bahasa Malaysia version, change the app language in Settings.'}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              {language === 'bm' ? 'Tentang Video' : 'About the Video'}
            </Text>
            <Text style={styles.infoText}>
              {language === 'bm'
                ? 'Video ini memberi maklumat penting tentang HIV, rawatan, dan cara menjaga kesihatan anda. Sila tonton dengan teliti untuk memahami dengan lebih baik.'
                : 'This video provides important information about HIV, treatment, and how to maintain your health. Please watch carefully to better understand.'}
            </Text>
          </View>
        </View>
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
    fontSize: 22,
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
  videoCard: {
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
  videoTitle: {
    fontSize: 18,
    fontFamily: 'MontserratSemiBold',
    color: '#333',
    marginBottom: 12,
  },
  video: {
    width: '100%',
    height: (width - 64) * (9 / 16), // 16:9 aspect ratio
    borderRadius: 8,
    backgroundColor: '#000',
  },
  languageHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F7FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  languageHintText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'MontserratMedium',
    color: '#1976D2',
    lineHeight: 19,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'MontserratSemiBold',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    fontFamily: 'MontserratMedium',
    color: '#424242',
    lineHeight: 22,
  },
});
