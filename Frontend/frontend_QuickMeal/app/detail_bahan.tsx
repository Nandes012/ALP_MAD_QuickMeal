import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform, StatusBar, ActivityIndicator } from 'react-native';
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
};

export default function DetailBahan() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const ingredientId = params.id ? String(params.id) : '';
  
  const [ingredient, setIngredient] = useState<IngredientDetail | null>(null);
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

    fetchIngredient();
  }, [ingredientId]);

  const bahanName = (ingredient?.name || params.name ? String(ingredient?.name || params.name) : 'Bahan').replace(/\s+/g, ' ').trim();
  const bahanImage = ingredient?.ingredient_picture || (params.imageUrl ? String(params.imageUrl) : 'https://via.placeholder.com/300');
  const bahanPriceValue = typeof ingredient?.price_per_kg === 'number'
    ? Number(ingredient.price_per_kg).toLocaleString('id-ID')
    : params.price
      ? String(params.price)
      : '0';

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
            
            {/* Baris Harga (Menggunakan Harga Tertinggi) */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Harga / 1kg</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>Rp. {bahanPriceValue}</Text>
            </View>

            {/* Baris Jam Operasional */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Jam Buka</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>07.00 - 21.00 WITA</Text>
            </View>

            {/* Baris Tempat Lokasi */}
            <View style={[styles.infoRow, { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 }]}>
              <Text style={styles.infoLabel}>Lokasi Toko</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>Pasar Tradisional Toddopuli, Blok B No. 12, Makassar</Text>
            </View>

            {/* Gambar Lokasi / Peta Mini */}
            <Text style={[styles.infoLabel, { width: '100%', marginBottom: 8, fontWeight: 'bold' }]}>Denah Peta Lokasi :</Text>
            <View style={styles.mapContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop' }} 
                style={styles.mapImage}
                resizeMode="cover"
              />
              <View style={styles.mapOverlayBadge}>
                <Ionicons name="location" size={16} color="#9E5F3B" />
                <Text style={styles.mapBadgeText}>Lihat di Google Maps</Text>
              </View>
            </View>

          </View>

          {/* FOOTER PERINGATAN */}
          <Text style={styles.warningText}>Informasi harga, jam kerja, dan koordinat toko mengikuti data backend terbaru.</Text>
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
  
  // Gaya Baru untuk Gambar Peta Lokasi
  mapContainer: { width: '100%', height: 150, borderRadius: 18, overflow: 'hidden', marginTop: 5, position: 'relative' },
  mapImage: { width: '100%', height: '100%' },
  mapOverlayBadge: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#FFF8EF', flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, elevation: 2 },
  mapBadgeText: { color: '#9E5F3B', fontSize: 11, fontWeight: 'bold', marginLeft: 4 },
  
  warningText: { textAlign: 'center', color: '#9E5F3B', opacity: 0.6, fontSize: 12, marginTop: 30, fontStyle: 'italic', paddingHorizontal: 10 },
});