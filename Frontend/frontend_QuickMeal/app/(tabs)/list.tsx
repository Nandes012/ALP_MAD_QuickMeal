import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL, getApiHost } from '@/constants/api';

// Import CustomNavbar resmi
import CustomNavbar from '../../components/CustomNavbar';

interface FoodItem {
  id: string;
  name: string;
  price: string;
  imageUri: string;
}

// Kategori Masak (Sama seperti Home)
const RECIPE_CATEGORIES = [
  { id: 'all', name: 'Semua', icon: '🍽️', searchKey: '' },
  { id: '1', name: 'Gorengan', icon: '🔥', searchKey: 'Goreng' },
  { id: '2', name: 'Sayuran', icon: '🥬', searchKey: 'Sayur' },
  { id: '3', name: 'Seafood', icon: '🐟', searchKey: 'Ikan' },
  { id: '4', name: 'Ayam', icon: '🍗', searchKey: 'Ayam' },
  { id: '5', name: 'Daging', icon: '🥩', searchKey: 'Daging' },
];

// Kategori Bahan Baku
const INGREDIENT_CATEGORIES = [
  { id: 'all', name: 'Semua', icon: '🛒', searchKey: '' },
  { id: '1', name: 'Hewani', icon: '🥩', searchKey: 'Hewani' },
  { id: '2', name: 'Nabati', icon: '🥦', searchKey: 'Nabati' },
  { id: '3', name: 'Olahan', icon: '🥫', searchKey: 'Olahan' },
  { id: '4', name: 'Bumbu', icon: '🌶️', searchKey: 'Bumbu' },
];

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
  const [profilePicture, setProfilePicture] = useState<string>('https://via.placeholder.com/150');
  const [activeCategory, setActiveCategory] = useState('all');

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Langar_400Regular,
    'Inter-Medium': Langar_400Regular,
    'Inter-SemiBold': Langar_400Regular,
    'Inter-Bold': Langar_400Regular,
  });

  const fetchProfilePicture = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const result = await response.json();
      if (result?.success && result?.data?.profile_picture) {
        const imageUrl = `${getApiHost()}/storage/${result.data.profile_picture}`;
        setProfilePicture(imageUrl);
      }
    } catch (error) {
      console.error('Failed to fetch profile picture:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadList = async () => {
      setLoading(true);
      setActiveCategory('all');

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

  useFocusEffect(
    useCallback(() => {
      fetchProfilePicture();
    }, [fetchProfilePicture])
  );

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
        params: { id: item.id, name: cleanName, imageUrl: item.imageUri, price: item.price }
      });
    }
  };

  const getFilteredData = () => {
    if (activeCategory === 'all') return data;

    const currentCategories = activeTab === 'Masak' ? RECIPE_CATEGORIES : INGREDIENT_CATEGORIES;
    const selectedCat = currentCategories.find(c => c.id === activeCategory);
    if (!selectedCat) return data;

    return data.filter(item => 
      item.name.toLowerCase().includes(selectedCat.searchKey.toLowerCase())
    );
  };

  const displayedData = getFilteredData();

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity 
      style={styles.premiumCard}
      activeOpacity={0.85}
      onPress={() => handleItemPress(item)}
    >
      <Image source={{ uri: item.imageUri }} style={styles.premiumFoodImage} resizeMode="cover" />
      
      <View style={styles.premiumCardInfo}>
        <View>
          <Text style={styles.premiumFoodName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.priceBadgeContainer}>
            <Ionicons name="pricetag-outline" size={11} color="#D47E13" style={{ marginRight: 4 }} />
            <Text style={styles.premiumFoodPrice}>Rp {item.price}</Text>
          </View>
        </View>
        
        <View style={styles.premiumActionButton}>
          <Text style={styles.premiumActionText}>
            {activeTab === 'Masak' ? 'Lihat Resep' : 'Detail Bahan'}
          </Text>
          {/* Mengubah 'arrow-forward-circle' menjadi 'chevron-forward' agar bundarnya hilang */}
          <Ionicons 
            name="chevron-forward" 
            size={11} 
            color="#FFFFFF" 
            style={{ marginLeft: 4 }} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FCF8F5" />
      
      {/* HEADER PREMIUM */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.logoText}>QuickMeal</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/profile")}>
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* TAB SWITCHER */}
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

      {/* DYNAMIC HORIZONTAL CATEGORY COMPONENT */}
      <View style={styles.categoryBlock}>
        <FlatList
          horizontal
          data={activeTab === 'Masak' ? RECIPE_CATEGORIES : INGREDIENT_CATEGORIES}
          keyExtractor={(cat) => cat.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollPadding}
          renderItem={({ item: cat }) => {
            const isSelected = activeCategory === cat.id;
            return (
              <TouchableOpacity
                style={styles.categoryItem}
                activeOpacity={0.7}
                onPress={() => setActiveCategory(cat.id)}
              >
                <View style={[styles.categoryIconCircle, isSelected && styles.categoryIconCircleActive]}>
                  <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                </View>
                <Text style={[styles.categoryName, isSelected && styles.categoryNameActive]} numberOfLines={1}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* JUDUL SEKSI */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {activeTab === 'Masak' ? '🔥 Pilihan Resep Spesial' : '🥦 Jelajahi Bahan Baku'}
        </Text>
      </View>

      {/* DATA AREA */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9E5F3B" />
        </View>
      ) : displayedData.length > 0 ? (
        <FlatList
          data={displayedData}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.cleanEmptyContainer}>
          <Ionicons name="basket-outline" size={32} color="#C4A493" />
          <Text style={styles.emptyState}>
            Tidak ada item untuk kategori ini.
          </Text>
        </View>
      )}

      <CustomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF8F5' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingVertical: 12 
  },
  logoText: { fontSize: 24, color: '#3A2214', fontFamily: 'Inter-Bold', letterSpacing: -0.5 },
  profileImage: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#FFFFFF', backgroundColor: '#EFEFEF' },
  
  tabOuterContainer: { paddingHorizontal: 24, marginTop: 4 },
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 4, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5EAE4',
    ...Platform.select({
      ios: { shadowColor: '#5C3826', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 }
    })
  },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 16 },
  activeTabBg: { backgroundColor: '#9E5F3B' },
  tabText: { fontSize: 15, color: '#705243', fontFamily: 'Inter-Medium' },
  activeTabText: { color: '#FFFFFF', fontFamily: 'Inter-Bold' },

  categoryBlock: { marginTop: 18, marginBottom: 4 },
  categoryScrollPadding: { paddingLeft: 24, paddingRight: 10 },
  categoryItem: { alignItems: 'center', marginRight: 16, width: 68 },
  categoryIconCircle: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: '#FFFFFF', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F5EAE4',
    ...Platform.select({
      ios: { shadowColor: '#5C3826', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 }
    })
  },
  categoryIconCircleActive: { backgroundColor: '#9E5F3B', borderColor: '#9E5F3B' },
  categoryEmoji: { fontSize: 22 },
  categoryName: { fontSize: 11, color: '#543625', marginTop: 6, textAlign: 'center', fontFamily: 'Inter-Medium' },
  categoryNameActive: { color: '#9E5F3B', fontFamily: 'Inter-Bold' },

  sectionHeader: { paddingHorizontal: 24, marginTop: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 16, color: '#3A2214', fontFamily: 'Inter-Bold', letterSpacing: -0.2 },
  
  listContent: { paddingHorizontal: 24, paddingBottom: 130 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  premiumCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    flexDirection: 'row', 
    padding: 12, 
    marginBottom: 14, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5EAE4',
    ...Platform.select({
      ios: { shadowColor: '#5C3826', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 3 }
    })
  },
  premiumFoodImage: { width: 84, height: 84, borderRadius: 14, backgroundColor: '#F0F0F0' },
  premiumCardInfo: { flex: 1, marginLeft: 14, justifyContent: 'space-between', height: 84, paddingVertical: 2 },
  premiumFoodName: { color: '#3A2214', fontSize: 15, fontFamily: 'Inter-Bold', lineHeight: 18 },
  
  priceBadgeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  premiumFoodPrice: { color: '#D47E13', fontSize: 12, fontFamily: 'Inter-SemiBold' },
  
  premiumActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9E5F3B', 
    paddingVertical: 5, 
    paddingHorizontal: 12, 
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  premiumActionText: { color: '#FFFFFF', fontSize: 10, fontFamily: 'Inter-Bold' },

  cleanEmptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 40, 
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 24, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F5EAE4'
  },
  emptyState: { color: '#9E5F3B', textAlign: 'center', marginTop: 8, fontFamily: 'Inter-Medium', fontSize: 13, opacity: 0.7 },
});