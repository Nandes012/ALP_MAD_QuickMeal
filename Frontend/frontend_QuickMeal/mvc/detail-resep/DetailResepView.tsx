import React from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView } from 'expo-video';

import CustomNavbar from '@/components/CustomNavbar';
import { formatCurrency } from '@/mvc/shared/recipeFormats';
import { RecipeDetail } from './detailResep.model';

type Props = Readonly<{
  router: { back: () => void };
  loading: boolean;
  error: string | null;
  recipe: RecipeDetail | null;
  name: string;
  imageUrl: string;
  price: string;
  time: string;
  difficulty: string;
  ingredientsData: RecipeDetail['ingredients'];
  toolsData: RecipeDetail['tools'];
  stepsData: RecipeDetail['steps'];
  showIngredients: boolean;
  setShowIngredients: React.Dispatch<React.SetStateAction<boolean>>;
  showTools: boolean;
  setShowTools: React.Dispatch<React.SetStateAction<boolean>>;
  showSteps: boolean;
  setShowSteps: React.Dispatch<React.SetStateAction<boolean>>;
  isPlayingVideo: boolean;
  isVideoFullscreen: boolean;
  player: any;
  handlePlayVideo: () => Promise<void>;
  handleStopVideo: () => Promise<void>;
  handleRotateLandscape: () => Promise<void>;
  handleOpenAvailability: () => void;
  availabilityParams: { recipeId: string } | null;
  routeIngredients: string;
}>;

export default function DetailResepView(props: Props) {
  const {
    router,
    loading,
    error,
    recipe,
    name,
    imageUrl,
    price,
    time,
    difficulty,
    ingredientsData,
    toolsData,
    stepsData,
    showIngredients,
    setShowIngredients,
    showTools,
    setShowTools,
    showSteps,
    setShowSteps,
    isPlayingVideo,
    isVideoFullscreen,
    player,
    handlePlayVideo,
    handleStopVideo,
    handleRotateLandscape,
    handleOpenAvailability,
    availabilityParams,
    routeIngredients,
  } = props;

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
            <VideoView style={styles.videoPlayer} player={player} nativeControls={true} />
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
