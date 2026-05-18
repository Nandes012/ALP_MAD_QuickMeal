import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- IMPORT FONT LANGAR ---
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';
import { API_BASE_URL } from '@/constants/api';
import { useRecipeView } from '@/hooks/useRecipeView';

interface FoodItem {
  id: string;
  name: string;
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

// Helper function to construct profile picture URL
const getProfilePictureUrl = (profilePicture: string | null | undefined): string => {
  if (!profilePicture) {
    return 'https://i.pinimg.com/736x/8b/16/7a/8b1671af653c2399dd93b952a48740620.jpg';
  }
  
  // If it's already a full URL, return as is
  if (profilePicture.startsWith('http')) {
    return profilePicture;
  }
  
  // Construct the storage URL
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}/storage/${profilePicture}`;
};

export default function HomeScreen() {
  const router = useRouter();
  const [popularFood, setPopularFood] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { saveRecipeView, saving } = useRecipeView();

  // --- MEMUAT FONT ---
  const [fontsLoaded] = useFonts({
    'Langar-Regular': Langar_400Regular,
  });

  // Fetch user data
  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        return;
      }

      const url = `${API_BASE_URL}/auth/me`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data);
      }
    } catch (error) {
      console.log("FETCH USER ERROR:", error);
    }
  }

  const fetchRecentRecipes = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');

      if (!token) {
        // If not logged in, show empty state
        setPopularFood([]);
        setLoading(false);
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

      if (result?.data && Array.isArray(result.data)) {
        const mappedFood = result.data.map((item: any) => ({
          id: String(item.recipe?.id || item.recipe_id),
          name: item.recipe?.name || item.recipe?.title || 'Resep',
          desc: item.recipe?.description || item.recipe?.subtitle || 'Resep yang baru dilihat',
          imageUri: item.recipe?.image || item.recipe?.imageUrl || 'https://via.placeholder.com/500',
        }));

        // Deduplicate by recipe ID (keep only first occurrence)
        const uniqueFood = Array.from(new Map(mappedFood.map(item => [item.id, item])).values());

        setPopularFood(uniqueFood);
      } else {
        setPopularFood([]);
      }
    } catch (error) {
      console.error('Failed to fetch recent recipes:', error);
      setPopularFood([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchRecentRecipes();
  }, [fetchRecentRecipes]);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchRecentRecipes();
    }, [fetchRecentRecipes])
  );

  if (!fontsLoaded) {
    return null;
  }

  const renderFoodCard = (item: FoodItem) => {
    const handlePress = async () => {
      const success = await saveRecipeView(item.id);
      if (success) {
        router.push({
          pathname: "/detail_resep",
          params: { id: item.id, name: item.name, imageUrl: item.imageUri }
        });
      }
    };

    return (
      <TouchableOpacity 
        key={item.id} 
        style={styles.card} 
        activeOpacity={0.9}
        onPress={handlePress}
        disabled={saving}
      >
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.foodName}>{item.name}</Text>
            </View>
            <Text style={styles.foodDesc} numberOfLines={2}>{item.desc}</Text>
            <TouchableOpacity 
              onPress={handlePress}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.detailText}>lihat detail</Text>
              )}
            </TouchableOpacity>
          </View>
          <Image source={{ uri: item.imageUri }} style={styles.foodImage} />
        </View>
      </TouchableOpacity>
    );
  };

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
              source={{ uri: getProfilePictureUrl(user?.profile_picture) }} 
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
          <Text style={styles.sectionTitle}>Resep Yang Baru Dilihat</Text>
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
  foodDesc: { color: 'white', fontSize: 13, marginBottom: 10, opacity: 0.9, lineHeight: 18 },
  detailText: { color: 'white', fontSize: 13, textDecorationLine: 'underline', fontWeight: '500' },
  foodImage: { width: 90, height: 90, borderRadius: 15, backgroundColor: '#eee' },
});