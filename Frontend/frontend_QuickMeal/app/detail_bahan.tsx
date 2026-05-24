import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform, StatusBar, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import { API_BASE_URL } from '@/constants/api';

import CustomNavbar from '../components/CustomNavbar'; 

type IngredientDetail = {
  id: string;
  name: string;
  ingredient_picture?: string | null;
  price_per_kg?: number | null;
  locations?: Location[];
};

type Location = {
  id_location: string;
  location_name: string;
  road_name?: string | null;
  location_picture?: string | null;
  google_maps_link?: string | null;
  opening_time?: string | null;
  closing_time?: string | null;
  price_per_kg_location?: number | null;
  pivot?: {
    ingredient_id: string;
    id_location: string;
    price_per_kg_location?: number | null;
    created_at?: string;
    updated_at?: string;
  };
};

export default function DetailBahan() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const ingredientId = params.id ? String(params.id) : '';
  
  const [ingredient, setIngredient] = useState<IngredientDetail | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredient = async () => {
      if (!ingredientId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/ingredients/${ingredientId}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (result?.success && result.data) {
          setIngredient(result.data);
          setError(null);
        } else {
          setError('Ingredient not found');
        }
      } catch (fetchError) {
        console.error('Error fetching ingredient:', fetchError);
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch ingredient');
      } finally {
        setLoading(false);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/ingredients/${ingredientId}/locations`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (result?.success && Array.isArray(result.data)) {
          setLocations(result.data);
        }
      } catch (locError) {
        console.error('Error fetching locations:', locError);
      }
    };

    fetchIngredient();
    if (ingredientId) {
      fetchLocations();
    }
  }, [ingredientId]);

  const bahanName = (ingredient?.name || params.name ? String(ingredient?.name || params.name) : 'Bahan').replace(/\s+/g, ' ').trim();
  
  const getFullImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return 'https://via.placeholder.com/300';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    return `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
  };

  const handleOpenMaps = async (locationLink: string | null | undefined) => {
    if (!locationLink) {
      alert('Link lokasi tidak tersedia');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(locationLink);
      if (canOpen) {
        await Linking.openURL(locationLink);
      } else {
        alert('Tidak bisa membuka link lokasi');
      }
    } catch (error) {
      console.error('Error opening maps:', error);
      alert('Terjadi kesalahan saat membuka Google Maps');
    }
  };
  
  const bahanImage = getFullImageUrl(ingredient?.ingredient_picture || (params.imageUrl ? String(params.imageUrl) : null));
  const bahanPriceValue = typeof ingredient?.price_per_kg === 'number'
    ? Number(ingredient.price_per_kg).toLocaleString('id-ID')
    : params.price
      ? String(params.price)
      : '0';

  // Membuat visual estimasi harga batas bawah otomatis secara dinamis
  const basePriceNum = parseInt(bahanPriceValue.replace(/\./g, ''), 10);
  const minPriceCalculated = isNaN(basePriceNum) ? '0' : Number(Math.max(basePriceNum - 4000, 0)).toLocaleString('id-ID');

  // Process locations with full image URLs
  const processedLocations = locations.map(location => ({
    ...location,
    fullImageUrl: getFullImageUrl(location.location_picture)
  }));

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#9E5F3B" />
          <Text style={styles.loadingText}>Memuat detail bahan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !ingredient) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backFallbackButton}>
            <Text style={styles.backFallbackText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF8EF' }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" />
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#9E5F3B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Bahan</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* CARD NAMA BAHAN */}
          <View style={styles.bahanCard}>
            <Image 
              source={{ uri: bahanImage }} 
              style={styles.bahanImage} 
              resizeMode="cover"
            />
            <Text style={styles.bahanName}>{bahanName}</Text>
          </View>

          {/* CARD INFO BAHAN */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Info Bahan</Text>
        

            {locations.length > 0 ? (
              <View>
                <Text style={styles.locationTitle}>Tersedia di Lokasi:</Text>
                {processedLocations.map((location) => (
                  <View key={location.id_location} style={styles.locationItem}>
                    {location.fullImageUrl && (
                      <TouchableOpacity onPress={() => handleOpenMaps(location.google_maps_link)}>
                        <Image
                          source={{ uri: location.fullImageUrl }}
                          style={styles.locationImage}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    )}
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationName}>{location.location_name}</Text>
                      {location.road_name && (
                        <Text style={styles.locationRoad}>{location.road_name}</Text>
                      )}
                      {location.opening_time && location.closing_time ? (
                        <Text style={styles.locationTime}>
                          {location.opening_time} - {location.closing_time}
                        </Text>
                      ) : (
                        <Text style={styles.locationTime}>Jam operasional tidak tersedia</Text>
                      )}
                      {location.price_per_kg_location && (
                        <Text style={styles.locationPrice}>
                          Harga: Rp. {Number(location.price_per_kg_location).toLocaleString('id-ID')}/kg
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noteText}>Data lokasi belum tersedia dari backend.</Text>
            )}
          </View>
       </ScrollView>
      </SafeAreaView>

      <CustomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  loadingText: { marginTop: 10, color: '#9E5F3B', fontWeight: '600' },
  errorText: { color: '#d32f2f', textAlign: 'center', marginBottom: 16, fontSize: 16 },
  backFallbackButton: { backgroundColor: '#9E5F3B', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 18 },
  backFallbackText: { color: '#fff', fontWeight: '700' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#9E5F3B', fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 110 },
  bahanCard: { flexDirection: 'row', backgroundColor: '#9E5F3B', borderRadius: 18, padding: 15, alignItems: 'center', marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  bahanImage: { width: 85, height: 85, borderRadius: 14, backgroundColor: '#FFF8EF' },
  bahanName: { fontSize: 24, color: '#FFFFFF', fontWeight: 'bold', marginLeft: 20, flex: 1, flexWrap: 'wrap', fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia' },
  infoCard: { backgroundColor: '#9E5F3B', borderRadius: 25, padding: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  infoTitle: { fontSize: 26, color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold', fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia', marginBottom: 25 },
  infoRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  infoLabel: { width: 95, fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  infoSeparator: { width: 20, fontSize: 14, color: '#FFFFFF', textAlign: 'center' },
  infoValue: { flex: 1, fontSize: 14, color: '#FFFFFF', fontWeight: '500', lineHeight: 18 },
  
  warningText: { textAlign: 'center', color: '#9E5F3B', opacity: 0.6, fontSize: 12, marginTop: 30, fontStyle: 'italic', paddingHorizontal: 10 },
  noteText: { color: '#FFFFFF', fontSize: 12, marginTop: 18, opacity: 0.85, fontStyle: 'italic' },
  locationTitle: { fontSize: 16, color: '#FFFFFF', fontWeight: '600', marginTop: 18, marginBottom: 12 },
  locationItem: { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  locationImage: { width: '100%', height: 120, backgroundColor: '#EEE' },
  locationInfo: { padding: 12 },
  locationName: { fontSize: 14, color: '#FFFFFF', fontWeight: '600' },
  locationRoad: { fontSize: 12, color: '#FFFFFF', marginTop: 2, opacity: 0.85 },
  locationTime: { fontSize: 12, color: '#FFFFFF', marginTop: 4, opacity: 0.9 },
  locationPrice: { fontSize: 13, color: '#ffffff', marginTop: 6, fontWeight: '600' },
});