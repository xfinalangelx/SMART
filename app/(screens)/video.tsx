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

  // Initialize video players
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
        <ActivityIndicator size="large" color="#8F00FF" />
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
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {language === 'bm' ? 'Video Pendidikan' : 'Educational Videos'}
          </Text>
          
          <Text style={styles.description}>
            {language === 'bm'
              ? 'Tonton video pendidikan tentang HIV dan cara menguruskan kesihatan anda.'
              : 'Watch educational videos about HIV and how to manage your health.'}
          </Text>

          {/* English Video */}
          <View style={styles.videoCard}>
            <Text style={styles.videoTitle}>
              {language === 'bm' ? 'SMART - Bahasa Inggeris' : 'SMART - English'}
            </Text>
            <VideoView
              style={styles.video}
              player={smartVideoPlayer}
              allowsFullscreen
              allowsPictureInPicture
              contentFit="contain"
            />
          </View>

          {/* Bahasa Malaysia Video */}
          <View style={styles.videoCard}>
            <Text style={styles.videoTitle}>
              {language === 'bm' ? 'SMART - Bahasa Malaysia' : 'SMART - Bahasa Malaysia'}
            </Text>
            <VideoView
              style={styles.video}
              player={smartBmVideoPlayer}
              allowsFullscreen
              allowsPictureInPicture
              contentFit="contain"
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              {language === 'bm' ? 'Tentang Video' : 'About the Videos'}
            </Text>
            <Text style={styles.infoText}>
              {language === 'bm'
                ? 'Video-video ini memberi maklumat penting tentang HIV, rawatan, dan cara menjaga kesihatan anda. Sila tonton dengan teliti untuk memahami dengan lebih baik.'
                : 'These videos provide important information about HIV, treatment, and how to maintain your health. Please watch carefully to better understand.'}
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
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
