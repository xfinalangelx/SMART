import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { router } from 'expo-router';
import { useAppData } from '@/contexts/AppDataContext';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import * as Clipboard from 'expo-clipboard';
import FilterChips, { FilterOption } from '@/components/FilterChips';
import {
  inferState,
  inferServiceCategories,
  MALAYSIA_STATES,
  SERVICE_CATEGORY_LABELS,
  ServiceCategory,
} from '@/utils/directory';
import { SmartColors } from '@/constants/theme';

type OrgItem = {
  id: string;
  name: string;
  shortform?: string;
  description?: string;
  workingdays?: string;
  phone: string;
  address?: string;
  website?: string;
  contact_email?: string;
  state?: string;
  area?: string;
  services?: string;
  category?: string;
};

const ACCENT = SmartColors.connect;
const SERVICE_ORDER: ServiceCategory[] = [
  'financial',
  'peer',
  'shelter',
  'medical',
  'counselling',
  'other',
];

export default function OrganizationsScreen() {
  const { state } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const [organizations, setOrganizations] = useState<OrgItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState('all');
  const [groupBy, setGroupBy] = useState<'service' | 'none'>('service');
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
    fetchOrganizations();
  }, []);

  async function fetchOrganizations() {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_all_org');

      if (error) {
        console.error('Error fetching organizations:', error);
        Alert.alert(
          language === 'bm' ? 'Ralat' : 'Error',
          language === 'bm' ? 'Gagal memuatkan data organisasi' : 'Failed to load organizations'
        );
      } else {
        setOrganizations(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert(
      language === 'bm' ? 'Disalin' : 'Copied',
      language === 'bm' ? 'Disalin ke papan keratan' : 'Copied to clipboard'
    );
  };

  const openWebsite = (url: string) => {
    if (url && url !== '') {
      Linking.openURL(url).catch(() => {
        Alert.alert(
          language === 'bm' ? 'Ralat' : 'Error',
          language === 'bm' ? 'Tidak dapat membuka laman web' : 'Cannot open website'
        );
      });
    }
  };

  // Which states are actually present in the data
  const availableStates = useMemo(() => {
    const present = new Set<string>();
    organizations.forEach((org) => {
      const inferred = inferState(org);
      if (inferred) present.add(inferred);
    });
    return MALAYSIA_STATES.filter((s) => present.has(s));
  }, [organizations]);

  const stateOptions: FilterOption[] = [
    { key: 'all', label: language === 'bm' ? 'Semua Negeri' : 'All States' },
    ...availableStates.map((s) => ({ key: s, label: s })),
  ];

  const filtered = useMemo(() => {
    if (stateFilter === 'all') return organizations;
    return organizations.filter((org) => inferState(org) === stateFilter);
  }, [organizations, stateFilter]);

  // Group by service category for the SectionList
  const sections = useMemo(() => {
    if (groupBy === 'none') {
      return [{ key: 'all', title: '', data: filtered }];
    }
    const buckets: Record<ServiceCategory, OrgItem[]> = {
      financial: [],
      peer: [],
      shelter: [],
      medical: [],
      counselling: [],
      other: [],
    };
    filtered.forEach((org) => {
      inferServiceCategories(org).forEach((category) => buckets[category].push(org));
    });
    return SERVICE_ORDER.filter((category) => buckets[category].length > 0).map((category) => ({
      key: category,
      title: SERVICE_CATEGORY_LABELS[category][language],
      data: buckets[category],
    }));
  }, [filtered, groupBy, language]);

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  const renderItem = ({ item }: { item: OrgItem }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      {item.shortform && <Text style={styles.shortform}>{item.shortform}</Text>}

      {item.description && (
        <View style={styles.descriptionContainer}>
          {item.description.split('\\n').map((line, index) => (
            <Text key={index} style={styles.descriptionText}>
              {line}
            </Text>
          ))}
        </View>
      )}

      {item.workingdays && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {language === 'bm' ? 'Hari Beroperasi:' : 'Working Days:'}
          </Text>
          <Text style={styles.infoText}>{item.workingdays}</Text>
        </View>
      )}

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{language === 'bm' ? 'Telefon:' : 'Phone:'}</Text>
        <View style={styles.infoContent}>
          <Text style={styles.infoText}>{item.phone}</Text>
          <TouchableOpacity onPress={() => copyToClipboard(item.phone)} style={styles.copyButton}>
            <Ionicons name="copy-outline" size={20} color={ACCENT} />
          </TouchableOpacity>
        </View>
      </View>

      {item.contact_email && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>{item.contact_email}</Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(item.contact_email as string)}
              style={styles.copyButton}
            >
              <Ionicons name="copy-outline" size={20} color={ACCENT} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {item.address && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{language === 'bm' ? 'Alamat:' : 'Address:'}</Text>
          <Text style={styles.infoText}>{item.address}</Text>
        </View>
      )}

      {item.website && item.website !== '' && (
        <TouchableOpacity onPress={() => openWebsite(item.website!)} style={styles.websiteButton}>
          <Ionicons name="globe-outline" size={18} color={ACCENT} />
          <Text style={styles.websiteText}>{item.website}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{language === 'bm' ? 'Organisasi' : 'Organizations'}</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ACCENT} />
          <Text style={styles.loadingText}>
            {language === 'bm' ? 'Memuatkan...' : 'Loading...'}
          </Text>
        </View>
      ) : (
        <>
          {stateOptions.length > 1 && (
            <FilterChips
              options={stateOptions}
              selected={stateFilter}
              onSelect={setStateFilter}
              activeColor={ACCENT}
            />
          )}

          <View style={styles.groupToggleRow}>
            <Text style={styles.groupLabel}>
              {language === 'bm' ? 'Kumpulan mengikut:' : 'Group by:'}
            </Text>
            <View style={styles.groupToggle}>
              <TouchableOpacity
                onPress={() => setGroupBy('service')}
                style={[styles.groupButton, groupBy === 'service' && styles.groupButtonActive]}
              >
                <Text
                  style={[styles.groupButtonText, groupBy === 'service' && styles.groupButtonTextActive]}
                >
                  {language === 'bm' ? 'Perkhidmatan' : 'Service type'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGroupBy('none')}
                style={[styles.groupButton, groupBy === 'none' && styles.groupButtonActive]}
              >
                <Text
                  style={[styles.groupButtonText, groupBy === 'none' && styles.groupButtonTextActive]}
                >
                  {language === 'bm' ? 'Senarai penuh' : 'Full list'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <SectionList
            sections={sections}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderItem}
            renderSectionHeader={({ section }) =>
              section.title ? <Text style={styles.sectionHeader}>{section.title}</Text> : null
            }
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {language === 'bm'
                  ? 'Tiada organisasi ditemui untuk penapis ini.'
                  : 'No organizations found for this filter.'}
              </Text>
            }
          />
        </>
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
  groupToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  groupLabel: {
    fontFamily: 'MontserratMedium',
    fontSize: 13,
    color: '#666',
  },
  groupToggle: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 3,
  },
  groupButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  groupButtonActive: {
    backgroundColor: ACCENT,
  },
  groupButtonText: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 12,
    color: '#777',
  },
  groupButtonTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    fontSize: 15,
    fontFamily: 'MontserratBold',
    color: ACCENT,
    backgroundColor: '#FFF6EA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  list: {
    padding: 16,
    paddingTop: 0,
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
    marginBottom: 4,
    color: '#333',
  },
  shortform: {
    fontSize: 12,
    fontFamily: 'MontserratMedium',
    color: '#999',
    marginBottom: 12,
  },
  descriptionContainer: {
    backgroundColor: '#FFF6EA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: 'MontserratMedium',
    color: '#8A5A1A',
    lineHeight: 20,
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
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 8,
  },
  websiteText: {
    fontSize: 14,
    fontFamily: 'MontserratMedium',
    color: ACCENT,
    textDecorationLine: 'underline',
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'MontserratMedium',
    color: '#999',
    marginTop: 40,
  },
});
