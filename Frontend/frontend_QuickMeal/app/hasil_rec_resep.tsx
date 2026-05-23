import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, StatusBar, Platform, ImageBackground, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRecipeView } from '@/hooks/useRecipeView';
import { API_BASE_URL } from '@/constants/api';

interface ResepItem {
  id: string;
  title: string;
  price: string;
  time: string;
  image: string;
  ingredients?: Array<{
    id?: string;
    ingredient_id?: string;
    ingredient_name?: string;
    quantity?: string;
    price_estimate?: number;
  }>;
}

export default function HasilRecResepScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { saveRecipeView, saving } = useRecipeView();
  const [recipes, setRecipes] = useState<ResepItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract parameters from route
  const time = params.time as string;
  const budgetMin = params.budgetMin as string;
  const budgetMax = params.budgetMax as string;
  const ingredients = params.ingredients as string;

  const summaryTime = useMemo(() => {
    if (!time) return '-';
    const total = Number(time);
    const hours = Math.floor(total / 60);
    const minutes = total % 60;

    if (hours > 0 && minutes > 0) return `${hours} jam ${minutes} menit`;
    if (hours > 0) return `${hours} jam`;
    return `${minutes} menit`;
  }, [time]);

  const ingredientList = useMemo(() => {
    if (!ingredients) return [];
    return ingredients
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }, [ingredients]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (time) queryParams.append('time', time);
        if (budgetMin) queryParams.append('budgetMin', budgetMin);
        if (budgetMax) queryParams.append('budgetMax', budgetMax);
        if (ingredients) queryParams.append('ingredients', ingredients);

        const response = await fetch(`${API_BASE_URL}/recipes?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (result?.success && Array.isArray(result.data)) {
          const mappedRecipes = result.data.map((item: any) => ({
            id: String(item.id),
            title: item.title || item.name || 'Resep',
            price: Number(item.totalIngredientPrice || item.price || 0).toLocaleString('id-ID'),
            time: item.cookingTime ? `${item.cookingTime} Menit` : '20 Menit',
            image: item.image || item.imageUrl || 'https://via.placeholder.com/300',
            ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
          }));

          setRecipes(mappedRecipes);
          setError(null);
        } else {
          setRecipes([]);
          setError('Data rekomendasi tidak tersedia');
        }
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError(err instanceof Error ? err.message : 'Gagal memuat rekomendasi');
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [time, budgetMin, budgetMax, ingredients]);

  const topRecipes = useMemo(() => recipes.slice(0, 3), [recipes]);
  const otherRecipes = useMemo(() => recipes.slice(3, 6), [recipes]);

  const handleRecipePress = async (item: ResepItem) => {
    const success = await saveRecipeView(item.id);
    if (success) {
      router.push({
        pathname: '/detail_resep',
        params: { 
          id: item.id,
          name: item.title, 
          imageUrl: item.image,
          price: item.price,
          time: item.time,
          ingredients: ingredients || ''
        }
      });
    }
  };

  const renderCard = (item: ResepItem) => {
    return (
      <TouchableOpacity 
        key={item.id} 
        style={styles.premiumCard}
        activeOpacity={0.85}
        onPress={() => handleRecipePress(item)}
        disabled={saving}
      >
        <Image source={{ uri: item.image }} style={styles.premiumFoodImage} resizeMode="cover" />
        <View style={styles.premiumCardInfo}>
          <View>
            <Text style={styles.premiumFoodName} numberOfLines={1}>{item.title}</Text>
            
            <View style={styles.cardRow}>
              <View style={styles.priceBadgeContainer}>
                <Ionicons name="pricetag-outline" size={11} color="#D47E13" style={{ marginRight: 4 }} />
                <Text style={styles.premiumFoodPrice}>Rp {item.price}</Text>
              </View>
              
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={12} color="#705243" style={{ marginRight: 4 }} />
                <Text style={styles.premiumFoodTime}>{item.time}</Text>
              </View>
            </View>
          </View>

          {saving ? (
            <ActivityIndicator size="small" color="#9E5F3B" style={{ alignSelf: 'flex-start', marginTop: 4 }} />
          ) : (
            <View style={styles.premiumActionButton}>
              <Text style={styles.premiumActionText}>Lihat Resep</Text>
              <Ionicons name="chevron-forward" size={11} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9E5F3B" />
      
      <ImageBackground 
        source={require('../assets/images/cook.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.darkOverlay}>
          
          {/* HEADER PREMIUM BLEND COKELAT */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerSubtitle}>
              Berdasarkan waktu, budget & bahan kamu, kami rekomendasikan masak sendiri
            </Text>
            
            {(time || budgetMin || budgetMax || ingredients) && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Input dari form</Text>

                <View style={styles.summaryGrid}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Waktu</Text>
                    <Text style={styles.summaryValue}>{summaryTime}</Text>
                  </View>

                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Budget</Text>
                    <Text style={styles.summaryValue}>
                      {budgetMin || budgetMax ? `Rp ${budgetMin || '-'} - Rp ${budgetMax || '-'}` : '-'}
                    </Text>
                  </View>
                </View>

                <View style={styles.summaryItemFull}>
                  <Text style={styles.summaryLabel}>Bahan</Text>
                  <View style={styles.ingredientWrap}>
                    {ingredientList.length > 0 ? (
                      ingredientList.map((ingredient) => (
                        <View key={ingredient} style={styles.ingredientChip}>
                          <Text style={styles.ingredientChipText}>{ingredient}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.summaryValue}>-</Text>
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* AREA KONTEN UTAMA */}
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#9E5F3B" />
              <Text style={styles.loadingText}>Memuat rekomendasi...</Text>
            </View>
          ) : error ? (
            <View style={styles.loadingWrap}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <FlatList
              data={topRecipes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderCard(item)}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={<Text style={styles.sectionTitle}>🔥 Rekomendasi Terbaik</Text>}
              ListFooterComponent={
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.sectionTitle}>💡 Pilihan Lainnya</Text>
                  {otherRecipes.length > 0 ? (
                    otherRecipes.map((item) => renderCard(item))
                  ) : (
                    <View style={styles.cleanEmptyContainer}>
                      <Text style={styles.emptyText}>Belum ada rekomendasi lain.</Text>
                    </View>
                  )}
                </View>
              }
            />
          )}

          {/* --- CUSTOM NAVBAR --- */}
          <View style={styles.navbarContainer}>
            <View style={styles.navbar}>
              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
                <Ionicons name="home-outline" size={24} color="white" />
                <Text style={styles.navText}>Home</Text>
              </TouchableOpacity>

              {/* Tombol Tengah Bulat Menembus Batas */}
              <View style={styles.centerIconWrapper}>
                <TouchableOpacity style={styles.centerIconBg} onPress={() => router.push('/from_resep')}>
                  <Ionicons name="search" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.navTextCenter}>Get Food Rec</Text>
              </View>

              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/list')}>
                <Ionicons name="file-tray-full-outline" size={24} color="white" />
                <Text style={styles.navText}>List</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  darkOverlay: { flex: 1, backgroundColor: 'rgba(252, 248, 245, 0.85)' }, // Diubah menjadi dominan krem cerah agar senada dengan ListScreen
  
  headerContainer: { 
    backgroundColor: '#9E5F3B', 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingBottom: 22, 
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerSubtitle: { 
    color: '#FFFFFF', 
    fontSize: 13, 
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Medium' : 'sans-serif-medium',
    textAlign: 'center', 
    lineHeight: 18,
    opacity: 0.95
  },
  summaryCard: {
    marginTop: 14,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    padding: 12,
  },
  summaryTitle: {
    color: '#FFF8EF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
  },
  summaryItemFull: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
  },
  summaryLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    marginBottom: 4,
    fontWeight: '600',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  ingredientWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ingredientChipText: {
    color: '#9E5F3B',
    fontSize: 11,
    fontWeight: '700',
  },
  
  listContent: { 
    paddingHorizontal: 24, 
    paddingTop: 20,
    paddingBottom: 120 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#3A2214', 
    marginBottom: 12,
    marginTop: 6,
  },

  // Premium UI Card Transformation (Kiblat ListScreen)
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
  premiumFoodName: { color: '#3A2214', fontSize: 15, fontWeight: 'bold', lineHeight: 18 },
  
  cardRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 12 },
  priceBadgeContainer: { flexDirection: 'row', alignItems: 'center' },
  premiumFoodPrice: { color: '#D47E13', fontSize: 12, fontWeight: '600' },
  
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  premiumFoodTime: { color: '#705243', fontSize: 11, fontWeight: '500' },
  
  premiumActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9E5F3B', 
    paddingVertical: 5, 
    paddingHorizontal: 12, 
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  premiumActionText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },

  cleanEmptyContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F5EAE4',
    alignItems: 'center',
  },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  loadingText: { color: '#9E5F3B', marginTop: 12, fontSize: 14, fontWeight: '600' },
  errorText: { color: '#B00020', fontSize: 14, textAlign: 'center', fontWeight: '600' },
  emptyText: { color: '#705243', fontSize: 13, textAlign: 'center' },
  
  // --- BOTTOM FIXED NAVBAR STYLES ---
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#9E5F3B',
    height: 65,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  centerIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  centerIconBg: {
    backgroundColor: '#8D5B3E',
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FCF8F5', 
    marginTop: -35, 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
    color: 'white',
    fontWeight: '500',
  },
  navTextCenter: {
    fontSize: 10,
    color: 'white',
    marginTop: 2,
    fontWeight: '600',
  }
});