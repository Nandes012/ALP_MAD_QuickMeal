import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// --- IMPORT FONT LANGAR ---
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';

interface FoodItem {
  id: string;
  name: string;
  rating: string;
  desc: string;
  imageUri: string;
}

type RecipeApiItem = {
  id: string | number;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  cookingTime?: number | null;
  difficulty?: string | null;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function HomeScreen() {
  const router = useRouter();
  const [popularFood, setPopularFood] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // --- MEMUAT FONT ---
  const [fontsLoaded] = useFonts({
    'Langar-Regular': Langar_400Regular,
  });

  useEffect(() => {
    const fetchPopularFood = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/recipes/popular`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (result?.success && Array.isArray(result.data)) {
          const mappedFood = result.data.map((recipe: RecipeApiItem) => ({
            id: String(recipe.id),
            name: recipe.title,
            rating: recipe.cookingTime ? `${recipe.cookingTime}m` : recipe.difficulty || 'Populer',
            desc: recipe.subtitle || 'Resep populer hari ini.',
            imageUri: recipe.image || 'https://via.placeholder.com/500',
          }));

          setPopularFood(mappedFood);
        } else {
          setPopularFood([]);
        }
      } catch (error) {
        console.error('Failed to fetch popular recipes:', error);
        setPopularFood([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularFood();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const renderFoodCard = (item: FoodItem) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.card} 
      activeOpacity={0.9}
      // Tambahan: Klik area kartu juga bisa masuk ke detail
      onPress={() => router.push({
        pathname: "/detail_order",
        params: { name: item.name, rating: item.rating, image: item.imageUri }
      })}
    >
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.foodName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
          <Text style={styles.foodDesc} numberOfLines={2}>{item.desc}</Text>
          
          {/* PERUBAHAN DI SINI: Navigasi saat klik Lihat Detail */}
          <TouchableOpacity 
            onPress={() => router.push({
              pathname: "/detail_order",
              params: { name: item.name, rating: item.rating, image: item.imageUri }
            })}
          >
            <Text style={styles.detailText}>Lihat Detail</Text>
          </TouchableOpacity>
        </View>
        <Image source={{ uri: item.imageUri }} style={styles.foodImage} />
      </View>
    </TouchableOpacity>
  );

  let popularFoodContent: React.ReactNode;

  if (loading) {
    popularFoodContent = (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9E5F3B" />
        <Text style={styles.loadingText}>Memuat makanan populer...</Text>
      </View>
    );
  } else if (popularFood.length === 0) {
    popularFoodContent = (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Belum ada makanan populer untuk ditampilkan.</Text>
      </View>
    );
  } else {
    popularFoodContent = popularFood.map((item) => renderFoodCard(item));
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerBar}>
          <Text style={styles.logoText}>QuickMeal</Text>
          
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={() => router.push("/profile" as any)}
          >
            <Image 
              source={{ uri: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg' }} 
              style={styles.profilePic} 
            />
            <View style={styles.editIconBadge}>
               <Ionicons name="pencil" size={8} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://img.freepik.com/free-photo/top-view-circular-food-frame_23-2148723447.jpg' }} 
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Makanan Populer</Text>
        </View>

        <View style={styles.listContainer}>
          {popularFoodContent}
        </View>
        
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoText: { 
    fontSize: 28, 
    color: '#9E5F3B', 
    fontFamily: 'Langar-Regular', 
  },
  profileButton: { position: 'relative' },
  profilePic: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#5b2f20' 
  },
  editIconBadge: { 
    position: 'absolute', 
    right: -2, 
    bottom: -2, 
    backgroundColor: '#5b2f20', 
    borderRadius: 10, 
    padding: 2 
  },
  bannerContainer: { width: '100%', height: 180 },
  bannerImage: { width: '100%', height: '100%' },
  sectionTitleContainer: { paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#9E5F3B', 
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' 
  },
  listContainer: { paddingHorizontal: 20 },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    marginTop: 10,
    color: '#9E5F3B',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#9E5F3B',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#9E5F3B',
    borderRadius: 25,
    marginBottom: 15,
    padding: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  textContainer: { flex: 1, paddingRight: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  foodName: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: 'white', fontSize: 14, marginLeft: 4, fontWeight: '600' },
  foodDesc: { color: 'white', fontSize: 13, marginBottom: 10, opacity: 0.9, lineHeight: 18 },
  detailText: { color: 'white', fontSize: 13, textDecorationLine: 'underline', fontWeight: '500' },
  foodImage: { width: 90, height: 90, borderRadius: 15, backgroundColor: '#eee' },
});