import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ImageBackground, StatusBar, Platform, ActivityIndicator, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';

interface Location {
  id: string;
  id_location: string;
  location_name: string;
  road_name?: string;
  opening_time?: string;
  closing_time?: string;
  google_maps_link?: string;
  location_picture?: string;
  price_per_kg_location?: number | null;
}

function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

export default function BahanTersediaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const ingredients = params.ingredients ? String(params.ingredients) : '';

  const recipeName = params.recipeName ? String(params.recipeName) : '';
  const recipeIngredients = params.recipeIngredients ? String(params.recipeIngredients) : '';
  const missingIngredients = params.missingIngredients ? String(params.missingIngredients) : '';
  const [ownedIngredientList, setOwnedIngredientList] = useState<string[]>(
    ingredients ? ingredients.split(',').map((item) => item.trim()).filter(Boolean) : []
  );

  const [recipeIngredientList, setRecipeIngredientList] = useState<string[]>(
    recipeIngredients ? recipeIngredients.split(',').map((item) => item.trim()).filter(Boolean) : []
  );

  const [missingIngredientList, setMissingIngredientList] = useState<string[]>(
    missingIngredients ? missingIngredients.split(',').map((item) => item.trim()).filter(Boolean) : []
  );

  const [storesByIngredient, setStoresByIngredient] = useState<{ [key: string]: Location[] }>({});
  const [loadingStores, setLoadingStores] = useState(false);

  useEffect(() => {
    const loadFromStorageIfNeeded = async () => {
      if (ownedIngredientList.length > 0 || recipeIngredientList.length > 0) return;

      try {
        const raw = await AsyncStorage.getItem('last_missing_ingredients');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed) {
          setOwnedIngredientList(Array.isArray(parsed.ownedIngredients) ? parsed.ownedIngredients : []);
          setRecipeIngredientList(Array.isArray(parsed.recipeIngredients) ? parsed.recipeIngredients : []);
          setMissingIngredientList(Array.isArray(parsed.missingIngredients) ? parsed.missingIngredients : []);
        }
      } catch (e) {
        console.warn('Failed to load saved ingredient data', e);
      }
    };

    loadFromStorageIfNeeded();
  }, []);

  // Fetch stores for missing ingredients
  useEffect(() => {
    const fetchStoresForMissingIngredients = async () => {
      if (missingIngredientList.length === 0) return;

      setLoadingStores(true);
      try {
        // Fetch all ingredients to create name → ID mapping
        const ingredientsResponse = await fetch(`${API_BASE_URL}/ingredients`);
        if (!ingredientsResponse.ok) throw new Error('Failed to fetch ingredients');
        
        const ingredientsData = await ingredientsResponse.json();
        const ingredientsList = ingredientsData.data || [];
        
        const ingredientMap: { [key: string]: string } = {};
        ingredientsList.forEach((ing: any) => {
          ingredientMap[ing.name?.toLowerCase().trim()] = ing.id;
        });

        // Fetch stores for each missing ingredient
        const stores: { [key: string]: Location[] } = {};
        
        for (const missingIng of missingIngredientList) {
          const lowerIng = missingIng.toLowerCase().trim();
          const ingredientId = ingredientMap[lowerIng];
          
          if (ingredientId) {
            try {
              const storesResponse = await fetch(`${API_BASE_URL}/ingredients/${ingredientId}/locations`);
              if (storesResponse.ok) {
                const storesData = await storesResponse.json();
                stores[missingIng] = storesData.data || [];
              }
            } catch (e) {
              console.warn(`Failed to fetch stores for ${missingIng}:`, e);
              stores[missingIng] = [];
            }
          }
        }

        setStoresByIngredient(stores);
      } catch (e) {
        console.error('Error fetching stores:', e);
      } finally {
        setLoadingStores(false);
      }
    };

    fetchStoresForMissingIngredients();
  }, [missingIngredientList]);

  const handleOpenMaps = (mapsLink?: string) => {
    if (mapsLink) {
      Linking.openURL(mapsLink).catch(() => {
        alert('Could not open maps link');
      });
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return '-';
    // Assuming time format is HH:mm
    return time;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8EF" />
      <ImageBackground source={require('../assets/images/cook.png')} style={styles.background} resizeMode="cover">
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
                  <Text style={styles.heroTitle}>Akan diisi dari fetching</Text>
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
                {loadingStores ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#9E5F3B" />
                    <Text style={styles.loadingText}>Memuat lokasi toko...</Text>
                  </View>
                ) : Object.keys(storesByIngredient).length > 0 ? (
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
                                  {store.price_per_kg_location && (
                                    <Text style={styles.storePrice}>
                                      Harga: Rp. {Number(store.price_per_kg_location).toLocaleString('id-ID')}/kg
                                    </Text>
                                  )}
                                  {store.google_maps_link && (
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
                ) : (
                  <Text style={styles.emptyText}>Tidak ada bahan yang perlu dibeli</Text>
                )}
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
  heroTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  heroText: { color: 'rgba(255,255,255,0.9)', fontSize: 12, lineHeight: 18 },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(158, 95, 59, 0.12)',
  },
  sectionTitle: { color: '#5b2f20', fontWeight: '800', fontSize: 15, marginBottom: 12 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#FFF3E8',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(158, 95, 59, 0.18)',
  },
  chipText: { color: '#9E5F3B', fontSize: 12, fontWeight: '700' },
  emptyText: { color: '#9E5F3B', fontSize: 12, fontStyle: 'italic' },
  alertBox: {
    backgroundColor: 'rgba(217, 83, 79, 0.08)',
    borderRadius: 16,
    padding: 12,
  },
  alertRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  alertText: { marginLeft: 8, color: '#5b2f20', fontSize: 13, fontWeight: '600' },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9E5F3B',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },
  storeImagePlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FFF8EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  storeImage: {
    width: 54,
    height: 54,
    borderRadius: 16,
  },
  storeName: { color: '#fff', fontSize: 14, fontWeight: '800' },
  storeAddress: { color: 'rgba(255,255,255,0.88)', fontSize: 12, marginTop: 4, lineHeight: 17 },
  storeMeta: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 6 },
  primaryButton: {
    backgroundColor: '#5b2f20',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#9E5F3B',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  ingredientStoresSection: {
    marginBottom: 14,
  },
  ingredientStoreTitle: {
    color: '#5b2f20',
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 8,
    paddingLeft: 4,
    textTransform: 'capitalize',
  },
  noStoresText: {
    color: '#9E5F3B',
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  storePrice: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  mapsLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  mapsLinkText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});