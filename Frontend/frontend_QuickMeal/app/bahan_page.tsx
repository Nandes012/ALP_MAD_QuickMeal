import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

// 1. Data Source: Daftar bahan berdasarkan nama menu
const DATA_BAHAN: Record<string, string[]> = {
  "Nasi goreng": [
    "2 piring nasi putih dingin",
    "2 butir telur ayam",
    "3 siung bawang merah & 2 siung bawang putih",
    "Kecap manis & saus tiram",
    "Garam, lada, dan kaldu bubuk",
    "Daun bawang iris"
  ],
  "Ayam kremas": [
    "500gr daging ayam potong",
    "Bumbu ungkep (lengkuas, kunyit, jahe)",
    "Tepung beras & tapioka (untuk kremesan)",
    "Baking powder agar renyah",
    "Minyak goreng",
    "Air kelapa (opsional untuk ungkep)"
  ],
  "Burger Spaicy": [
    "Roti burger (Bun)",
    "Daging patty sapi/ayam",
    "Bubuk cabai & saus sambal ekstra pedas",
    "Selada, tomat, dan timun",
    "Keju slice",
    "Mayones pedas"
  ],
  "Resep Ayam Crispy": [
    "Potongan ayam segar",
    "Tepung terigu protein tinggi",
    "Tepung maizena",
    "Susu cair & telur (untuk celupan)",
    "Bawang putih bubuk & paprika bubuk",
    "Garam & merica"
  ],
  "Resep Pisang Goreng": [
    "1 sisir pisang kepok/raja",
    "Tepung terigu & tepung beras",
    "Sedikit margarin cair",
    "Gula pasir & sejumput garam",
    "Air secukupnya",
    "Vanilla ekstrak (opsional)"
  ],
  "Resep Bakwan": [
    "Wortel iris korek api",
    "Kol/kubis iris halus",
    "Tauge segar",
    "Tepung terigu & maizena",
    "Bawang putih & ketumbar halus",
    "Daun seledri & daun bawang"
  ],
  "Resep Tempe Mendoan": [
    "Tempe khusus mendoan (iris tipis lebar)",
    "Tepung terigu & tepung beras",
    "Daun bawang iris banyak",
    "Kunyit bubuk & ketumbar",
    "Garam & air",
    "Sambal kecap untuk cocolan"
  ]
};

export default function BahanPage() {
  const router = useRouter();
  const { name } = useLocalSearchParams();

  // 2. Ambil bahan berdasarkan 'name' yang dikirim dari params. 
  // Jika nama tidak ditemukan, tampilkan pesan default.
  const listBahan = DATA_BAHAN[name as string] || ["Bahan belum tersedia untuk resep ini"];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#5b2f20" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bahan {name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.infoText}>Daftar bahan yang perlu disiapkan:</Text>
          {listBahan.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={14} color="white" />
              </View>
              <Text style={styles.itemText}>{item}</Text>
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
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#5b2f20', flex: 1, textAlign: 'center' },
  content: { padding: 20 },
  card: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 20, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: { fontSize: 14, color: '#9E5F3B', marginBottom: 20, fontWeight: '600' },
  itemRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FDF7F2'
  },
  checkCircle: { 
    width: 22, 
    height: 22, 
    borderRadius: 11, 
    backgroundColor: '#9E5F3B', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  itemText: { fontSize: 15, color: '#333', flex: 1, fontWeight: '500' }
});