import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ReactNode } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useAppData } from '@/contexts/AppDataContext';
import { MenuItem } from '@/utils/data';
import { SmartModules, SmartModuleKey } from '@/constants/theme';

type ModuleHubProps = {
  moduleKey: SmartModuleKey;
  items?: MenuItem[];
  /** Rendered instead of / after the items list. */
  children?: ReactNode;
  showBack?: boolean;
  footer?: ReactNode;
};

/**
 * Shared scaffold for the four SMART module hubs (Learn / Manage / Track /
 * Connect). Shows the module name in both languages, a quick language
 * toggle and settings access in the top-right corner.
 */
export default function ModuleHub({
  moduleKey,
  items,
  children,
  showBack = false,
  footer,
}: ModuleHubProps) {
  const { state, dispatch, isLoading } = useAppData();
  const insets = useSafeAreaInsets();
  const language = state?.appData?.settings?.language === 'en' ? 'en' : 'bm';
  const module = SmartModules[moduleKey];

  const [loaded] = useFonts({
    MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
    MontserratSemiBold: require('../assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratMedium: require('../assets/fonts/Montserrat-Medium.ttf'),
  });

  if (!loaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={module.color} />
      </View>
    );
  }

  const toggleLanguage = () =>
    dispatch({ type: 'SET_LANGUAGE', payload: language === 'bm' ? 'en' : 'bm' });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          {showBack && (
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={36} color="#232323" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
            <Ionicons name="language" size={16} color="#555" />
            <Text style={styles.langButtonText}>{language === 'bm' ? 'BM' : 'EN'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push('/(tabs)/settings' as any)}
          >
            <Ionicons name="settings-outline" size={22} color="#555" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.moduleBadge, { backgroundColor: module.color }]}>
          <Text style={styles.moduleBadgeText}>
            {language === 'bm' ? module.bm : module.en}
          </Text>
        </View>
        <Text style={styles.moduleSubName}>{language === 'bm' ? module.en : module.bm}</Text>
        <Text style={styles.tagline}>
          {language === 'bm' ? module.taglineBm : module.taglineEn}
        </Text>

        {items?.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => router.push(`/(screens)/${item.navi}` as any)}
            style={[styles.card, { borderLeftColor: module.color }]}
          >
            <Image source={item.icon} style={styles.cardImage} resizeMode="contain" />
            <Text style={styles.cardTitle}>
              {language === 'bm' ? item.bmTitle : item.title}
            </Text>
            <Ionicons name="chevron-forward" size={22} color="#C4C4C4" />
          </TouchableOpacity>
        ))}

        {children}
        {footer}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  langButtonText: {
    fontSize: 12,
    fontFamily: 'MontserratSemiBold',
    color: '#555',
  },
  settingsButton: {
    padding: 5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  moduleBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  moduleBadgeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'MontserratBold',
  },
  moduleSubName: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#999',
    marginTop: 6,
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'MontserratMedium',
    color: '#666',
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00000012',
    borderLeftWidth: 5,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: 52,
    height: 52,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    flex: 1,
    color: '#333',
  },
});
