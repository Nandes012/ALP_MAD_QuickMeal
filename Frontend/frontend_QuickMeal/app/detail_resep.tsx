import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function DetailResepScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const name = params.name || "Resep Makanan";
  const imageUrl = params.imageUrl ? decodeURIComponent(params.imageUrl as string) : null;
  const price = params.price || "0";
  const time = params.time || "25 Menit"; 

  // Ambil string ingredients dan parse dengan aman
  let ingredientsData = [];
  if (params.ingredients) {
    try {
      ingredientsData = typeof params.ingredients === 'string' 
        ? JSON.parse(params.ingredients) 
        : params.ingredients;
    } catch (e) {
      console.error("Gagal parse ingredients", e);
      ingredientsData = [];
    }
  }
  
  const totalIngredients = ingredientsData.length;

  const LANGKAH = [
    `Persiapkan semua bahan yang diperlukan untuk membuat ${name}.`,
    `Cuci bersih dan potong bahan sesuai instruksi resep.`,
    `Panaskan alat masak, lalu olah bumbu hingga harum.`,
    `Masak hingga matang merata dan koreksi rasa.`,
    `Sajikan ${name} selagi hangat.`,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5b2f20" />
        </TouchableOpacity>
        <Text style={styles.headerTitlePage}>Detail Resep</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.bannerCard}>
          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.foodImage} resizeMode="cover" />
          )}
          <View style={styles.bannerInfo}>
            <Text style={styles.foodName} numberOfLines={2}>{name}</Text>
            {/* badgeRow menggunakan flexWrap agar tidak keluar dari card */}
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Ionicons name="time-outline" size={12} color="white" />
                <Text style={styles.badgeTextValue}>{time}</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="wallet-outline" size={12} color="white" />
                <Text style={styles.badgeTextValue}>Rp. {price}</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.accordion}
          onPress={() => router.push({ 
            pathname: '/bahan_page', 
            params: { 
              name: name, 
              // Pastikan data dikirim kembali dalam bentuk string
              ingredients: JSON.stringify(ingredientsData) 
            } 
          })}
        >
          <View style={styles.accordionLeft}>
            <Ionicons name="fast-food-outline" size={20} color="#9E5F3B" />
            <Text style={styles.accordionText}>Bahan-bahan ({totalIngredients} item)</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.accordion}
          onPress={() => router.push({ pathname: '/alat_page', params: { name } })}
        >
          <View style={styles.accordionLeft}>
            <Ionicons name="restaurant-outline" size={20} color="#9E5F3B" />
            <Text style={styles.accordionText}>Alat Masak</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Langkah Memasak</Text>
          {LANGKAH.map((item, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <View style={styles.stepTextBubble}>
                <Text style={styles.stepText}>{item}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 },
  backButton: { padding: 8 },
  headerTitlePage: { fontSize: 20, fontWeight: 'bold', color: '#5b2f20' },
  scrollContent: { padding: 20 },
  
  bannerCard: { 
    backgroundColor: '#9E5F3B', 
    borderRadius: 25, 
    padding: 15, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20,
    minHeight: 130, // Memberi ruang minimal agar tidak sesak
    elevation: 5
  },
  foodImage: { width: 90, height: 90, borderRadius: 20 },
  bannerInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  foodName: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  
  badgeRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', // KUNCI AGAR TIDAK KELUAR CARD
    gap: 6 
  },
  badge: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)', 
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    borderRadius: 10,
    gap: 4,
    marginBottom: 4 // Jarak jika ter-wrap ke bawah
  },
  badgeTextValue: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  accordion: { 
    backgroundColor: 'white', borderRadius: 18, padding: 18, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    borderWidth: 1, borderColor: '#F0E0D0', marginBottom: 12, elevation: 2
  },
  accordionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  accordionText: { fontSize: 15, fontWeight: '600', color: '#333' },

  stepContainer: { backgroundColor: 'white', borderRadius: 25, padding: 20, borderWidth: 1, borderColor: '#F0E0D0', marginTop: 10 },
  stepTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 20, color: '#5b2f20' },
  stepRow: { flexDirection: 'row', marginBottom: 18, alignItems: 'flex-start' },
  stepNumberContainer: { backgroundColor: '#9E5F3B', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 },
  stepNumber: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  stepTextBubble: { flex: 1, backgroundColor: '#FDF7F2', padding: 15, borderRadius: 15, borderLeftWidth: 3, borderLeftColor: '#9E5F3B' },
  stepText: { fontSize: 14, color: '#444', lineHeight: 20 },
});