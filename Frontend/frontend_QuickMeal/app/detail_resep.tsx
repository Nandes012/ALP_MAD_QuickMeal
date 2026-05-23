import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import { API_BASE_URL } from '@/constants/api';
import { useRecipeView } from '@/hooks/useRecipeView';
import CustomNavbar from '../components/CustomNavbar';

type IngredientItem = {
  id: string;
  ingredient_id?: string;
  ingredient_name?: string;
  quantity?: string;
  price_estimate?: number;
};

type ToolItem = {
  id: string;
  tool_name?: string;
  description?: string | null;
};

type StepItem = {
  id: string;
  stepNumber?: number;
  description?: string;
};

type RecipeDetail = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  video?: string;
  cookingTime?: number;
  difficulty?: string;
  totalIngredientPrice?: number;
  ingredients: IngredientItem[];
  tools: ToolItem[];
  steps: StepItem[];
};

const formatCurrency = (value: number | undefined): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '0';
  }
  return value.toLocaleString('id-ID');
};

export default function DetailResepScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const recipeId = String(params.id ?? '');
  const fallbackName = params.name ? String(params.name) : 'Detail Resep';
  const fallbackImage = params.imageUrl ? decodeURIComponent(String(params.imageUrl)) : 'https://via.placeholder.com/900x600';
  const { saveRecipeView } = useRecipeView();

  // Menangkap parameter ingredients dari router link asal jika ada
  const routeIngredients = params.ingredients ? String(params.ingredients) : '';

  const [availabilityParams, setAvailabilityParams] = useState<{
    recipeId: string;
    recipeName: string;
    ingredients: string;
    recipeIngredients: string;
    missingIngredients: string;
  } | null>(null);

  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showIngredients, setShowIngredients] = useState(true);
  const [showTools, setShowTools] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
  });

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        if (!recipeId) {
          setError('Recipe ID not provided');
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
          await saveRecipeView(recipeId);

          try {
            const recipeIngredients = Array.isArray(result.data.ingredients)
              ? result.data.ingredients.map((ing: any) => (ing.ingredient_name || ing.name || '').toString().toLowerCase().trim()).filter(Boolean)
              : [];

            const storedOwned = await AsyncStorage.getItem('owned_ingredients');
            const ownedRaw = routeIngredients || storedOwned || '';
            const ownedList = ownedRaw
              ? ownedRaw.split(',').map((s) => s.trim()).filter(Boolean).map((s) => s.toLowerCase())
              : [];

            const missing = recipeIngredients.filter((name: string) => !ownedList.includes(name));

            const savePayload = {
              recipeId: recipeId,
              recipeName: result.data.title || fallbackName,
              ownedIngredients: ownedList,
              recipeIngredients: recipeIngredients,
              missingIngredients: missing,
              computedAt: new Date().toISOString(),
            };

            await AsyncStorage.setItem(`missing_for_recipe_${recipeId}`, JSON.stringify(savePayload));
            await AsyncStorage.setItem('last_missing_ingredients', JSON.stringify(savePayload));
            
            setAvailabilityParams({
              recipeId,
              recipeName: result.data.title || fallbackName,
              ingredients: ownedList.join(','),
              recipeIngredients: recipeIngredients.join(','),
              missingIngredients: missing.join(','),
            });
          } catch (e) {
            console.warn('Failed to compute/save missing ingredients', e);
          }
        } else {
          setError('Invalid response from server');
        }
      } catch (err) {
        console.error('Error fetching recipe detail:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetail();
  }, [recipeId, saveRecipeView]);

  const handlePlayVideo = async () => {
    if (!recipe?.video) {
      alert('tidak ada video untuk resep ini terlebih dahulu');
      return;
    }
    const fullUrl = `${API_BASE_URL.replace('/api', '')}/${encodeURI(recipe.video)}`;
    setVideoUrl(fullUrl);
    setIsPlayingVideo(true);
    await ScreenOrientation.unlockAsync();
  };

  const handleStopVideo = async () => {
    setIsPlayingVideo(false);
    setIsVideoFullscreen(false);
    player.pause();
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  };

  const handleRotateLandscape = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  };

  const handleOpenAvailability = () => {
    if (!availabilityParams) return;

    router.push({
      pathname: '/bahan_tersedia',
      params: availabilityParams,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#9E5F3B" />
          <Text style={styles.centerText}>Memuat detail resep...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#5b2f20" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Resep</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error || 'Recipe not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const name = recipe.title || fallbackName;
  const imageUrl = recipe.image || fallbackImage;
  const price = formatCurrency(recipe.totalIngredientPrice);
  const time = recipe.cookingTime ? `${recipe.cookingTime} Menit` : 'Tidak tersedia';
  const difficulty = recipe.difficulty || 'Tidak diketahui';
  const ingredientsData = recipe.ingredients || [];
  const toolsData = recipe.tools || [];
  const stepsData = recipe.steps || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8EF" />

      <SafeAreaView edges={['top']} style={styles.appBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#8D5B3E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isPlayingVideo ? (
          <View style={[styles.imageContainer, isVideoFullscreen && styles.videoFullscreen]}>
            <VideoView
              style={styles.videoPlayer}
              player={player}
              nativeControls={true}
            />
            <TouchableOpacity style={styles.closeVideoButton} onPress={handleStopVideo}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            {isVideoFullscreen && (
              <TouchableOpacity style={styles.rotateButton} onPress={handleRotateLandscape}>
                <Ionicons name="swap-horizontal" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.mainImage} resizeMode="cover" />
            <TouchableOpacity style={styles.playButton} activeOpacity={0.8} onPress={handlePlayVideo}>
              <Ionicons name="play" size={36} color="#9E5F3B" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.recipeTitle}>{name}</Text>
          <Text style={styles.subtitleText}>{recipe.subtitle || 'Resep live dari backend Laravel'}</Text>

          <View style={styles.chipRow}>
            <View style={styles.chip}>
              <Ionicons name="time-outline" size={14} color="#8D5B3E" />
              <Text style={styles.chipText}>{time}</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="flame-outline" size={14} color="#8D5B3E" />
              <Text style={styles.chipText}>{difficulty}</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="cash-outline" size={14} color="#8D5B3E" />
              <Text style={styles.chipText}>Rp. {price}</Text>
            </View>
          </View>

          {/* LOGIKA CONDITIONAL RENDERING: Hanya muncul jika diklik dari form rekomendasi resep */}
          {routeIngredients ? (
            <TouchableOpacity
              style={styles.availabilityButton}
              activeOpacity={0.9}
              onPress={handleOpenAvailability}
              disabled={!availabilityParams}
            >
              <Ionicons name="storefront-outline" size={16} color={availabilityParams ? '#fff' : '#C9B6A8'} />
              <Text style={[styles.availabilityButtonText, !availabilityParams && styles.availabilityButtonTextDisabled]}>
                Lihat ketersediaan bahan
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setShowIngredients((value) => !value)}
            activeOpacity={0.7}
          >
            <Text style={styles.accordionTitle}>Bahan-bahan ({ingredientsData.length} item)</Text>
            <Ionicons name={showIngredients ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
          </TouchableOpacity>

          {showIngredients && (
            <View style={styles.accordionBody}>
              {ingredientsData.length > 0 ? ingredientsData.map((item, index) => (
                <View key={item.id || String(index)} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>
                    {item.ingredient_name || 'Bahan'}{item.quantity ? ` - ${item.quantity}` : ''}{typeof item.price_estimate === 'number' ? ` (Rp. ${formatCurrency(item.price_estimate)})` : ''}
                  </Text>
                </View>
              )) : (
                <Text style={styles.emptySectionText}>Tidak ada bahan tersedia.</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setShowTools((value) => !value)}
            activeOpacity={0.7}
          >
            <Text style={styles.accordionTitle}>Alat Masak ({toolsData.length} item)</Text>
            <Ionicons name={showTools ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
          </TouchableOpacity>

          {showTools && (
            <View style={styles.accordionBody}>
              {toolsData.length > 0 ? toolsData.map((item, index) => (
                <View key={item.id || String(index)} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bulletText}>{item.tool_name || 'Alat masak'}</Text>
                    {item.description ? <Text style={styles.subText}>{item.description}</Text> : null}
                  </View>
                </View>
              )) : (
                <Text style={styles.emptySectionText}>Tidak ada alat tersedia.</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setShowSteps((value) => !value)}
            activeOpacity={0.7}
          >
            <Text style={styles.accordionTitle}>Langkah Memasak ({stepsData.length} tahap)</Text>
            <Ionicons name={showSteps ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
          </TouchableOpacity>

          {showSteps && (
            <View style={[styles.accordionBody, { gap: 12 }]}>
              {stepsData.length > 0 ? stepsData.map((item, index) => (
                <View key={item.id || String(index)} style={styles.stepRow}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNumberText}>{item.stepNumber || index + 1}.</Text>
                  </View>
                  <View style={styles.stepContentBox}>
                    <Text style={styles.stepText}>{item.description || 'Langkah tidak tersedia'}</Text>
                  </View>
                </View>
              )) : (
                <Text style={styles.emptySectionText}>Tidak ada langkah memasak.</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <CustomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  appBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#FFF8EF' },
  errorHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#FFF8EF' },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#8D5B3E', textAlign: 'center', flex: 1, fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 },
  centerState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  centerText: { marginTop: 12, color: '#8D5B3E', fontWeight: '600' },
  errorText: { color: '#d32f2f', fontSize: 16, textAlign: 'center' },
  imageContainer: { width: '100%', height: 190, borderRadius: 15, overflow: 'hidden', position: 'relative', backgroundColor: '#EAEAEA' },
  mainImage: { width: '100%', height: '100%' },
  playButton: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -27.5 }, { translateY: -27.5 }], backgroundColor: 'rgba(255, 255, 255, 0.9)', width: 55, height: 55, borderRadius: 27.5, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  videoPlayer: { width: '100%', height: '100%' },
  videoFullscreen: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: 1000 },
  closeVideoButton: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0, 0, 0, 0.6)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  rotateButton: { position: 'absolute', bottom: 20, left: 20, backgroundColor: 'rgba(0, 0, 0, 0.6)', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#EFE3D5', marginTop: 15, marginBottom: 16, elevation: 1 },
  recipeTitle: { fontSize: 18, fontWeight: '700', color: '#333333', marginBottom: 8, fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia' },
  subtitleText: { fontSize: 13, color: '#6B6B6B', lineHeight: 18 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F9F2ED', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999 },
  chipText: { fontSize: 12, color: '#8D5B3E', fontWeight: '600' },
  availabilityButton: {
    marginTop: 14,
    backgroundColor: '#9E5F3B',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  availabilityButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  availabilityButtonTextDisabled: {
    color: '#C9B6A8',
  },
  cardContainer: { backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: '#EFE3D5', marginBottom: 15, overflow: 'hidden', elevation: 1 },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18, backgroundColor: 'white' },
  accordionTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  accordionBody: { paddingHorizontal: 18, paddingBottom: 15, borderTopWidth: 1, borderColor: '#F7EDE2', paddingTop: 12 },
  bulletItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  bulletPoint: { fontSize: 15, color: '#8D5B3E', marginRight: 8, lineHeight: 18 },
  bulletText: { fontSize: 13, color: '#444444', flex: 1, lineHeight: 18 },
  subText: { fontSize: 12, color: '#8D5B3E', marginTop: 4, lineHeight: 16 },
  emptySectionText: { color: '#8D5B3E', fontSize: 13 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', width: '100%' },
  stepNumberBadge: { backgroundColor: '#9E5F3B', width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  stepNumberText: { color: 'white', fontSize: 13, fontWeight: 'bold' },
  stepContentBox: { flex: 1, backgroundColor: '#E8EDF2', borderRadius: 15, paddingVertical: 12, paddingHorizontal: 15 },
  stepText: { fontSize: 12, color: '#2C3E50', fontWeight: '500', lineHeight: 16 },
});