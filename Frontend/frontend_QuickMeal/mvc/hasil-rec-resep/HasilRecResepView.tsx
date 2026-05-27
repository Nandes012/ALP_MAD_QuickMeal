import React from 'react';
import { ActivityIndicator, FlatList, Image, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ResepItem } from './useHasilRecResepController';

type Props = Readonly<{
  router: { push: (args: any) => void };
  time: string;
  budgetMin: string;
  budgetMax: string;
  ingredients: string;
  summaryTime: string;
  ingredientList: string[];
  loading: boolean;
  queryError: unknown;
  topRecipes: ResepItem[];
  otherRecipes: ResepItem[];
  handleRecipePress: (item: ResepItem) => void;
}>;

export default function HasilRecResepView(props: Props) {
  const { router, time, budgetMin, budgetMax, ingredients, summaryTime, ingredientList, loading, queryError, topRecipes, otherRecipes, handleRecipePress } = props;
  const hasSummaryInputs = Boolean(time || budgetMin || budgetMax || ingredients);
  const errorMessage = queryError instanceof Error ? queryError.message : 'Gagal memuat rekomendasi';

  function renderCard(item: ResepItem) {
    return (
      <TouchableOpacity key={item.id} style={styles.premiumCard} activeOpacity={0.85} onPress={() => handleRecipePress(item)}>
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
                <Ionicons name="time-outline" size={12} color="#FFF2D8" style={{ marginRight: 4 }} />
                <Text style={styles.premiumFoodTime}>{item.time}</Text>
              </View>
            </View>
          </View>
          <View style={styles.premiumActionButton}>
            <Text style={styles.premiumActionText}>Lihat Resep</Text>
            <Ionicons name="chevron-forward" size={11} color="#FFFFFF" style={{ marginLeft: 4 }} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  let content: React.ReactNode;

  if (loading) {
    content = (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#9E5F3B" />
        <Text style={styles.loadingText}>Memuat rekomendasi...</Text>
      </View>
    );
  } else if (queryError) {
    content = (
      <View style={styles.loadingWrap}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  } else {
    content = (
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
            {otherRecipes.length > 0 ? otherRecipes.map((item) => renderCard(item)) : <View style={styles.cleanEmptyContainer}><Text style={styles.emptyText}>Belum ada rekomendasi lain.</Text></View>}
          </View>
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9E5F3B" />
      <ImageBackground source={require('../../assets/images/cook.png')} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.darkOverlay}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerSubtitle}>Berdasarkan waktu, budget & bahan kamu, kami rekomendasikan masak sendiri</Text>

            {hasSummaryInputs && (
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeaderRow}>
                  <Text style={styles.summaryTitle}>Input dari form</Text>
                  <TouchableOpacity style={styles.summaryEditButton} onPress={() => router.push({ pathname: '/from_resep', params: { time: time || '', budgetMin: budgetMin || '', budgetMax: budgetMax || '', ingredients: ingredients || '' } })} activeOpacity={0.8}>
                    <Ionicons name="create-outline" size={14} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.summaryEditText}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.summaryGrid}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Waktu</Text>
                    <Text style={styles.summaryValue}>{summaryTime}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Budget</Text>
                    <Text style={styles.summaryValue}>{budgetMin || budgetMax ? `Rp ${budgetMin || '-'} - Rp ${budgetMax || '-'}` : '-'}</Text>
                  </View>
                </View>
                <View style={styles.summaryItemFull}>
                  <Text style={styles.summaryLabel}>Bahan</Text>
                  <View style={styles.ingredientWrap}>
                    {ingredientList.length > 0 ? ingredientList.map((ingredient) => (
                      <View key={ingredient} style={styles.ingredientChip}>
                        <Text style={styles.ingredientChipText}>{ingredient}</Text>
                      </View>
                    )) : <Text style={styles.summaryValue}>-</Text>}
                  </View>
                </View>
              </View>
            )}
          </View>

          {content}

          <View style={styles.navbarContainer}>
            <View style={styles.navbar}>
              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
                <Ionicons name="home-outline" size={24} color="white" />
                <Text style={styles.navText}>Home</Text>
              </TouchableOpacity>
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
  darkOverlay: { flex: 1, backgroundColor: 'rgba(252, 248, 245, 0.85)' },
  headerContainer: { backgroundColor: '#9E5F3B', paddingTop: 40, paddingBottom: 22, paddingHorizontal: 24, alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerSubtitle: { color: '#FFFFFF', fontSize: 13, textAlign: 'center', lineHeight: 18, opacity: 0.95 },
  summaryCard: { marginTop: 14, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 16, padding: 12 },
  summaryHeaderRow: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  summaryEditButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  summaryEditText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  summaryTitle: { color: '#FFF8EF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 },
  summaryGrid: { flexDirection: 'row', gap: 8 },
  summaryItem: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 10, padding: 10 },
  summaryItemFull: { marginTop: 8, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 10, padding: 10 },
  summaryLabel: { color: '#FFF8EF', fontSize: 11, opacity: 0.8, marginBottom: 4 },
  summaryValue: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  ingredientWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  ingredientChip: { backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  ingredientChipText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#9E5F3B', marginTop: 10 },
  errorText: { color: '#d32f2f' },
  listContent: { paddingHorizontal: 20, paddingBottom: 110, paddingTop: 14 },
  sectionTitle: { fontSize: 18, color: '#3A2214', fontWeight: '700', marginBottom: 10 },
  premiumCard: { backgroundColor: '#9E5F3B', borderRadius: 18, marginBottom: 12, padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#8B4F30' },
  premiumFoodImage: { width: 84, height: 84, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)' },
  premiumCardInfo: { flex: 1, marginLeft: 14, justifyContent: 'space-between', minHeight: 84 },
  premiumFoodName: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  cardRow: { flexDirection: 'row', marginTop: 6, gap: 10 },
  priceBadgeContainer: { flexDirection: 'row', alignItems: 'center' },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  premiumFoodPrice: { color: '#FFF2D8', fontWeight: '700' },
  premiumFoodTime: { color: '#FFF2D8' },
  premiumActionButton: { flexDirection: 'row', alignItems: 'center', marginTop: 10, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.16)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  premiumActionText: { color: '#FFFFFF', fontWeight: '700' },
  cleanEmptyContainer: { alignItems: 'center', paddingVertical: 16 },
  emptyText: { color: '#9C8070' },
  navbarContainer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 10 },
  navbar: { backgroundColor: '#9E5F3B', marginHorizontal: 20, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 10 },
  navItem: { alignItems: 'center' },
  navText: { color: '#FFF', fontSize: 11, marginTop: 4 },
  centerIconWrapper: { alignItems: 'center', marginTop: -28 },
  centerIconBg: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#5b2f20', justifyContent: 'center', alignItems: 'center' },
  navTextCenter: { color: '#FFF', fontSize: 11, marginTop: 4 },
  darkOverlayFooter: {},
});
