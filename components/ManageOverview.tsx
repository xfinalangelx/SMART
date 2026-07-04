import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useAppData } from '@/contexts/AppDataContext';
import { SmartColors } from '@/constants/theme';

/**
 * Everything-at-a-glance content for the Manage module: vaccinations, blood
 * tests, upcoming appointments and recent journal entries are listed the
 * moment the section opens (no need to click into each subsection first).
 */
export default function ManageOverview({ language }: { language: 'en' | 'bm' }) {
  const { state } = useAppData();
  const checkList = state.appData.checkList;

  const daysRemaining = (dateSecond: string): number | null => {
    if (!dateSecond || dateSecond.includes('X')) return null;
    const due = new Date(dateSecond.replace(/\//g, '-'));
    if (isNaN(due.getTime())) return null;
    return Math.floor((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const badgeColor = (remain: number | null): string => {
    if (remain == null) return '#BBBBBB';
    if (remain <= 7) return '#F44336';
    if (remain <= 19) return '#FF9800';
    return '#4CAF50';
  };

  const vaccineRows = [
    ...Object.values(checkList.vaccine || {}),
    ...(checkList.customVaccines || []),
  ].map((item) => ({
    title: item.title,
    date: item.dateSecond,
    remain: daysRemaining(item.dateSecond),
  }));

  const bloodTestRows = Object.values(checkList.bloodTest || {}).map((item) => ({
    title: item.title,
    date: item.dateSecond,
    remain: daysRemaining(item.dateSecond),
  }));

  const upcomingAppointments = [...(checkList.appointment || [])]
    .filter((a) => new Date(`${a.date}T${a.time || '00:00'}`) >= new Date(moment().format('YYYY-MM-DD')))
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time || '00:00'}`).getTime() -
        new Date(`${b.date}T${b.time || '00:00'}`).getTime()
    )
    .slice(0, 5);

  const recentJournal = [...(checkList.journal || [])]
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const Section = ({
    title,
    route,
    children,
  }: {
    title: string;
    route: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        activeOpacity={0.7}
        onPress={() => router.push(route as any)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionLink}>
          <Text style={styles.sectionLinkText}>
            {language === 'bm' ? 'Urus' : 'Manage'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={SmartColors.manage} />
        </View>
      </TouchableOpacity>
      {children}
    </View>
  );

  const EmptyRow = ({ text }: { text: string }) => (
    <Text style={styles.emptyRow}>{text}</Text>
  );

  return (
    <View>
      <Section
        title={language === 'bm' ? 'Vaksinasi' : 'Vaccinations'}
        route="/(screens)/vaccination"
      >
        {vaccineRows.map((row, index) => (
          <View key={`${row.title}-${index}`} style={styles.row}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {row.title}
            </Text>
            <Text style={styles.rowDate}>
              {row.date && !row.date.includes('X')
                ? row.date
                : language === 'bm'
                  ? 'Belum ditetapkan'
                  : 'Not set'}
            </Text>
            <View style={[styles.rowBadge, { backgroundColor: badgeColor(row.remain) }]}>
              <Text style={styles.rowBadgeText}>{row.remain != null ? row.remain : '-'}</Text>
            </View>
          </View>
        ))}
      </Section>

      <Section
        title={language === 'bm' ? 'Ujian Darah' : 'Blood Tests'}
        route="/(screens)/blood-test"
      >
        {bloodTestRows.map((row, index) => (
          <View key={`${row.title}-${index}`} style={styles.row}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {row.title}
            </Text>
            <Text style={styles.rowDate}>
              {row.date && !row.date.includes('X')
                ? row.date
                : language === 'bm'
                  ? 'Belum ditetapkan'
                  : 'Not set'}
            </Text>
            <View style={[styles.rowBadge, { backgroundColor: badgeColor(row.remain) }]}>
              <Text style={styles.rowBadgeText}>{row.remain != null ? row.remain : '-'}</Text>
            </View>
          </View>
        ))}
      </Section>

      <Section
        title={language === 'bm' ? 'Temu Janji' : 'Appointments'}
        route="/(screens)/appointments"
      >
        {upcomingAppointments.length === 0 ? (
          <EmptyRow
            text={
              language === 'bm' ? 'Tiada temu janji akan datang.' : 'No upcoming appointments.'
            }
          />
        ) : (
          upcomingAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.row}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {appointment.title}
              </Text>
              <Text style={styles.rowDate}>
                {moment(appointment.date).format('DD MMM')} · {appointment.time}
              </Text>
            </View>
          ))
        )}
      </Section>

      <Section title={language === 'bm' ? 'Jurnal' : 'Journal'} route="/(screens)/journal">
        {recentJournal.length === 0 ? (
          <EmptyRow
            text={
              language === 'bm'
                ? 'Tiada catatan jurnal lagi. Bagaimana perasaan anda hari ini?'
                : 'No journal entries yet. How are you feeling today?'
            }
          />
        ) : (
          recentJournal.map((entry: any) => (
            <View key={entry.id} style={styles.journalRow}>
              <Text style={styles.rowDate}>{moment(entry.date).format('DD MMM YYYY')}</Text>
              <Text style={styles.journalText} numberOfLines={2}>
                {entry.entry || entry.content}
              </Text>
            </View>
          ))
        )}
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00000012',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'MontserratSemiBold',
    color: '#333',
  },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sectionLinkText: {
    fontSize: 13,
    fontFamily: 'MontserratSemiBold',
    color: SmartColors.manage,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
    gap: 8,
  },
  rowTitle: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'MontserratMedium',
    color: '#333',
  },
  rowDate: {
    fontSize: 12,
    fontFamily: 'MontserratMedium',
    color: '#888',
  },
  rowBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  rowBadgeText: {
    fontSize: 10,
    color: '#FFF',
    fontFamily: 'MontserratBold',
  },
  journalRow: {
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
  },
  journalText: {
    fontSize: 13,
    fontFamily: 'MontserratMedium',
    color: '#444',
    marginTop: 3,
  },
  emptyRow: {
    fontSize: 13,
    fontFamily: 'MontserratMedium',
    color: '#999',
    paddingVertical: 8,
  },
});
