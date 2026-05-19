import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomNavbar from '../../components/CustomNavbar';
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';
import { API_BASE_URL } from '@/constants/api';
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
  const [recommendedRecipes, setRecommendedRecipes] = useState<RecipeItem[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<RecipeItem[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const { saveRecipeView, saving } = useRecipeView();
  const profilePicture = 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg';

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
          id: String(item.id),
          name: item.title || item.name || 'Resep',
          desc: item.subtitle || item.description || 'Rekomendasi untuk kamu hari ini',
          image: item.image || item.imageUrl || 'https://via.placeholder.com/500',
        }));

        setRecommendedRecipes(mappedRecipes.slice(0, 4));
      } else {
        setRecommendedRecipes([]);
      }
    } catch (error) {
      console.error('Failed to fetch recommended recipes:', error);
      setRecommendedRecipes([]);
    } finally {
      setRecommendationsLoading(false);
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

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      if (Array.isArray(result?.data)) {
        const mappedRecipes = result.data.map((item: any) => ({
          id: String(item.recipe?.id || item.recipe_id || item.id),
          name: item.recipe?.title || item.recipe?.name || item.title || item.name || 'Resep',
          desc: item.recipe?.subtitle || item.recipe?.description || item.subtitle || item.description || 'Resep yang baru dilihat',
          image: item.recipe?.image || item.recipe?.imageUrl || item.image || item.imageUrl || 'https://via.placeholder.com/500',
        }));

        const uniqueRecipes = Array.from(new Map<string, RecipeItem>(mappedRecipes.map((recipe: RecipeItem) => [recipe.id, recipe])).values());
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
  }, [fetchRecommendedRecipes, fetchRecentRecipes]);

  useFocusEffect(
    useCallback(() => {
      fetchRecentRecipes();
    }, [fetchRecentRecipes])
  );

  if (!fontsLoaded) return null;

  const handleRecipePress = async (item: RecipeItem) => {
    const cleanName = item.name.replace(/\s+/g, ' ').trim();

    const success = await saveRecipeView(item.id);
    if (!success) {
      return;
    }

    router.push({
      pathname: '/detail_resep',
      params: { id: item.id, name: cleanName, imageUrl: item.image }
    });
  };

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
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <View style={styles.profileContainer}>
                  <Image source={{ uri: profilePicture }} style={styles.profilePic} />
                <View style={styles.editBadge}><Ionicons name="pencil" size={8} color="white" /></View>
              </View>
            </TouchableOpacity>
          </View>

          {/* SECTION: REKOMENDASI (HORIZONTAL) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rekomendasi buat kamu hari ini</Text>
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
            >
              {recommendedRecipes.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.bannerCard} 
                  activeOpacity={0.9} 
                  onPress={() => handleRecipePress(item)}
                  disabled={saving}
                >
                  <View style={styles.bannerTextContent}>
                    <Text style={styles.bannerFoodName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.bannerFoodDesc} numberOfLines={2}>{item.desc}</Text>
                    <View style={styles.btnLihatResepSmall}>
                      <Text style={styles.btnResepText}>Lihat Resep</Text>
                    </View>
                  </View>
                  <Image source={{ uri: item.image }} style={styles.bannerImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyState}>Belum ada rekomendasi untuk ditampilkan.</Text>
          )}

          {/* SECTION: RESEP DILIHAT (GRID VERTICAL) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Resep Yang Sudah di Lihat</Text>
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
                  onPress={() => handleRecipePress(item)}
                  disabled={saving}
                >
                  <Image source={{ uri: item.image }} style={styles.gridImage} />
                  <View style={styles.gridOverlay}>
                    <Text style={styles.gridFoodName} numberOfLines={2}>{item.name}</Text>
                    <View style={styles.btnLihatResepGrid}>
                       <Text style={styles.btnResepTextSmall}>Lihat Resep</Text>
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
  chefHat: { width: 35, height: 35, marginRight: 8 },
  haloTitle: { fontSize: 28, fontFamily: 'Inter-Bold', color: '#9E5F3B' },
  haloSubTitle: { fontSize: 18, color: '#9E5F3B', marginTop: 5, fontFamily: 'Inter-Medium', opacity: 0.6 },
  profileContainer: { position: 'relative' },
  profilePic: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#9E5F3B' },
  editBadge: { position: 'absolute', right: 0, bottom: 0, backgroundColor: '#5b2f20', borderRadius: 10, padding: 3 },
  sectionHeader: { paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 18, color: '#9E5F3B', fontFamily: 'Inter-Bold' },
  horizontalScroll: { paddingLeft: 20, paddingRight: 5 },
  bannerCard: { 
    backgroundColor: '#9E5F3B', 
    marginRight: 15, 
    borderRadius: 25, 
    flexDirection: 'row', 
    padding: 15, 
    alignItems: 'center', 
    width: width * 0.82, 
    height: 150 
  },
  bannerTextContent: { flex: 1, paddingRight: 10 },
  bannerFoodName: { color: 'white', fontSize: 20, fontFamily: 'Inter-Bold' },
  bannerFoodDesc: { color: 'white', fontSize: 12, marginVertical: 6, opacity: 0.9, fontFamily: 'Inter-Regular' },
  bannerImage: { width: 100, height: 100, borderRadius: 18, resizeMode: 'cover' },
  btnLihatResepSmall: { backgroundColor: 'rgba(255,255,255,0.25)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, alignSelf: 'flex-start' },
  btnResepText: { color: 'white', fontSize: 11, fontFamily: 'Inter-Bold' },
  loadingBlock: { minHeight: 180, alignItems: 'center', justifyContent: 'center' },
  emptyState: { color: '#9E5F3B', textAlign: 'center', marginHorizontal: 20, marginTop: 10, fontFamily: 'Inter-Medium' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  gridCard: { 
    width: '47%', 
    height: 250, 
    backgroundColor: '#9E5F3B', 
    borderRadius: 25, 
    marginBottom: 15, 
    overflow: 'hidden' 
  },
  gridImage: { 
    width: '100%', 
    height: '52%', 
    resizeMode: 'cover' 
  },
  gridOverlay: { 
    padding: 12, 
    flex: 1, 
    justifyContent: 'space-between' 
  },
  gridFoodName: { color: 'white', fontSize: 14, fontFamily: 'Inter-SemiBold', lineHeight: 18 },
  btnLihatResepGrid: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, alignSelf: 'flex-start' },
  btnResepTextSmall: { color: 'white', fontSize: 10, fontFamily: 'Inter-Bold' },
});