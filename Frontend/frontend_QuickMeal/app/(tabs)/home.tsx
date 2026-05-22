import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomNavbar from '../../components/CustomNavbar';
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';
import { API_BASE_URL, getApiHost } from '@/constants/api';
import { useRecipeView } from '@/hooks/useRecipeView';
const { width } = Dimensions.get('window');

interface RecipeItem {
  id: any;
  name: string;
  desc?: string;
  image: string;
}

const CATEGORIES = [
  { id: 'all', name: 'Semua', icon: '🍽️', searchKey: 'All' },
  { id: '1', name: 'Gorengan', icon: '🔥', searchKey: 'Goreng' },
  { id: '2', name: 'Sayuran', icon: '🥬', searchKey: 'Sayur' },
  { id: '3', name: 'Seafood', icon: '🐟', searchKey: 'Ikan' },
  { id: '4', name: 'Olahan Ayam', icon: '🍗', searchKey: 'Ayam' },
  { id: '5', name: 'Daging', icon: '🥩', searchKey: 'Daging' },
];

export default function HomeScreen() {
  const router = useRouter();
  
  const [allRecommended, setAllRecommended] = useState<RecipeItem[]>([]);
  const [displayedRecipes, setDisplayedRecipes] = useState<RecipeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [recentRecipes, setRecentRecipes] = useState<RecipeItem[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string>('https://via.placeholder.com/150');
  const { saveRecipeView } = useRecipeView();

  const [fontsLoaded] = useFonts({ 
    'Inter-Regular': Langar_400Regular,
    'Inter-Medium': Langar_400Regular,
    'Inter-SemiBold': Langar_400Regular,
    'Inter-Bold': Langar_400Regular
  });

  const fetchRecommendedRecipes = useCallback(async () => {
    try {
      setRecommendationsLoading(true);
      const response = await fetch(`${API_BASE_URL}/recipes`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      if (result?.success && Array.isArray(result.data)) {
        const mappedRecipes = result.data.map((item: any) => ({
          id: item.id,
          name: item.title || item.name || 'Resep',
          desc: item.subtitle || item.description || 'Rekomendasi hari ini',
          image: item.image || item.imageUrl || 'https://via.placeholder.com/500',
        }));

        setAllRecommended(mappedRecipes);
        setDisplayedRecipes(mappedRecipes);
      } else {
        setAllRecommended([]);
        setDisplayedRecipes([]);
      }
    } catch (error) {
      console.error('Failed to fetch recommended recipes:', error);
      setAllRecommended([]);
      setDisplayedRecipes([]);
    } finally {
      setRecommendationsLoading(false);
    }
  }, []);

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

  const fetchRecentRecipes = useCallback(async () => {
    try {
      setRecentLoading(true);
      const token = await AsyncStorage.getItem('auth_token');

      if (!token) {
        setRecentRecipes([]);
        setRecentLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/recent-viewed-recipes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const result = await response.json();
      if (Array.isArray(result?.data)) {
        const mappedRecipes = result.data.map((item: any) => ({
          id: item.recipe?.id || item.recipe_id || item.id,
          name: item.recipe?.title || item.recipe?.name || item.title || item.name || 'Resep',
          desc: item.recipe?.subtitle || item.recipe?.description || item.subtitle || item.description || 'Resep yang baru dilihat',
          image: item.recipe?.image || item.recipe?.imageUrl || item.image || item.imageUrl || 'https://via.placeholder.com/500',
        }));

        const uniqueRecipes = Array.from(new Map<string, RecipeItem>(mappedRecipes.map((recipe: RecipeItem) => [String(recipe.id), recipe])).values());
        setRecentRecipes(uniqueRecipes);
      } else {
        setRecentRecipes([]);
      }
    } catch (error) {
      console.error('Failed to fetch recent recipes:', error);
      setRecentRecipes([]);
    } finally {
      setRecentLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendedRecipes();
  }, [fetchRecommendedRecipes]);

  // Menggunakan callback focus effect secara ketat untuk memantau perubahan halaman balik
  useFocusEffect(
    useCallback(() => {
      fetchRecentRecipes();
      fetchProfilePicture();
    }, [fetchRecentRecipes, fetchProfilePicture])
  );

  const handleRecipePress = async (item: RecipeItem) => {
    const cleanName = item.name.replace(/\s+/g, ' ').trim();
    
    // 1. UPDATE STATE LOKAL SECARA INSTAN (Optimistic Update)
    setRecentRecipes((prevRecipes) => {
      const exists = prevRecipes.some((r) => String(r.id) === String(item.id));
      if (exists) {
        const filtered = prevRecipes.filter((r) => String(r.id) !== String(item.id));
        return [item, ...filtered];
      }
      return [item, ...prevRecipes];
    });

    // 2. TIMEOUT & PUSH NAVIGASI
    // Menggunakan router.navigate alih-alih router.push agar tumpukan screen mendeteksi efek 'kembali' (unmount)
    router.navigate({
      pathname: '/detail_resep',
      params: { id: String(item.id), name: cleanName, imageUrl: item.image }
    });

    // 3. JALANKAN PROSES SIMPAN API DI BELAKANG LAYAR
    try {
      await saveRecipeView(Number(item.id)).catch(async () => {
        await saveRecipeView(String(item.id));
      });
      
      // Sinkronisasi paksa sekali lagi agar data lokal sinkron dengan database
      fetchRecentRecipes();
    } catch (err) {
      console.warn("Gagal mencatat log resep dilihat:", err);
    }
  };

  const handleCategoryPress = (categoryId: string, searchKey: string) => {
    setSelectedCategory(categoryId);
    
    if (categoryId === 'all') {
      setDisplayedRecipes(allRecommended);
    } else {
      const filtered = allRecommended.filter(recipe => 
        recipe.name.toLowerCase().includes(searchKey.toLowerCase()) || 
        (recipe.desc && recipe.desc.toLowerCase().includes(searchKey.toLowerCase()))
      );
      setDisplayedRecipes(filtered);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          
          {/* HEADER */}
          <View style={styles.headerHalo}>
            <View style={styles.headerTextCol}>
               <View style={styles.haloRow}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1000/1000390.png' }} style={styles.chefHat} />
                  <Text style={styles.haloTitle}>Halo,</Text>
               </View>
               <Text style={styles.haloSubTitle}>Mau masak apa hari ini?</Text>
            </View>
            <TouchableOpacity onPress={() => router.navigate("/profile")}>
              <View style={styles.profileContainer}>
                <Image source={{ uri: profilePicture }} style={styles.profilePic} />
                <View style={styles.editBadge}><Ionicons name="pencil" size={8} color="white" /></View>
              </View>
            </TouchableOpacity>
          </View>

          {/* SECTION KATEGORI HORIZONTAL */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pilih Kategori</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity 
                  key={cat.id} 
                  style={styles.categoryItem} 
                  onPress={() => handleCategoryPress(cat.id, cat.searchKey)}
                >
                  <View style={[styles.categoryIconCircle, isSelected && styles.categoryIconCircleActive]}>
                    <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                  </View>
                  <Text style={[styles.categoryName, isSelected && styles.categoryNameActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* REKOMENDASI UTAMA / HASIL FILTER KATEGORI */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? '✨ Rekomendasi buat kamu' : '🔍 Hasil Filter Makanan'}
            </Text>
          </View>
          
          {recommendationsLoading ? (
            <View style={styles.loadingBlock}>
              <ActivityIndicator size="large" color="#9E5F3B" />
            </View>
          ) : displayedRecipes.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {displayedRecipes.map((item) => (
                <TouchableOpacity key={String(item.id)} style={styles.bannerCard} activeOpacity={0.8} onPress={() => handleRecipePress(item)}>
                  <Image source={{ uri: item.image }} style={styles.bannerImage} />
                  <View style={styles.bannerTextContent}>
                    <Text style={styles.bannerFoodName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.bannerFoodDesc} numberOfLines={2}>{item.desc}</Text>
                    <View style={styles.btnLihatResepSmall}>
                      <Text style={styles.btnResepText}>Lihat Resep ›</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyState}>Tidak ada resep makanan kategori ini ditemukan.</Text>
          )}

          {/* TERAKHIR DILIHAT */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🕒 Resep Yang Sudah dilihat</Text>
          </View>

          {recentLoading ? (
            <View style={styles.loadingBlock}>
              <ActivityIndicator size="large" color="#9E5F3B" />
            </View>
          ) : recentRecipes.length > 0 ? (
            <View style={styles.gridContainer}>
              {recentRecipes.map((item) => (
                <TouchableOpacity key={String(item.id)} style={styles.gridCard} onPress={() => handleRecipePress(item)}>
                  <Image source={{ uri: item.image }} style={styles.gridImage} />
                  <View style={styles.gridOverlay}>
                    <Text style={styles.gridFoodName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.btnLihatResepGrid}>
                       <Text style={styles.btnResepTextSmall}>Detail ›</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyState}>Belum ada resep yang dilihat.</Text>
          )}

        </ScrollView>
      </SafeAreaView>
      <CustomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  headerHalo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  headerTextCol: { flex: 1 },
  haloRow: { flexDirection: 'row', alignItems: 'center' },
  chefHat: { width: 32, height: 32, marginRight: 8 },
  haloTitle: { fontSize: 26, fontFamily: 'Inter-Bold', color: '#9E5F3B' },
  haloSubTitle: { fontSize: 16, color: '#9E5F3B', marginTop: 4, fontFamily: 'Inter-Medium', opacity: 0.7 },
  profileContainer: { position: 'relative' },
  profilePic: { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: '#9E5F3B' },
  editBadge: { position: 'absolute', right: 0, bottom: 0, backgroundColor: '#5b2f20', borderRadius: 10, padding: 3 },
  sectionHeader: { paddingHorizontal: 20, marginTop: 22, marginBottom: 12 },
  sectionTitle: { fontSize: 17, color: '#9E5F3B', fontFamily: 'Inter-Bold' },
  categoryScroll: { paddingLeft: 20, paddingRight: 10 },
  categoryItem: { alignItems: 'center', marginRight: 16, width: 72 },
  categoryIconCircle: { 
    width: 58, 
    height: 58, 
    borderRadius: 29, 
    backgroundColor: '#FFFFFF', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F2E6DF',
    elevation: 2,
    shadowColor: '#9E5F3B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  categoryIconCircleActive: {
    borderColor: '#9E5F3B',
    backgroundColor: '#F7EAE1',
    borderWidth: 2,
  },
  categoryEmoji: { fontSize: 24 },
  categoryName: { fontSize: 11, color: '#7A6050', marginTop: 6, textAlign: 'center', fontFamily: 'Inter-Medium' },
  categoryNameActive: { color: '#9E5F3B', fontFamily: 'Inter-Bold' },
  horizontalScroll: { paddingLeft: 20, paddingRight: 5 },
  bannerCard: { 
    backgroundColor: '#FFFFFF', marginRight: 15, borderRadius: 20, flexDirection: 'row', padding: 12, alignItems: 'center', width: width * 0.84, height: 124,
    borderWidth: 1, borderColor: '#F2E6DF', elevation: 3, shadowColor: '#9E5F3B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 
  },
  bannerImage: { width: 100, height: 100, borderRadius: 16, resizeMode: 'cover', marginRight: 14 },
  bannerTextContent: { flex: 1, justifyContent: 'center' },
  bannerFoodName: { color: '#4A2A18', fontSize: 16, fontFamily: 'Inter-Bold' },
  bannerFoodDesc: { color: '#7A6050', fontSize: 12, marginVertical: 4, fontFamily: 'Inter-Regular' },
  btnLihatResepSmall: { backgroundColor: '#9E5F3B', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 12, alignSelf: 'flex-start', marginTop: 2 },
  btnResepText: { color: 'white', fontSize: 11, fontFamily: 'Inter-Bold' },
  loadingBlock: { minHeight: 140, alignItems: 'center', justifyContent: 'center' },
  emptyState: { color: '#9E5F3B', textAlign: 'center', marginHorizontal: 20, paddingVertical: 40, fontFamily: 'Inter-Medium', fontSize: 13 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  gridCard: { 
    width: '47%', backgroundColor: '#FFFFFF', borderRadius: 18, marginBottom: 15, overflow: 'hidden',
    borderWidth: 1, borderColor: '#F2E6DF', elevation: 2, shadowColor: '#9E5F3B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3
  },
  gridImage: { width: '100%', height: 110, resizeMode: 'cover' },
  gridOverlay: { padding: 10, alignItems: 'flex-start' },
  gridFoodName: { color: '#4A2A18', fontSize: 13, fontFamily: 'Inter-SemiBold', marginBottom: 6 },
  btnLihatResepGrid: { backgroundColor: '#9E5F3B', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
  btnResepTextSmall: { color: 'white', fontSize: 10, fontFamily: 'Inter-Bold' },
});