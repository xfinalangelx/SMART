import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '@/contexts/AppDataContext';
import { SmartColors } from '@/constants/theme';

type Section = { heading: string; paragraphs: string[]; bullets?: string[] };

const EN_SECTIONS: Section[] = [
  {
    heading: 'Purpose of the Application',
    paragraphs: [
      'This application has been developed as part of a PhD research project and is intended solely for educational, informational, and reference purposes. The application is designed to support users in understanding HIV-related information and managing aspects of their health awareness. It is not intended to replace professional medical advice, diagnosis, treatment, or consultation with qualified healthcare providers.',
    ],
  },
  {
    heading: 'User Responsibility',
    paragraphs: ['By accessing or using this application, you acknowledge and agree that:'],
    bullets: [
      'You use this application voluntarily and entirely at your own risk.',
      'Any information provided through the application is for general educational and reference purposes only.',
      'You remain solely responsible for any decisions, actions, or outcomes arising from the use of information obtained through the application.',
      'You should always seek advice from qualified healthcare professionals regarding any medical condition, treatment, medication, or health-related concern.',
    ],
  },
  {
    heading: 'Limitation of Liability',
    paragraphs: [
      'The hospital, healthcare organization, university, researchers, developers, supervisors, collaborators, and affiliated institutions involved in the development, operation, or maintenance of this application shall not be held liable for any direct, indirect, incidental, consequential, special, or punitive damages, losses, injuries, or claims arising from:',
    ],
    bullets: [
      'The use or inability to use the application;',
      'Reliance on information provided through the application;',
      'Errors, omissions, inaccuracies, or delays in the information presented;',
      'Decisions made by users based on information obtained from the application.',
    ],
  },
  {
    heading: 'No Doctor-Patient Relationship',
    paragraphs: [
      'Use of this application does not create a doctor-patient relationship or any professional healthcare relationship between the user and the participating institutions or researchers.',
    ],
  },
  {
    heading: 'Research Project Notice',
    paragraphs: [
      'This application forms part of an academic PhD research project. Its primary purpose is to explore and evaluate the use of digital technologies for health education, patient engagement, and information support. The application should not be considered a substitute for professional medical care or clinical decision-making.',
    ],
  },
  {
    heading: 'Acceptance of Terms',
    paragraphs: [
      'By continuing to access or use this application, you acknowledge that you have read, understood, and agreed to these terms and conditions and accept full responsibility for your use of the application.',
    ],
  },
];

const BM_SECTIONS: Section[] = [
  {
    heading: 'Tujuan Aplikasi',
    paragraphs: [
      'Aplikasi ini dibangunkan sebagai sebahagian daripada projek penyelidikan PhD dan bertujuan semata-mata untuk kegunaan pendidikan, maklumat dan rujukan. Aplikasi ini direka untuk membantu pengguna memahami maklumat berkaitan HIV dan menguruskan aspek kesedaran kesihatan mereka. Ia tidak bertujuan untuk menggantikan nasihat perubatan profesional, diagnosis, rawatan, atau perundingan dengan penyedia penjagaan kesihatan yang bertauliah.',
    ],
  },
  {
    heading: 'Tanggungjawab Pengguna',
    paragraphs: ['Dengan mengakses atau menggunakan aplikasi ini, anda mengakui dan bersetuju bahawa:'],
    bullets: [
      'Anda menggunakan aplikasi ini secara sukarela dan sepenuhnya atas risiko anda sendiri.',
      'Sebarang maklumat yang disediakan melalui aplikasi ini adalah untuk tujuan pendidikan umum dan rujukan sahaja.',
      'Anda bertanggungjawab sepenuhnya terhadap sebarang keputusan, tindakan, atau hasil yang timbul daripada penggunaan maklumat yang diperoleh melalui aplikasi ini.',
      'Anda hendaklah sentiasa mendapatkan nasihat daripada profesional penjagaan kesihatan yang bertauliah mengenai sebarang keadaan perubatan, rawatan, ubat-ubatan, atau kebimbangan berkaitan kesihatan.',
    ],
  },
  {
    heading: 'Had Liabiliti',
    paragraphs: [
      'Hospital, organisasi penjagaan kesihatan, universiti, penyelidik, pembangun, penyelia, rakan usaha sama, dan institusi bersekutu yang terlibat dalam pembangunan, operasi, atau penyelenggaraan aplikasi ini tidak akan bertanggungjawab terhadap sebarang kerosakan, kerugian, kecederaan, atau tuntutan secara langsung, tidak langsung, sampingan, berbangkit, khas, atau punitif yang timbul daripada:',
    ],
    bullets: [
      'Penggunaan atau ketidakupayaan untuk menggunakan aplikasi;',
      'Pergantungan kepada maklumat yang disediakan melalui aplikasi;',
      'Ralat, ketinggalan, ketidaktepatan, atau kelewatan dalam maklumat yang dipaparkan;',
      'Keputusan yang dibuat oleh pengguna berdasarkan maklumat yang diperoleh daripada aplikasi.',
    ],
  },
  {
    heading: 'Tiada Hubungan Doktor-Pesakit',
    paragraphs: [
      'Penggunaan aplikasi ini tidak mewujudkan hubungan doktor-pesakit atau sebarang hubungan penjagaan kesihatan profesional antara pengguna dengan institusi atau penyelidik yang terlibat.',
    ],
  },
  {
    heading: 'Notis Projek Penyelidikan',
    paragraphs: [
      'Aplikasi ini merupakan sebahagian daripada projek penyelidikan PhD akademik. Tujuan utamanya adalah untuk meneroka dan menilai penggunaan teknologi digital untuk pendidikan kesihatan, penglibatan pesakit, dan sokongan maklumat. Aplikasi ini tidak boleh dianggap sebagai pengganti penjagaan perubatan profesional atau keputusan klinikal.',
    ],
  },
  {
    heading: 'Penerimaan Terma',
    paragraphs: [
      'Dengan terus mengakses atau menggunakan aplikasi ini, anda mengakui bahawa anda telah membaca, memahami, dan bersetuju dengan terma dan syarat ini serta menerima tanggungjawab penuh terhadap penggunaan aplikasi ini.',
    ],
  },
];

export default function DisclaimerScreen() {
  const { state } = useAppData();
  const insets = useSafeAreaInsets();
  const language = state?.appData?.settings?.language === 'en' ? 'en' : 'bm';
  const sections = language === 'bm' ? BM_SECTIONS : EN_SECTIONS;

  const [loaded] = useFonts({
    MontserratBold: require('../../assets/fonts/Montserrat-Bold.ttf'),
    MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratMedium: require('../../assets/fonts/Montserrat-Medium.ttf'),
  });

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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {language === 'bm' ? 'Penafian dan Terma Penggunaan' : 'Disclaimer and Terms of Use'}
        </Text>
        <View style={styles.notice}>
          <Ionicons name="information-circle" size={20} color="#0E7A64" />
          <Text style={styles.noticeText}>
            {language === 'bm'
              ? 'Aplikasi ini adalah untuk tujuan pendidikan sahaja.'
              : 'This application is solely for the purpose of education.'}
          </Text>
        </View>

        {sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={styles.heading}>{section.heading}</Text>
            {section.paragraphs.map((paragraph, index) => (
              <Text key={index} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
            {section.bullets?.map((bullet, index) => (
              <View key={index} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>{'•'}</Text>
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        ))}
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontFamily: 'MontserratBold',
    color: '#333',
    marginBottom: 12,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F8F4',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'MontserratSemiBold',
    color: '#0E7A64',
  },
  section: {
    marginBottom: 18,
  },
  heading: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#232323',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    fontFamily: 'MontserratMedium',
    color: '#555',
    lineHeight: 22,
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
    paddingLeft: 4,
  },
  bulletDot: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'MontserratMedium',
    color: '#555',
    lineHeight: 22,
  },
});
