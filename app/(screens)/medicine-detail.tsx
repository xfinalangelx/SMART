import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppData } from '@/contexts/AppDataContext';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMedicineData } from '@/utils/medicineHelper';

export default function MedicineDetailScreen() {
  const { state } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const filter = parseInt(params.filter as string);
  const name = params.name as string;
  const category = params.category as string;

  const [loaded] = useFonts({
    MontserratBold: require('../../assets/fonts/Montserrat-Bold.ttf'),
    MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratRegular: require('../../assets/fonts/Montserrat-Regular.ttf'),
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

  const data = getMedicineData(category, language);
  const dataItem = data.find((item: any) => item.id === filter);

  if (!dataItem) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Medicine not found</Text>
      </View>
    );
  }

  const sideEffect = dataItem.sideEffects?.split('\n') || [];
  const notTakenMed = dataItem.notTakenMed?.split('\n') || [];
  const interactions = dataItem.interaction?.split('\n') || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{name}</Text>

        <View style={styles.imageContainer}>
          <Image source={dataItem.image} style={styles.medicineImage} resizeMode="contain" />
        </View>

        <Text style={styles.medicineName}>{dataItem.name}</Text>

        {/* How To Take Section */}
        <View style={[styles.section, styles.blueSection]}>
          <Text style={styles.sectionTitle}>{language === 'en' ? 'How To Take?' : 'Cara Pengambilan'}</Text>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>{language === 'en' ? 'Dose' : 'Dos'}</Text>
            <Text style={styles.infoText}>{dataItem.commonDose}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>{language === 'en' ? 'Before/After Meals' : 'Sebelum/Selepas Makan'}</Text>
            <Text style={styles.infoText}>{dataItem.beforeAfter}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>{language === 'en' ? 'Day/Night' : 'Siang/Malam'}</Text>
            <Text style={styles.infoText}>{dataItem.dayNight}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>
              {language === 'en' ? 'Renal Adjustment' : 'Mengubah dos sekiranya ada masalah buah pinggang?'}
            </Text>
            <Text style={styles.infoText}>{dataItem.adjustmentRenal}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>
              {language === 'en' ? 'Mild Liver Adjustment' : 'Mengubah dos sekiranya ada kemerosotan hati yang ringan?'}
            </Text>
            <Text style={styles.infoText}>{dataItem.adjustmentLiverMild}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>
              {language === 'en' ? 'Moderate Liver Adjustment' : 'Mengubah dos sekiranya ada kemerosotan hati yang sederhana?'}
            </Text>
            <Text style={styles.infoText}>{dataItem.adjustmentLiverModerate}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>
              {language === 'en' ? 'Severe Liver Adjustment' : 'Mengubah dos sekiranya ada kemerosotan hati yang teruk?'}
            </Text>
            <Text style={styles.infoText}>{dataItem.adjustmentLiverSevere}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>{language === 'en' ? 'Crushed' : 'Penghancuran'}</Text>
            <Text style={styles.infoText}>{dataItem.crushed}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>{language === 'en' ? 'Crush Instruction' : 'Arahan Penghancuran'}</Text>
            <Text style={styles.infoText}>{dataItem.crushInstruction}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>{language === 'en' ? 'Safe in Pregnancy' : 'Selamat Diambil Ketika Hamil'}</Text>
            <Text style={styles.infoText}>{dataItem.pregancy}</Text>
          </View>
        </View>

        {/* Side Effects Section */}
        <View style={[styles.section, styles.orangeSection]}>
          <Text style={styles.sectionTitle}>{language === 'en' ? 'Side Effects' : 'Kesan Sampingan Utama'}</Text>
          <View style={styles.infoBlock}>
            {sideEffect.map((line: string, index: number) => (
              <Text key={index} style={styles.listItem}>
                {line}
              </Text>
            ))}
          </View>
        </View>

        {/* Precautions Section */}
        <View style={[styles.section, styles.yellowSection]}>
          <Text style={styles.sectionTitle}>{language === 'en' ? 'Precautions' : 'Pemantauan'}</Text>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>{language === 'en' ? 'Should Not be Taken With' : 'Tidak Boleh Diambil Dengan'}</Text>
            {notTakenMed.map((line: string, index: number) => (
              <Text key={index} style={styles.listItem}>
                {line}
              </Text>
            ))}
            <Text style={[styles.infoLabel, { marginTop: 10 }]}>{language === 'en' ? 'Interactions' : 'Interaksi'}</Text>
            {interactions.map((line: string, index: number) => (
              <Text key={index} style={styles.listItem}>
                {line}
              </Text>
            ))}
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
    padding: 17,
  },
  title: {
    fontSize: 18,
    fontFamily: 'MontserratSemiBold',
    marginTop: 4,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  medicineImage: {
    width: 160,
    height: 200,
  },
  medicineName: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 18,
    marginBottom: 10,
  },
  section: {
    marginTop: 10,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  blueSection: {
    backgroundColor: '#CCFAFF',
  },
  orangeSection: {
    backgroundColor: '#FFE7D8',
  },
  yellowSection: {
    backgroundColor: '#FFF7CD',
  },
  sectionTitle: {
    fontFamily: 'MontserratBold',
    fontSize: 18,
    marginBottom: 8,
  },
  infoBlock: {
    padding: 10,
  },
  infoLabel: {
    fontFamily: 'MontserratSemiBold',
    marginBottom: 4,
  },
  infoText: {
    fontFamily: 'MontserratRegular',
  },
  listItem: {
    marginTop: 5,
    fontFamily: 'MontserratRegular',
  },
});
