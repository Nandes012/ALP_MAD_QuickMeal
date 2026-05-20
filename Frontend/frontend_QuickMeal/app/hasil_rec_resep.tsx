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

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Build query string with filter parameters
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
          time: item.time
        }
      });
    }
  };

  const renderCard = (item: ResepItem) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => handleRecipePress(item)}
      disabled={saving}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        
        <View style={styles.cardRow}>
          <Text style={styles.cardPrice}>Rp. {item.price}</Text>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.cardTime}>{item.time}</Text>
          </View>
        </View>
        {saving ? (
          <ActivityIndicator size="small" color="white" style={{ marginTop: 6 }} />
        ) : (
          <Text style={styles.detailText}>Lihat Resep</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9E5F3B" />
      
      {/* 1. BAGIAN BACKGROUND YANG BISA KAMU UBAH SENDIRI JALURNYA */}
      <ImageBackground 
        source={require('../assets/images/cook.png')} // Silakan ganti nama file gambar latar belakang di sini
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay transparan tipis krem agar teks/konten di atas gambar latar belakang tetap terbaca jelas */}
        <View style={styles.darkOverlay}>
          
          {/* HEADER COKELAT SOLID */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerSubtitle}>
              Berdasarkan waktu, budget & bahan kamu, kami rekomendasikan masak sendiri
            </Text>
            {(time || budgetMin || budgetMax || ingredients) && (
              <View style={{ marginTop: 15, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 }}>
                {time && (
                  <Text style={{ color: 'white', fontSize: 12, marginBottom: 4 }}>
                    Waktu: {Math.floor(Number(time) / 60)}h {Number(time) % 60}m
                  </Text>
                )}
                {(budgetMin || budgetMax) && <Text style={{ color: 'white', fontSize: 12, marginBottom: 4 }}> Budget: Rp {budgetMin} - Rp {budgetMax}</Text>}
                {ingredients && <Text style={{ color: 'white', fontSize: 12 }}> Bahan: {ingredients}</Text>}
              </View>
            )}
          </View>
          
          {/* DAFTAR KONTEN */}
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
              ListHeaderComponent={<Text style={styles.sectionTitle}>Rekomendasi Terbaik</Text>}
              ListFooterComponent={
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.sectionTitle}>Pilihan Lainnya</Text>
                  {otherRecipes.length > 0 ? (
                    otherRecipes.map((item) => renderCard(item))
                  ) : (
                    <Text style={styles.emptyText}>Belum ada rekomendasi lain.</Text>
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
                <TouchableOpacity style={styles.centerIconBg} onPress={() => router.push('/food_rec')}>
                  <Ionicons name="search" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.navTextCenter}>Get Food Rec</Text>
              </View>

              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/explore')}>
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
  darkOverlay: { flex: 1, backgroundColor: 'rgba(255, 248, 239, 0.4)' }, // Mengatur kepekatan background (ubah 0.4 jika ingin lebih transparan/gelap)
  headerContainer: { 
    backgroundColor: '#9E5F3B', 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingBottom: 25, 
    paddingHorizontal: 30,
    alignItems: 'center'
  },
  headerSubtitle: { 
    color: 'white', 
    fontSize: 14, 
    fontWeight: '600',
    textAlign: 'center', 
    lineHeight: 20 
  },
  listContent: { 
    paddingHorizontal: 25, 
    paddingTop: 20,
    paddingBottom: 110 // Mencegah konten tertutup oleh bar navigasi bawah
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#8D5B3E', 
    marginBottom: 15,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
  },
  card: { 
    backgroundColor: '#9E5F3B', 
    borderRadius: 15, 
    flexDirection: 'row', 
    padding: 12, 
    marginBottom: 15, 
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  cardImage: { width: 75, height: 75, borderRadius: 12, backgroundColor: '#EAEAEA' },
  cardInfo: { flex: 1, marginLeft: 15 },
  cardTitle: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  cardPrice: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 12, fontWeight: '500', marginRight: 20 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  cardTime: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 12, marginLeft: 4 },
  detailText: { color: 'white', fontSize: 12, textDecorationLine: 'underline', marginTop: 6, fontWeight: '500' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  loadingText: { color: '#8D5B3E', marginTop: 12, fontSize: 14, fontWeight: '600' },
  errorText: { color: '#B00020', fontSize: 14, textAlign: 'center', fontWeight: '600' },
  emptyText: { color: '#8D5B3E', fontSize: 13, textAlign: 'center', marginTop: 12 },
  
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
    borderColor: '#FFF8EF', // Border luar tombol mengikuti warna dasar krem proyekmu
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