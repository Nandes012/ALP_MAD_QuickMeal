import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

import CustomNavbar from '../components/CustomNavbar'; 

export default function DetailBahan() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Ambil parameter dan bersihkan string dari spasi berlebih
  const bahanName = params.name ? String(params.name).replace(/\s+/g, ' ').trim() : 'Terigu';
  const bahanImage = params.imageUrl ? String(params.imageUrl) : 'https://i.pinimg.com/736x/11/4a/c0/114ac012b1a8d11c7847c2e361da533d.jpg';
  const bahanPrice = params.price ? String(params.price) : '16.000';

  // Membuat visual estimasi harga batas bawah otomatis secara dinamis
  const basePriceNum = parseInt(bahanPrice.replace(/\./g, ''), 10);
  const minPriceCalculated = isNaN(basePriceNum) ? '11.000' : Number(basePriceNum - 4000).toLocaleString('id-ID');

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
            
            {/* Baris Harga */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Harga / 1kg</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>Rp. {minPriceCalculated} - Rp. {bahanPrice}</Text>
            </View>

            {/* Baris Jam Buka */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Jam Buka</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>10:00 - 22:00 WIB</Text>
            </View>

            {/* Lokasi Pasar */}
            <Text style={styles.lokasiPasarTitle}>Lokasi Pasar Terdekat</Text>
            <View style={styles.lokasiContainer}>
              <Ionicons name="location" size={18} color="#1A1A1A" style={styles.pinIcon} />
              <Text style={styles.lokasiText}>
                Jl. Kumala No. 29 A, Kec. Tamalate. Salah satu pasar tradisional terbesar dan terlengkap di Makassar.
              </Text>
            </View>

            {/* Gambar Mockup Peta */}
            <View style={styles.mapContainer}>
              <Image 
                source={{ uri: 'https://www.google.com/maps/vt/data=_kRXnbYalAazODW7tW-bTUoC6qzVMhlnBUPKnH9T9f88CxlKsNz20q2LQvOaT39WXE4ghdvT_GgFVGeSCKuce-2pEINQKTbIBy--LpahDOC8mVDiGeLgRMRfdhienwXKz_jNEOBrJNEixUM-lN9M67bLHPIugTjzeZZ-qWtf6PO2bv-IIHH6ckBfgVAvvLY2AIPuwTeTqdc' }} 
                style={styles.mapImage}
                resizeMode="cover"
              />
              <View style={styles.mapFooter}>
                <Text style={styles.mapFooterText}>Lokasi Pasar</Text>
              </View>
            </View>
          </View>

          {/* FOOTER PERINGATAN */}
          <Text style={styles.warningText}>Informasi dari halaman tidak 100% akurat</Text>
        </ScrollView>
      </SafeAreaView>

      <CustomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  infoSeparator: { width: 20, fontSize: 14, color: '#FFFFFF' },
  infoValue: { flex: 1, fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  lokasiPasarTitle: { fontSize: 14, color: '#FFFFFF', fontWeight: 'bold', marginTop: 25, marginBottom: 8, fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia' },
  lokasiContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  pinIcon: { marginRight: 6 },
  lokasiText: { flex: 1, fontSize: 12, color: '#FFFFFF', lineHeight: 16 },
  mapContainer: { borderRadius: 15, overflow: 'hidden', backgroundColor: '#FFFFFF', marginTop: 5 },
  mapImage: { width: '100%', height: 130 },
  mapFooter: { backgroundColor: '#7A4325', paddingVertical: 8, alignItems: 'center' },
  mapFooterText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  warningText: { textAlign: 'center', color: '#9E5F3B', opacity: 0.6, fontSize: 12, marginTop: 30, fontStyle: 'italic' },
});