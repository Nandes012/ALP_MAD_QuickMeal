import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';
import { API_BASE_URL } from '@/constants/api';

// Import CustomNavbar resmi (Path keluar dua tingkat dari app/(tabs)/list.tsx)
import CustomNavbar from '../../components/CustomNavbar';

interface FoodItem {
  id: string;
  name: string;
  price: string;
  imageUri: string;
}

async function fetchList(activeTab: 'Masak' | 'Bahan') {
  const endpoint = activeTab === 'Masak' ? '/recipes' : '/ingredients';
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  const json = await response.json();

  if (!json?.success || !Array.isArray(json.data)) {
    return [];
  }

  if (activeTab === 'Masak') {
    const recipes = json.data.map((recipe: any) => ({
      id: String(recipe.id),
      name: recipe.title || recipe.name || 'Resep',
      price: Number(recipe.totalIngredientPrice || recipe.price || 0).toLocaleString('id-ID'),
      imageUri: recipe.image || recipe.imageUrl || 'https://via.placeholder.com/300',
    }));

    return Array.from(new Map<string, FoodItem>(recipes.map((item: FoodItem) => [item.id, item])).values());
  }

  const ingredients = json.data.map((ingredient: any) => ({
    id: String(ingredient.id),
    name: ingredient.name || 'Bahan',
    price: Number(ingredient.price_per_kg || ingredient.price || 0).toLocaleString('id-ID'),
    imageUri: ingredient.ingredient_picture || ingredient.image || 'https://via.placeholder.com/300',
  }));

  return Array.from(new Map<string, FoodItem>(ingredients.map((item: FoodItem) => [item.id, item])).values());
}

export default function ListScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Masak' | 'Bahan'>('Masak');
  const [data, setData] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load font Inter secara asinkron
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Langar_400Regular,
    'Inter-Medium': Langar_400Regular,
    'Inter-SemiBold': Langar_400Regular,
    'Inter-Bold': Langar_400Regular,
  });

  useEffect(() => {
    let mounted = true;

    const loadList = async () => {
      setLoading(true);

      try {
        const list = await fetchList(activeTab);
        if (mounted) {
          setData(list);
        }
      } catch (error) {
        console.error('Failed to load list:', error);
        if (mounted) {
          setData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadList();

    return () => {
      mounted = false;
    };
  }, [activeTab]);

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#9E5F3B" />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#9E5F3B" />
      </View>
    );
  }

  const handleItemPress = (item: FoodItem) => {
    const cleanName = item.name.replace(/\s+/g, ' ').trim();

    if (activeTab === 'Masak') {
      router.push({
        pathname: '/detail_resep',
        params: { id: item.id, name: cleanName, imageUrl: item.imageUri }
      });
    } else {
      router.push({
        pathname: '/detail_bahan',
        params: { name: cleanName, imageUrl: item.imageUri, price: item.price }
      });
    }
  };

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.cardInfo}>
        <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.foodPrice}>Rp. {item.price}</Text>
        
        <View style={styles.actionButton}>
          <Text style={styles.actionButtonText}>
            {activeTab === 'Masak' ? 'Resep' : 'Detail Bahan'}
          </Text>
        </View>
      </View>

      <Image source={{ uri: item.imageUri }} style={styles.foodImage} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8EF" />
      
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.logoText}>QuickMeal</Text>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Image 
            source={{ uri: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </SafeAreaView>

      {/* --- TAB SWITCHER OVAL --- */}
      <View style={styles.tabOuterContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'Masak' && styles.activeTabBg]} 
            onPress={() => setActiveTab('Masak')}
          >
            <Text style={[styles.tabText, activeTab === 'Masak' && styles.activeTabText]}>Masak</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'Bahan' && styles.activeTabBg]} 
            onPress={() => setActiveTab('Bahan')}
          >
            <Text style={[styles.tabText, activeTab === 'Bahan' && styles.activeTabText]}>Bahan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Judul Section Dinamis */}
      <Text style={styles.sectionTitle}>
        {activeTab === 'Masak' ? 'Resep Makanan' : 'Info Bahan'}
      </Text>

      <FlatList
        data={data}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <CustomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 10 },
  logoText: { fontSize: 24, color: '#9E5F3B', fontFamily: 'Inter-Bold' },
  profileImage: { width: 42, height: 42, borderRadius: 21, borderWidth: 1.5, borderColor: '#5b2f20' },
  tabOuterContainer: { paddingHorizontal: 25, marginTop: 10 },
  tabContainer: { 
    flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 35, padding: 4, alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4
  },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 30 },
  activeTabBg: { backgroundColor: '#9E5F3B' },
  tabText: { fontSize: 16, color: '#1A1A1A', fontFamily: 'Inter-Medium' },
  activeTabText: { color: '#FFFFFF', fontFamily: 'Inter-Bold' },
  sectionTitle: { textAlign: 'center', fontSize: 22, color: '#9E5F3B', marginTop: 20, marginBottom: 15, fontFamily: 'Inter-SemiBold' },
  listContent: { paddingHorizontal: 25, paddingBottom: 110 },
  card: { 
    backgroundColor: '#9E5F3B', 
    borderRadius: 24, 
    flexDirection: 'row', 
    padding: 16, 
    marginBottom: 15, 
    alignItems: 'center', 
    justifyContent: 'space-between',
    elevation: 3 
  },
  cardInfo: { flex: 1, marginRight: 15, justifyContent: 'center' },
  foodName: { color: 'white', fontSize: 18, fontFamily: 'Inter-SemiBold', marginBottom: 4 },
  foodPrice: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 14, fontFamily: 'Inter-Regular', marginBottom: 12 },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  foodImage: { 
    width: 95, 
    height: 95, 
    borderRadius: 20,
    backgroundColor: '#FFFFFF'
  },
});