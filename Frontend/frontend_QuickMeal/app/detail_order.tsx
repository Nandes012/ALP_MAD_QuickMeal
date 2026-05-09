import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function DetailOrderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Integrasi params dengan fallback seperti pada kode Resep
  const name = params.name || "Menu Order";
  const imageUrl = params.imageUrl ? decodeURIComponent(params.imageUrl as string) : null;
  const price = params.price || "25.000";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header - Identik dengan Detail Resep */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#5b2f20" />
        </TouchableOpacity>
        <Text style={styles.headerTitlePage}>Detail Pesanan Makanan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Banner Card - Identik dengan Detail Resep */}
        <View style={styles.bannerCard}>
          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.foodImage} resizeMode="cover" />
          )}
          <View style={styles.bannerInfo}>
            <Text style={styles.foodName}>{name}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeTextTitle}>Rating</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="star" size={10} color="white" />
                    <Text style={styles.badgeTextValue}> 4.9</Text>
                </View>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeTextTitle}>Harga Menu</Text>
                <Text style={styles.badgeTextValue}>Rp. {price}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Info Restoran - Menggunakan style Accordion agar seragam */}
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Info Restoran</Text>
          
          <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Alamat</Text>
             <Text style={styles.infoValue}>Jl. Bukit Tamarunang, Kec. Somba Opu, Kab. Gowa</Text>
          </View>

          <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Telepon</Text>
             <Text style={styles.infoValue}>: +62875490***</Text>
          </View>

          <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Jam Buka</Text>
             <Text style={styles.infoValue}>: 10:00 - 22:00 WIB</Text>
          </View>

          {/* Map Image - Dibuat rapi di dalam container */}
          <View style={styles.mapWrapper}>
             <Image 
                source={{ uri: 'https://i.pinimg.com/1200x/2e/0a/78/2e0a789278de18b14b6716d8ac229677.jpg' }} 
                style={styles.mapImage}
             />
             <View style={styles.mapLabel}>
                <Ionicons name="location" size={14} color="#9E5F3B" />
                <Text style={styles.mapLabelText}>Lokasi Restoran</Text>
             </View>
          </View>
        </View>

        {/* Estimasi Harga - Menggunakan style StepContainer */}
        <View style={[styles.stepContainer, { marginTop: 20 }]}>
          <Text style={styles.stepTitle}>Estimasi Biaya</Text>
          <View style={styles.priceRow}>
             <Text style={styles.priceText}>Harga Menu</Text>
             <Text style={styles.priceText}>: Rp. {price}</Text>
          </View>
          <View style={styles.priceRow}>
             <Text style={styles.priceText}>Harga Ongkir</Text>
             <Text style={styles.priceText}>: Rp. 6.000</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
             <Text style={styles.totalText}>Total Pesanan</Text>
             <Text style={styles.totalText}>: Rp. 31.000</Text>
          </View>
        </View>

        {/* Estimasi Pengiriman */}
        <View style={[styles.stepContainer, { marginTop: 20 }]}>
          <Text style={styles.stepTitle}>Estimasi Pengiriman</Text>
          <Text style={styles.deliverySub}>Waktu tiba pesanan</Text>
          <Text style={styles.deliveryTime}>30 - 45 Menit</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitlePage: { fontSize: 20, fontWeight: 'bold', color: '#5b2f20' },
  scrollContent: { padding: 20 },
  
  // Banner Style (Sama dengan Resep)
  bannerCard: { backgroundColor: '#9E5F3B', borderRadius: 20, flexDirection: 'row', padding: 15, alignItems: 'center', marginBottom: 25 },
  foodImage: { width: 100, height: 100, borderRadius: 12 },
  bannerInfo: { flex: 1, marginLeft: 15 },
  foodName: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  badgeRow: { flexDirection: 'row', gap: 10 },
  badge: { backgroundColor: 'rgba(255,255,255,0.3)', padding: 8, borderRadius: 10, alignItems: 'center', minWidth: 80 },
  badgeTextTitle: { color: 'white', fontSize: 9, fontWeight: '600' },
  badgeTextValue: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  // Content Card Style (Sama dengan StepContainer di Resep)
  stepContainer: { backgroundColor: 'white', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#ddd' },
  stepTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  
  // Info Restoran Styles
  infoRow: { marginBottom: 8 },
  infoLabel: { fontSize: 13, fontWeight: 'bold', color: '#5b2f20' },
  infoValue: { fontSize: 13, color: '#333', lineHeight: 18 },
  
  // Map Styles
  mapWrapper: { marginTop: 15, borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  mapImage: { width: '100%', height: 120, backgroundColor: '#f0f0f0' },
  mapLabel: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 8, backgroundColor: '#F9F2ED' },
  mapLabelText: { fontSize: 11, fontWeight: 'bold', color: '#9E5F3B', marginLeft: 5 },

  // Price Styles
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  priceText: { fontSize: 13, color: '#333' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  totalText: { fontSize: 14, fontWeight: 'bold', color: '#5b2f20' },

  // Delivery Styles
  deliverySub: { fontSize: 12, color: '#666' },
  deliveryTime: { fontSize: 20, fontWeight: 'bold', color: '#9E5F3B', marginTop: 5 },
});