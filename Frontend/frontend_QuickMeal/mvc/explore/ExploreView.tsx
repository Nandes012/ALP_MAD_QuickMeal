import React from 'react';
import { ActivityIndicator, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomNavbar from '@/components/CustomNavbar';

import { FoodItem } from './useExploreController';

type Props = Readonly<{
  router: { push: (args: any) => void };
  activeTab: 'Masak' | 'Bahan';
  setActiveTab: (value: 'Masak' | 'Bahan') => void;
  data: FoodItem[];
  loading: boolean;
  fontsLoaded: boolean;
  handleItemPress: (item: FoodItem) => void;
}>;

export default function ExploreView(props: Props) {
  const { router, activeTab, setActiveTab, data, loading, fontsLoaded, handleItemPress } = props;

  if (!fontsLoaded) {
    return null;
  }

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => handleItemPress(item)}>
      <View style={styles.cardInfo}>
        <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.foodPrice}>Rp. {item.price}</Text>
        <View style={styles.actionButton}>
          <Text style={styles.actionButtonText}>{activeTab === 'Masak' ? 'Resep' : 'Detail Bahan'}</Text>
        </View>
      </View>
      <Image source={{ uri: item.imageUri }} style={styles.foodImage} resizeMode="cover" />
    </TouchableOpacity>
  );

  let listContent: React.ReactNode;

  if (loading) {
    listContent = (
      <View style={styles.centerState}>
        <ActivityIndicator size="large" color="#9E5F3B" />
        <Text style={styles.stateText}>{activeTab === 'Masak' ? 'Memuat resep...' : 'Memuat bahan...'}</Text>
      </View>
    );
  } else if (data.length === 0) {
    listContent = (
      <View style={styles.centerState}>
        <Text style={styles.stateText}>Belum ada item untuk ditampilkan.</Text>
      </View>
    );
  } else {
    listContent = (
      <FlatList
        data={data}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8EF" />

      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.logoText}>QuickMeal</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.tabOuterContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'Masak' && styles.activeTabBg]} onPress={() => setActiveTab('Masak')}>
            <Text style={[styles.tabText, activeTab === 'Masak' && styles.activeTabText]}>Masak</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'Bahan' && styles.activeTabBg]} onPress={() => setActiveTab('Bahan')}>
            <Text style={[styles.tabText, activeTab === 'Bahan' && styles.activeTabText]}>Bahan</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{activeTab === 'Masak' ? 'Resep Makanan' : 'Info Bahan'}</Text>

      {listContent}

      <CustomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 10 },
  logoText: { fontSize: 18, color: '#9E5F3B', fontWeight: 'bold', fontFamily: 'Langar-Regular' },
  profileImage: { width: 42, height: 42, borderRadius: 21, borderWidth: 1.5, borderColor: '#5b2f20' },
  tabOuterContainer: { paddingHorizontal: 25, marginTop: 10 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 35, padding: 4, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 30 },
  activeTabBg: { backgroundColor: '#9E5F3B' },
  tabText: { fontSize: 22, color: '#1A1A1A', fontFamily: 'Langar-Regular' },
  activeTabText: { color: '#FFFFFF', fontWeight: 'bold' },
  sectionTitle: { textAlign: 'center', fontSize: 24, color: '#9E5F3B', marginTop: 20, marginBottom: 15, fontWeight: '600', fontFamily: 'Langar-Regular' },
  listContent: { paddingHorizontal: 25, paddingBottom: 110 },
  centerState: { paddingVertical: 30, alignItems: 'center' },
  stateText: { color: '#8D5B3E', marginTop: 12, textAlign: 'center' },
  card: { backgroundColor: '#9E5F3B', borderRadius: 24, flexDirection: 'row', padding: 16, marginBottom: 15, alignItems: 'center', justifyContent: 'space-between', elevation: 3 },
  cardInfo: { flex: 1, marginRight: 15, justifyContent: 'center' },
  foodName: { color: 'white', fontSize: 22, fontWeight: '500', fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia', marginBottom: 4 },
  foodPrice: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 14, marginBottom: 12 },
  actionButton: { backgroundColor: 'rgba(255, 255, 255, 0.3)', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 15, alignSelf: 'flex-start' },
  actionButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  foodImage: { width: 95, height: 95, borderRadius: 20, backgroundColor: '#FFFFFF' },
});
