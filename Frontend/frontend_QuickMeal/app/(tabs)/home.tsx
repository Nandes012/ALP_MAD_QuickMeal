import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import CustomNavbar from '../../components/CustomNavbar';
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';
import { API_BASE_URL, getApiHost } from '@/constants/api';
import { useRecipeView } from '@/hooks/useRecipeView';
const { width } = Dimensions.get('window');

interface RecipeItem {
  id: string;
  name: string;
  desc?: string;
  image: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string>('https://via.placeholder.com/150');
  const { saveRecipeView, saving } = useRecipeView();

  const [fontsLoaded] = useFonts({ 
    'Inter-Regular': Langar_400Regular,
    'Inter-Medium': Langar_400Regular,
    'Inter-SemiBold': Langar_400Regular,
    'Inter-Bold': Langar_400Regular
  });

  // Ucapan sesuai waktu otomatis (Menjaga Home tetap interaktif)
  const getTimeGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 11) return { title: 'Selamat Pagi ☀️', sub: 'Sarapan apa kita hari ini?' };
    if (hours < 15) return { title: 'Selamat Siang 🌤️', sub: 'Yuk masakin menu siang yang praktis!' };
    if (hours < 18) return { title: 'Selamat Sore 🍃', sub: 'Waktunya bikin camilan sore kesukaanmu.' };
    return { title: 'Selamat Malam 🌙', sub: 'Makan malam hangat bersama keluarga?' };
  };

  const greeting = getTimeGreeting();

  // ==========================================
  // LOGIKA DATA & FETCHING (ASLI TIDAK BERUBAH)
  // ==========================================
  const {
    data: recommendedRecipes = [],
    isLoading: recommendationsLoading,
  } = useQuery({
    queryKey: ['recommendedRecipes'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/recipes`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const result = await response.json();
      if (result?.success && Array.isArray(result.data)) {
        const mappedRecipes = result.data.map((item: any) => ({
          id: String(item.id),
          name: item.title || item.name || 'Resep',
          desc: item.subtitle || item.description || 'Rekomendasi untuk kamu hari ini',
          image: item.image || item.imageUrl || 'https://via.placeholder.com/500',
        }));
        return mappedRecipes.slice(0, 4);
      }
      return [];
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const {
    data: recentRecipes = [],
    isLoading: recentLoading,
    refetch: refetchRecent,
  } = useQuery({
    queryKey: ['recentRecipes'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return [];
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
          id: String(item.recipe?.id || item.recipe_id || item.id),
          name: item.recipe?.title || item.recipe?.name || item.title || item.name || 'Resep',
          desc: item.recipe?.subtitle || item.recipe?.description || item.subtitle || item.description || 'Resep yang baru dilihat',
          image: item.recipe?.image || item.recipe?.imageUrl || item.image || item.imageUrl || 'https://via.placeholder.com/500',
        }));
        return Array.from(new Map<string, RecipeItem>(mappedRecipes.map((recipe: RecipeItem) => [recipe.id, recipe])).values());
      }
      return [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
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

  useFocusEffect(
    useCallback(() => {
      refetchRecent();
      fetchProfilePicture();
    }, [refetchRecent, fetchProfilePicture])
  );

  if (!fontsLoaded) return null;

  const handleRecipePress = async (item: RecipeItem) => {
    const cleanName = item.name.replace(/\s+/g, ' ').trim();
    const success = await saveRecipeView(item.id);
    if (!success) return;

    router.push({
      pathname: '/detail_resep',
      params: { id: item.id, name: cleanName, imageUrl: item.image }
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
          
          {/* HEADER */}
          <View style={styles.headerHalo}>
            <View style={styles.headerTextCol}>
               <View style={styles.haloRow}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1000/1000390.png' }} style={styles.chefHat} />
                  <Text style={styles.haloTitle}>{greeting.title}</Text>
               </View>
               <Text style={styles.haloSubTitle}>{greeting.sub}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/profile")}>
              <View style={styles.profileContainer}>
                <Image source={{ uri: profilePicture }} style={styles.profilePic} />
                <View style={styles.editBadge}>
                  <Ionicons name="pencil" size={9} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* SECTION REKOMENDASI SPESIAL */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ Rekomendasi Spesial</Text>
            <Text style={styles.sectionSubtitle}>Dibuat khusus untuk menggugah seleramu</Text>
          </View>
          
          {recommendationsLoading ? (
            <View style={styles.loadingBlock}>
              <ActivityIndicator size="large" color="#9E5F3B" />
            </View>
          ) : recommendedRecipes.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.horizontalScroll}
              snapToInterval={width * 0.82 + 16}
              decelerationRate="fast"
            >
              {recommendedRecipes.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.bannerCard} 
                  activeOpacity={0.9} 
                  onPress={() => handleRecipePress(item)}
                  disabled={saving}
                >
                  <Image source={{ uri: item.image }} style={styles.bannerImage} />
                  <View style={styles.bannerTextContent}>
                    <View style={styles.trendingBadge}>
                      <Ionicons name="star" size={10} color="#FFB03A" />
                      <Text style={styles.trendingText}>Pilihan Utama</Text>
                    </View>
                    <Text style={styles.bannerFoodName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.bannerFoodDesc} numberOfLines={2}>{item.desc}</Text>
                    
                    <View style={styles.btnLihatResepSmall}>
                      <Text style={styles.btnResepText}>Lihat Resep</Text>
                      <Ionicons name="arrow-forward-circle" size={14} color="#FFFFFF" style={{marginLeft: 4}} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyState}>Belum ada rekomendasi untuk ditampilkan.</Text>
          )}

          {/* SECTION TERAKHIR DILIHAT */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🕒 Terakhir Dilihat</Text>
            <Text style={styles.sectionSubtitle}>Jangan sampai lupa resep yang kamu incar kemarin</Text>
          </View>

          {recentLoading ? (
            <View style={styles.loadingBlock}>
              <ActivityIndicator size="large" color="#9E5F3B" />
            </View>
          ) : recentRecipes.length > 0 ? (
            <View style={styles.gridContainer}>
              {recentRecipes.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.gridCard} 
                  activeOpacity={0.9}
                  onPress={() => handleRecipePress(item)}
                  disabled={saving}
                >
                  <Image source={{ uri: item.image }} style={styles.gridImage} />
                  <View style={styles.gridOverlay}>
                    <Text style={styles.gridFoodName} numberOfLines={2}>{item.name}</Text>
                    <View style={styles.btnLihatResepGrid}>
                       <Text style={styles.btnResepTextSmall}>Detail</Text>
                       <Ionicons name="chevron-forward" size={11} color="#FFFFFF" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.cleanEmptyContainer}>
              <Ionicons name="time-outline" size={26} color="#C4A493" />
              <Text style={styles.emptyState}>Belum ada resep yang dilihat belakangan ini.</Text>
            </View>
          )}

        </ScrollView>
      </SafeAreaView>

      <CustomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF8F5' },
  
  headerHalo: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 16,
    marginBottom: 10
  },
  headerTextCol: { flex: 1 },
  haloRow: { flexDirection: 'row', alignItems: 'center' },
  chefHat: { width: 26, height: 26, marginRight: 6, resizeMode: 'contain' },
  haloTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#3A2214', letterSpacing: -0.4 },
  haloSubTitle: { fontSize: 14, color: '#705243', marginTop: 3, fontFamily: 'Inter-Medium', opacity: 0.85 },
  
  profileContainer: { position: 'relative', padding: 2 },
  profilePic: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#FFFFFF', backgroundColor: '#EFEFEF' },
  editBadge: { 
    position: 'absolute', 
    right: 0, 
    bottom: 2, 
    backgroundColor: '#9E5F3B', 
    borderRadius: 10, 
    width: 18, 
    height: 18, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FCF8F5'
  },
  
  sectionHeader: { paddingHorizontal: 24, marginTop: 22, marginBottom: 12 },
  sectionTitle: { fontSize: 18, color: '#3A2214', fontFamily: 'Inter-Bold', letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 12, color: '#9C8070', fontFamily: 'Inter-Regular', marginTop: 1 },
  
  horizontalScroll: { paddingLeft: 24, paddingRight: 8 },
  
  bannerCard: { 
    backgroundColor: '#FFFFFF', 
    marginRight: 16, 
    borderRadius: 24, 
    flexDirection: 'row', 
    padding: 14, 
    alignItems: 'center', 
    width: width * 0.82, 
    height: 140,
    borderWidth: 1,
    borderColor: '#F5EAE4',
    ...Platform.select({
      ios: { shadowColor: '#5C3826', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 4 }
    })
  },
  bannerImage: { width: 112, height: 112, borderRadius: 18, resizeMode: 'cover' },
  bannerTextContent: { flex: 1, paddingLeft: 14, justifyContent: 'space-between', height: '100%' },
  
  trendingBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF6E9', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 6, 
    alignSelf: 'flex-start' 
  },
  trendingText: { color: '#D47E13', fontSize: 9, fontFamily: 'Inter-Bold', marginLeft: 3 },
  
  bannerFoodName: { color: '#3A2214', fontSize: 16, fontFamily: 'Inter-Bold', marginTop: 4 },
  bannerFoodDesc: { color: '#8A6E5F', fontSize: 11, fontFamily: 'Inter-Regular', marginVertical: 2, lineHeight: 14 },
  
  // Tombol Coklat Solid Rekomendasi
  btnLihatResepSmall: { 
    backgroundColor: '#9E5F3B', 
    paddingVertical: 5, 
    paddingHorizontal: 12, 
    borderRadius: 12, 
    alignSelf: 'flex-start', 
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: 4 
  },
  btnResepText: { color: '#FFFFFF', fontSize: 11, fontFamily: 'Inter-Bold' },
  
  loadingBlock: { minHeight: 140, alignItems: 'center', justifyContent: 'center' },
  cleanEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F5EAE4',
  },
  emptyState: { color: '#9E5F3B', textAlign: 'center', marginHorizontal: 24, fontFamily: 'Inter-Medium', fontSize: 12, opacity: 0.7, marginTop: 4 },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, justifyContent: 'space-between' },
  gridCard: { 
    width: '47%', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    marginBottom: 16, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F5EAE4',
    ...Platform.select({
      ios: { shadowColor: '#5C3826', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 3 }
    })
  },
  gridImage: { 
    width: '100%', 
    height: 120, 
    resizeMode: 'cover' 
  },
  gridOverlay: { 
    padding: 12, 
    justifyContent: 'space-between',
    flex: 1
  },
  gridFoodName: { color: '#3A2214', fontSize: 13, fontFamily: 'Inter-SemiBold', lineHeight: 16, marginBottom: 8, minHeight: 32 },
  
  // Pembaruan Tombol Grid: Diubah menjadi Coklat Solid agar konsisten
  btnLihatResepGrid: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9E5F3B', 
    paddingVertical: 4, 
    paddingHorizontal: 12, 
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  btnResepTextSmall: { color: '#FFFFFF', fontSize: 10, fontFamily: 'Inter-Bold', marginRight: 2 },
});