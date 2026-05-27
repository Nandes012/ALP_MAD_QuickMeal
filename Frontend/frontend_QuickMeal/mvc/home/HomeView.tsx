import React from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomNavbar from '@/components/CustomNavbar';
import { RecipeItem } from './useHomeController';

const { width } = Dimensions.get('window');

type Props = Readonly<{
  router: { push: (args: any) => void };
  profilePicture: string;
  saving: boolean;
  fontsLoaded: boolean;
  greeting: { title: string; sub: string };
  recommendedRecipes: RecipeItem[];
  recommendationsLoading: boolean;
  recentRecipes: RecipeItem[];
  recentLoading: boolean;
  handleRecipePress: (item: RecipeItem) => Promise<void>;
}>;

export default function HomeView(props: Props) {
  const { router, profilePicture, saving, fontsLoaded, greeting, recommendedRecipes, recommendationsLoading, recentRecipes, recentLoading, handleRecipePress } = props;

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
          <View style={styles.headerHalo}>
            <View style={styles.headerTextCol}>
              <View style={styles.haloRow}>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1000/1000390.png' }} style={styles.chefHat} />
                <Text style={styles.haloTitle}>{greeting.title}</Text>
              </View>
              <Text style={styles.haloSubTitle}>{greeting.sub}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/profile')}>
              <View style={styles.profileContainer}>
                <Image source={{ uri: profilePicture }} style={styles.profilePic} />
                <View style={styles.editBadge}>
                  <Ionicons name="pencil" size={9} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ Rekomendasi Spesial</Text>
            <Text style={styles.sectionSubtitle}>Dibuat khusus untuk menggugah seleramu</Text>
          </View>

          {recommendationsLoading ? (
            <View style={styles.loadingBlock}>
              <ActivityIndicator size="large" color="#9E5F3B" />
            </View>
          ) : recommendedRecipes.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll} snapToInterval={width * 0.82 + 16} decelerationRate="fast">
              {recommendedRecipes.map((item) => (
                <TouchableOpacity key={item.id} style={styles.bannerCard} activeOpacity={0.9} onPress={() => handleRecipePress(item)} disabled={saving}>
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
                      <Ionicons name="arrow-forward-circle" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyState}>Belum ada rekomendasi untuk ditampilkan.</Text>
          )}

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
                <TouchableOpacity key={item.id} style={styles.gridCard} activeOpacity={0.9} onPress={() => handleRecipePress(item)} disabled={saving}>
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
  headerHalo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, marginBottom: 10 },
  headerTextCol: { flex: 1 },
  haloRow: { flexDirection: 'row', alignItems: 'center' },
  chefHat: { width: 26, height: 26, marginRight: 6, resizeMode: 'contain' },
  haloTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#3A2214', letterSpacing: -0.4 },
  haloSubTitle: { fontSize: 14, color: '#705243', marginTop: 3, fontFamily: 'Inter-Medium', opacity: 0.85 },
  profileContainer: { position: 'relative', padding: 2 },
  profilePic: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#FFFFFF', backgroundColor: '#EFEFEF' },
  editBadge: { position: 'absolute', right: 0, bottom: 2, backgroundColor: '#9E5F3B', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#FCF8F5' },
  sectionHeader: { paddingHorizontal: 24, marginTop: 22, marginBottom: 12 },
  sectionTitle: { fontSize: 18, color: '#3A2214', fontFamily: 'Inter-Bold', letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 12, color: '#9C8070', fontFamily: 'Inter-Regular', marginTop: 1 },
  horizontalScroll: { paddingLeft: 24, paddingRight: 8 },
  bannerCard: { backgroundColor: '#FFFFFF', marginRight: 16, borderRadius: 24, flexDirection: 'row', padding: 14, alignItems: 'center', width: width * 0.82, height: 140, borderWidth: 1, borderColor: '#F5EAE4', ...Platform.select({ ios: { shadowColor: '#5C3826', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 8 }, android: { elevation: 4 } }) },
  bannerImage: { width: 112, height: 112, borderRadius: 18, resizeMode: 'cover' },
  bannerTextContent: { flex: 1, paddingLeft: 14, justifyContent: 'space-between', height: '100%' },
  trendingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF6E9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  trendingText: { color: '#D47E13', fontSize: 9, fontFamily: 'Inter-Bold', marginLeft: 3 },
  bannerFoodName: { color: '#3A2214', fontSize: 16, fontFamily: 'Inter-Bold', marginTop: 4 },
  bannerFoodDesc: { color: '#8A6E5F', fontSize: 11, fontFamily: 'Inter-Regular', marginVertical: 2, lineHeight: 14 },
  btnLihatResepSmall: { backgroundColor: '#9E5F3B', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  btnResepText: { color: '#FFFFFF', fontSize: 11, fontFamily: 'Inter-Bold' },
  loadingBlock: { minHeight: 140, alignItems: 'center', justifyContent: 'center' },
  cleanEmptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32, backgroundColor: '#FFFFFF', marginHorizontal: 24, borderRadius: 20, borderWidth: 1, borderColor: '#F5EAE4' },
  emptyState: { color: '#9E5F3B', textAlign: 'center', marginHorizontal: 24, fontFamily: 'Inter-Medium', fontSize: 12, opacity: 0.7, marginTop: 4 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, justifyContent: 'space-between' },
  gridCard: { width: '47%', backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#F5EAE4', ...Platform.select({ ios: { shadowColor: '#5C3826', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 6 }, android: { elevation: 3 } }) },
  gridImage: { width: '100%', height: 120, resizeMode: 'cover' },
  gridOverlay: { padding: 12, justifyContent: 'space-between', flex: 1 },
  gridFoodName: { color: '#3A2214', fontSize: 13, fontFamily: 'Inter-SemiBold', lineHeight: 16, marginBottom: 8, minHeight: 32 },
  btnLihatResepGrid: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#9E5F3B', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
  btnResepTextSmall: { color: '#FFFFFF', fontSize: 10, fontFamily: 'Inter-Bold', marginRight: 2 },
});
