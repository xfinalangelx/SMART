import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '@/contexts/AppDataContext';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';

type CardItem = {
  id: number;
  title: string;
  img: any;
  navi: string;
  filter: string;
  cover: any;
};

export default function HomeScreen() {
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const { state, isLoading } = useAppData();
  const insets = useSafeAreaInsets();

  const [loaded] = useFonts({
    MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratMedium: require('../../assets/fonts/Montserrat-Medium.ttf'),
  });

  useEffect(() => {
    if (state?.appData?.settings) {
      setLanguage(state.appData.settings.language);
    }
  }, [state]);

  const enCardItem: CardItem[] = [
    {
      id: 1,
      title: 'Knowledge',
      img: require('../../assets/img/Knowledge.png'),
      navi: 'knowledge',
      filter: 'knowledgeList',
      cover: require('../../assets/img/knowledgeListCover.png'),
    },
    {
      id: 2,
      title: 'Analysis',
      img: require('../../assets/img/Lab.png'),
      navi: 'analysis',
      filter: 'analysisList',
      cover: require('../../assets/img/analysisListCover.png'),
    },
    {
      id: 3,
      title: 'Checklist',
      img: require('../../assets/img/Checklist.png'),
      navi: 'checklist',
      filter: 'ChecklistList',
      cover: require('../../assets/img/checklistCover.png'),
    },
    {
      id: 4,
      title: 'Support',
      img: require('../../assets/img/Support.png'),
      navi: 'support',
      filter: 'supportList',
      cover: require('../../assets/img/SupportListCover.png'),
    },
  ];

  const bmCardItem: CardItem[] = [
    {
      id: 1,
      title: 'Pengetahuan',
      img: require('../../assets/img/Knowledge.png'),
      navi: 'knowledge',
      filter: 'knowledgeList',
      cover: require('../../assets/img/knowledgeListCover.png'),
    },
    {
      id: 2,
      title: 'Analisa',
      img: require('../../assets/img/Lab.png'),
      navi: 'analysis',
      filter: 'analysisList',
      cover: require('../../assets/img/analysisListCover.png'),
    },
    {
      id: 3,
      title: 'Senarai',
      img: require('../../assets/img/Checklist.png'),
      navi: 'checklist',
      filter: 'checklistList',
      cover: require('../../assets/img/checklistCover.png'),
    },
    {
      id: 4,
      title: 'Sokongan',
      img: require('../../assets/img/Support.png'),
      navi: 'support',
      filter: 'supportList',
      cover: require('../../assets/img/SupportListCover.png'),
    },
  ];

  if (!loaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8F00FF" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: CardItem }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        router.push(`/(screens)/${item.navi}` as any);
      }}
      style={styles.card}
    >
      <View style={styles.cardImageContainer}>
        <Image source={item.img} style={styles.cardImage} />
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <Text style={styles.headerTitle}>SMART Menu</Text>
      
      <View style={styles.heroImageContainer}>
        <Image
          source={require('../../assets/img/homeImg.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.menuContainer}>
        <FlatList
          data={language === 'bm' ? bmCardItem : enCardItem}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      </View>
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
  headerTitle: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 30,
    marginLeft: 21,
    marginTop: 10,
  },
  heroImageContainer: {
    marginTop: 2,
    alignItems: 'center',
  },
  heroImage: {
    width: 332,
    height: 200,
  },
  menuContainer: {
    alignSelf: 'center',
    marginTop: 29,
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    width: 160,
    height: 160,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#00000012',
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cardImageContainer: {
    marginTop: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: 80,
    height: 80,
  },
  cardTitle: {
    textAlign: 'center',
    fontFamily: 'MontserratMedium',
    fontSize: 14,
  },
});
