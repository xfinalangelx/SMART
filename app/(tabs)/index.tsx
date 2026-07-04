import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModuleHub from '@/components/ModuleHub';
import data from '@/utils/data';
import { useAppData } from '@/contexts/AppDataContext';

export default function LearnTab() {
  const { state } = useAppData();
  const bm = state?.appData?.settings?.language !== 'en';

  return (
    <ModuleHub
      moduleKey="learn"
      items={data.knowledgeList}
      footer={
        <View style={styles.footer}>
          <Text style={styles.brand}>SMART</Text>
          <Text style={styles.brandSub}>Self-Management of Antiretroviral Therapy</Text>
          <View style={styles.privacyRow}>
            <Ionicons name="lock-closed" size={14} color="#16B394" />
            <Text style={styles.privacyText}>
              {bm
                ? 'Privasi anda adalah keutamaan kami. Semua data anda selamat dan sulit.'
                : 'Your privacy is our priority. All your data is secure and confidential.'}
            </Text>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 12,
    alignItems: 'center',
  },
  brand: {
    fontSize: 22,
    fontFamily: 'MontserratBold',
    color: '#16B394',
    letterSpacing: 2,
  },
  brandSub: {
    fontSize: 12,
    fontFamily: 'MontserratMedium',
    color: '#999',
    marginTop: 2,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: '#E8F8F4',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'MontserratMedium',
    color: '#0E7A64',
  },
});
