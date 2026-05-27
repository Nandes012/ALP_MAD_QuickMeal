import React from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomNavbar from '@/components/CustomNavbar';
import { IngredientDetail, Location } from './detailBahan.model';

type Props = Readonly<{
  router: { back: () => void };
  loading: boolean;
  error: string | null;
  ingredient: IngredientDetail | null;
  bahanName: string;
  bahanImage: string;
  bahanPriceValue: string;
  minPriceCalculated: string;
  processedLocations: Array<Location & { fullImageUrl: string }>;
  handleOpenMaps: (locationLink: string | null | undefined) => Promise<void>;
}>;

export default function DetailBahanView(props: Props) {
  const {
    router,
    loading,
    error,
    ingredient,
    bahanName,
    bahanImage,
    processedLocations,
    handleOpenMaps,
  } = props;

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

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#9E5F3B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Bahan</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.bahanCard}>
            <Image
              source={{ uri: bahanImage }}
              style={styles.bahanImage}
              resizeMode="cover"
            />
            <Text style={styles.bahanName}>{bahanName}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Info Bahan</Text>

            {processedLocations.length > 0 ? (
              <View>
                <Text style={styles.locationTitle}>Tersedia di Lokasi:</Text>
                {processedLocations.map((location) => (
                  <View key={location.id_location} style={styles.locationItem}>
                    {Boolean(location.fullImageUrl) && (
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
                      {Boolean(location.road_name) && (
                        <Text style={styles.locationRoad}>{location.road_name}</Text>
                      )}
                      {location.opening_time && location.closing_time ? (
                        <Text style={styles.locationTime}>
                          {location.opening_time} - {location.closing_time}
                        </Text>
                      ) : (
                        <Text style={styles.locationTime}>Jam operasional tidak tersedia</Text>
                      )}
                      {Boolean(location.price_per_kg_location) && (
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
