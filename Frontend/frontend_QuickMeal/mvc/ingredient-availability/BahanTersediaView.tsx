import React from 'react';
import { ActivityIndicator, Image, ImageBackground, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Location } from './useBahanTersediaController';

type Props = Readonly<{
  router: { back: () => void };
  recipeName: string;
  ownedIngredientList: string[];
  recipeIngredientList: string[];
  missingIngredientList: string[];
  storesByIngredient: { [key: string]: Location[] };
  loadingStores: boolean;
  handleOpenMaps: (mapsLink?: string) => void;
  formatTime: (time?: string) => string;
}>;

function Chip({ label }: Readonly<{ label: string }>) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

export default function BahanTersediaView(props: Props) {
  const {
    router,
    recipeName,
    ownedIngredientList,
    recipeIngredientList,
    missingIngredientList,
    storesByIngredient,
    loadingStores,
    handleOpenMaps,
    formatTime,
  } = props;

  const hasStoresByIngredient = Object.keys(storesByIngredient).length > 0;
  let storesSection: React.ReactNode;

  if (loadingStores) {
    storesSection = (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9E5F3B" />
        <Text style={styles.loadingText}>Memuat lokasi toko...</Text>
      </View>
    );
  } else if (hasStoresByIngredient) {
    storesSection = (
      <View>
        {missingIngredientList.map((ingredient) => {
          const stores = storesByIngredient[ingredient] || [];
          return (
            <View key={ingredient} style={styles.ingredientStoresSection}>
              <Text style={styles.ingredientStoreTitle}>{ingredient}</Text>
              {stores.length > 0 ? (
                stores.map((store, index) => (
                  <TouchableOpacity
                    key={`${ingredient}-${store.id}-${index}`}
                    style={styles.storeCard}
                    activeOpacity={0.8}
                    onPress={() => handleOpenMaps(store.google_maps_link)}
                  >
                    <View style={styles.storeImagePlaceholder}>
                      {store.location_picture ? (
                        <Image
                          source={{ uri: store.location_picture }}
                          style={styles.storeImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons name="storefront-outline" size={24} color="#9E5F3B" />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.storeName}>{store.location_name}</Text>
                      <Text style={styles.storeAddress}>{store.road_name || 'Alamat tidak tersedia'}</Text>
                      <Text style={styles.storeMeta}>
                        {store.opening_time && store.closing_time
                          ? `Jam buka: ${formatTime(store.opening_time)} - ${formatTime(store.closing_time)}`
                          : 'Jam buka: Tidak tersedia'
                        }
                      </Text>
                      {Boolean(store.price_per_kg_location) && (
                        <Text style={styles.storePrice}>
                          Harga: Rp. {Number(store.price_per_kg_location).toLocaleString('id-ID')}/kg
                        </Text>
                      )}
                      {Boolean(store.google_maps_link) && (
                        <View style={styles.mapsLinkRow}>
                          <Ionicons name="location" size={12} color="rgba(255,255,255,0.9)" style={{ marginRight: 4 }} />
                          <Text style={styles.mapsLinkText}>Buka di Google Maps</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noStoresText}>Tidak ada toko yang ditemukan untuk bahan ini</Text>
              )}
            </View>
          );
        })}
      </View>
    );
  } else {
    storesSection = <Text style={styles.emptyText}>Tidak ada bahan yang perlu dibeli</Text>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8EF" />
      <ImageBackground source={require('../../assets/images/cook.png')} style={styles.background} resizeMode="cover">
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.8}>
                <Ionicons name="arrow-back" size={24} color="#9E5F3B" />
              </TouchableOpacity>
              <View style={styles.headerTextWrap}>
                <Text style={styles.title}>{recipeName || 'Bahan Tersedia'}</Text>
                <Text style={styles.subtitle}>Bahan yang belum ada dan alamat beli akan ditampilkan di sini</Text>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
              <View style={styles.heroCard}>
                <View style={styles.heroIcon}>
                  <Ionicons name="storefront-outline" size={28} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.heroTitle}>Bahan yang belum dimiliki</Text>
                  <Text style={styles.heroText}>
                    Page ini disiapkan untuk menampilkan bahan yang tersedia, bahan yang belum dimiliki user, dan lokasi toko terdekat.
                  </Text>
                </View>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Bahan dari form</Text>
                <View style={styles.chipWrap}>
                  {ownedIngredientList.length > 0 ? (
                    ownedIngredientList.map((item) => <Chip key={item} label={item} />)
                  ) : (
                    <Text style={styles.emptyText}>Belum ada bahan yang dikirim.</Text>
                  )}
                </View>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Bahan resep</Text>
                <View style={styles.chipWrap}>
                  {recipeIngredientList.length > 0 ? (
                    recipeIngredientList.map((item) => <Chip key={item} label={item} />)
                  ) : (
                    <Text style={styles.emptyText}>Belum ada daftar bahan resep.</Text>
                  )}
                </View>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Bahan belum dimiliki</Text>
                <View style={styles.alertBox}>
                  {missingIngredientList.length > 0 ? (
                    missingIngredientList.map((item) => (
                      <View key={item} style={styles.alertRow}>
                        <Ionicons name="close-circle" size={18} color="#D9534F" />
                        <Text style={styles.alertText}>{item}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyText}>Semua bahan resep sudah dimiliki atau belum ada data resep.</Text>
                  )}
                </View>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Alamat beli terdekat</Text>
                {storesSection}
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255, 248, 239, 0.55)' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextWrap: { flex: 1 },
  title: {
    fontSize: 24,
    color: '#5b2f20',
    fontWeight: '800',
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
  },
  subtitle: {
    fontSize: 13,
    color: '#9E5F3B',
    marginTop: 4,
    lineHeight: 18,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9E5F3B',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
  },
  heroText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 12,
    lineHeight: 17,
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(158,95,59,0.12)',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#5b2f20',
    marginBottom: 12,
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FFF4EA',
    borderWidth: 1,
    borderColor: '#F1D7C7',
  },
  chipText: { color: '#9E5F3B', fontSize: 12, fontWeight: '700' },
  emptyText: { color: '#9E5F3B', opacity: 0.7, fontSize: 12 },
  alertBox: { gap: 8 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  alertText: { color: '#C94542', fontSize: 13, fontWeight: '600' },
  loadingContainer: { alignItems: 'center', paddingVertical: 12 },
  loadingText: { color: '#9E5F3B', marginTop: 10, fontWeight: '600' },
  ingredientStoresSection: { marginTop: 8, marginBottom: 10 },
  ingredientStoreTitle: { fontSize: 14, color: '#5b2f20', fontWeight: '800', marginBottom: 10 },
  storeCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#9E5F3B',
    borderRadius: 18,
    marginBottom: 10,
    overflow: 'hidden',
    padding: 12,
  },
  storeImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  storeImage: { width: '100%', height: '100%' },
  storeName: { color: '#fff', fontSize: 14, fontWeight: '800' },
  storeAddress: { color: 'rgba(255,255,255,0.95)', fontSize: 12, marginTop: 2 },
  storeMeta: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 },
  storePrice: { color: '#fff', fontSize: 12, marginTop: 6, fontWeight: '700' },
  mapsLinkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  mapsLinkText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  noStoresText: { color: '#9E5F3B', fontSize: 12, fontStyle: 'italic' },
});
