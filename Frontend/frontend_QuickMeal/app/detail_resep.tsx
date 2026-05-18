import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '@/constants/api';
import { useRecipeView } from '@/hooks/useRecipeView';

interface RecipeDetail {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  cookingTime?: number;
  difficulty?: string;
  totalIngredientPrice?: number;
  ingredients: any[];
  tools: any[];
  steps: any[];
}

export default function DetailResepScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const recipeId = params.id as string;
  const { saveRecipeView } = useRecipeView();
  
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        if (!recipeId) {
          setError("Recipe ID not provided");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (result?.success && result.data) {
          setRecipe(result.data);
          setError(null);
          // Mark recipe as viewed when successfully loaded
          await saveRecipeView(recipeId);
        } else {
          setError("Invalid response from server");
        }
      } catch (err) {
        console.error("Error fetching recipe detail:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetail();
  }, [recipeId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#9E5F3B" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#5b2f20" />
          </TouchableOpacity>
          <Text style={styles.headerTitlePage}>Detail Resep</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ color: '#d32f2f', fontSize: 16, textAlign: 'center' }}>
            {error || "Recipe not found"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const name = recipe.title;
  const imageUrl = recipe.image;
  const price = recipe.totalIngredientPrice?.toString() || "0";
  const time = recipe.cookingTime ? `${recipe.cookingTime} Menit` : "Time unknown";
  const ingredientsData = recipe.ingredients || [];
  const toolsData = recipe.tools || [];
  const stepsData = recipe.steps || [];
  const totalIngredients = ingredientsData.length;
  const totalTools = toolsData.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5b2f20" />
        </TouchableOpacity>
        <Text style={styles.headerTitlePage}>Detail Resep</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.bannerCard}>
          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.foodImage} resizeMode="cover" />
          )}
          <View style={styles.bannerInfo}>
            <Text style={styles.foodName} numberOfLines={2}>{name}</Text>
            {/* badgeRow menggunakan flexWrap agar tidak keluar dari card */}
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Ionicons name="time-outline" size={12} color="white" />
                <Text style={styles.badgeTextValue}>{time}</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="wallet-outline" size={12} color="white" />
                <Text style={styles.badgeTextValue}>Rp. {price}</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.accordion}
          onPress={() => router.push({ 
            pathname: '/bahan_page', 
            params: { 
              recipeId,
              name: name
            } 
          })}
        >
          <View style={styles.accordionLeft}>
            <Ionicons name="fast-food-outline" size={20} color="#9E5F3B" />
            <Text style={styles.accordionText}>Bahan-bahan ({totalIngredients} item)</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.accordion}
          onPress={() => router.push({ pathname: '/alat_page', params: { recipeId, name } })}
        >
          <View style={styles.accordionLeft}>
            <Ionicons name="restaurant-outline" size={20} color="#9E5F3B" />
            <Text style={styles.accordionText}>Alat Masak ({totalTools} item)</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Langkah Memasak</Text>
          {stepsData.length > 0 ? (
            stepsData.map((item, index) => (
              <View key={item.id || index} style={styles.stepRow}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>{item.stepNumber || index + 1}</Text>
                </View>
                <View style={styles.stepTextBubble}>
                  <Text style={styles.stepText}>{item.description}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ color: '#999', textAlign: 'center', marginTop: 20 }}>Tidak ada langkah tersedia</Text>
          )}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 },
  backButton: { padding: 8 },
  headerTitlePage: { fontSize: 20, fontWeight: 'bold', color: '#5b2f20' },
  scrollContent: { padding: 20 },
  
  bannerCard: { 
    backgroundColor: '#9E5F3B', 
    borderRadius: 25, 
    padding: 15, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20,
    minHeight: 130, // Memberi ruang minimal agar tidak sesak
    elevation: 5
  },
  foodImage: { width: 90, height: 90, borderRadius: 20 },
  bannerInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  foodName: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  
  badgeRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', // KUNCI AGAR TIDAK KELUAR CARD
    gap: 6 
  },
  badge: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)', 
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    borderRadius: 10,
    gap: 4,
    marginBottom: 4 // Jarak jika ter-wrap ke bawah
  },
  badgeTextValue: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  accordion: { 
    backgroundColor: 'white', borderRadius: 18, padding: 18, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    borderWidth: 1, borderColor: '#F0E0D0', marginBottom: 12, elevation: 2
  },
  accordionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  accordionText: { fontSize: 15, fontWeight: '600', color: '#333' },

  stepContainer: { backgroundColor: 'white', borderRadius: 25, padding: 20, borderWidth: 1, borderColor: '#F0E0D0', marginTop: 10 },
  stepTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 20, color: '#5b2f20' },
  stepRow: { flexDirection: 'row', marginBottom: 18, alignItems: 'flex-start' },
  stepNumberContainer: { backgroundColor: '#9E5F3B', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 },
  stepNumber: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  stepTextBubble: { flex: 1, backgroundColor: '#FDF7F2', padding: 15, borderRadius: 15, borderLeftWidth: 3, borderLeftColor: '#9E5F3B' },
  stepText: { fontSize: 14, color: '#444', lineHeight: 20 },
});