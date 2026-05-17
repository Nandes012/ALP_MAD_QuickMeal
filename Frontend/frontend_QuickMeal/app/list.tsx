import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Import CustomNavbar resmi
import CustomNavbar from '../components/CustomNavbar';

interface FoodItem {
  id: string;
  name: string;
  price: string;
  imageUri: string;
}

// 1. DATA UNTUK TAB MASAK (9 Item)
const MASAK_DATA: FoodItem[] = [
  { 
    id: 'm1', 
    name: 'Indomie Goreng Nugget', 
    price: '25.000', 
    imageUri: 'https://i.pinimg.com/736x/4c/a7/9b/4ca79b5be9d75d72916045b5798112f8.jpg' 
  },
  { 
    id: 'm2', 
    name: 'Ayam Goreng Kecap', 
    price: '28.000', 
    imageUri: 'https://i.pinimg.com/736x/3d/cc/04/3dcc04f4373bbcb7cef3dc1beaf199ca.jpg' 
  },
  { 
    id: 'm3', 
    name: 'Sayur Bening', 
    price: '21.000', 
    imageUri: 'https://i.pinimg.com/736x/af/1c/30/af1c300d688e07bc32b7caf498d65748.jpg' 
  },
  { 
    id: 'm4', 
    name: 'Ikan Goreng Tepung', 
    price: '30.000', 
    imageUri: 'https://i.pinimg.com/736x/2b/7b/e4/2b7be4bc75863e123ae36c5d4a5633a7.jpg' 
  },
  { 
    id: 'm5', 
    name: 'Telur Kecap Special', 
    price: '15.000', 
    imageUri: 'https://i.pinimg.com/736x/78/c0/8b/78c08ba3ed2d852a4e535fe7bc1e7aae.jpg' 
  },
  { 
    id: 'm6', 
    name: 'Tumis Kangkung Belacan', 
    price: '12.000', 
    imageUri: 'https://i.pinimg.com/736x/7d/39/8a/7d398aaece5ccbcdc0ce655a3914be50.jpg' 
  },
  { 
    id: 'm7', 
    name: 'Nasi Goreng Kecap Telur', 
    price: '20.000', 
    imageUri: 'https://i.pinimg.com/736x/41/ea/77/41ea77cce5d524f2616c089f2152fd4c.jpg' 
  },
  { 
    id: 'm8', 
    name: 'Martabak Mie Telor', 
    price: '14.000', 
    imageUri: 'https://i.pinimg.com/736x/00/f9/4f/00f94f9245e7daeb143073ecc3174dd7.jpg' 
  },
  { 
    id: 'm9', 
    name: 'Tahu Cabe Garam', 
    price: '16.000', 
    imageUri: 'https://i.pinimg.com/1200x/67/15/ec/6715ecd7877ab4581240839cd1ba3b2f.jpg' 
  },
];

// 2. DATA UNTUK TAB BAHAN (10 Item)
const BAHAN_DATA: FoodItem[] = [
  { 
    id: 'b1', 
    name: 'Tepung Terigu', 
    price: '16.000', 
    imageUri: 'https://i.pinimg.com/736x/fc/c0/ac/fcc0ac8060e5dfeb0de61b226bb59199.jpg' 
  },
  { 
    id: 'b2', 
    name: 'Telur Ayam', 
    price: '35.000', 
    imageUri: 'https://i.pinimg.com/1200x/62/e5/7f/62e57f49df077ed9e7d8c8f0af3caeec.jpg' 
  },
  { 
    id: 'b3', 
    name: 'Minyak Goreng', 
    price: '28.900', 
    imageUri: 'https://i.pinimg.com/736x/38/5a/f1/385af1e0d89a3a7d8dd8488398f95f37.jpg' 
  },
  { 
    id: 'b4', 
    name: 'Beras Putih', 
    price: '21.000', 
    imageUri: 'https://i.pinimg.com/736x/d2/ba/ce/d2bace10f91033f416335a3ccbb753c9.jpg' 
  },
  { 
    id: 'b5', 
    name: 'Daging Ayam Fillet', 
    price: '45.000', 
    imageUri: 'https://i.pinimg.com/1200x/93/c9/7b/93c97b11397b222ac817e839c900e8e2.jpg' 
  },
  { 
    id: 'b6', 
    name: 'Cabai Rawit Merah', 
    price: '12.000', 
    imageUri: 'https://i.pinimg.com/1200x/1d/5a/e2/1d5ae2a0ad24fca7a07df3e9a8cbe55d.jpg' 
  },
  { 
    id: 'b7', 
    name: 'Bawang Merah', 
    price: '15.000', 
    imageUri: 'https://i.pinimg.com/1200x/d0/34/0f/d0340f5da579d87ad1fb51deeee3ea7c.jpg' 
  },
  { 
    id: 'b8', 
    name: 'Mentega Margarin', 
    price: '9.500', 
    imageUri: 'https://i.pinimg.com/736x/22/73/42/227342d7bfce05cc00f240fba87e8a13.jpg' 
  },
  { 
    id: 'b9', 
    name: 'Kecap Manis', 
    price: '11.000', 
    imageUri: 'https://i.pinimg.com/1200x/3f/78/4e/3f784eba5d6814d509ad8cd2fb486fe5.jpg' 
  },
  { 
    id: 'b10', 
    name: 'Bawang Putih', 
    price: '11.000', 
    imageUri: 'https://i.pinimg.com/1200x/5a/b9/be/5ab9be48ddc23379df5d9937285291ed.jpg' 
  },
];

export default function ListScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Masak' | 'Bahan'>('Masak');

  // Fungsi navigasi yang disatukan agar konsisten di-trigger dari komponen mana pun
  const handleItemPress = (item: FoodItem) => {
    // Normalisasi teks untuk menghilangkan potensi spasi ganda yang merusak key database lokal
    const cleanName = item.name.replace(/\s+/g, ' ').trim();

    if (activeTab === 'Masak') {
      router.push({
        pathname: '/detail_resep',
        params: { name: cleanName, imageUrl: item.imageUri }
      });
    } else {
      router.push({
        pathname: '/detail_bahan',
        params: { name: cleanName, imageUrl: item.imageUri, price: item.price }
      });
    }
  };

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    /* Mengubah View terluar kartu menjadi TouchableOpacity agar seluruh area kartu bisa diklik */
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => handleItemPress(item)}
    >
      {/* Sisi Kiri: Informasi Teks & Tombol */}
      <View style={styles.cardInfo}>
        <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.foodPrice}>Rp. {item.price}</Text>
        
        {/* Tombol visual dipertahankan agar UI tidak berubah, di-redirect ke fungsi yang sama */}
        <View style={styles.actionButton}>
          <Text style={styles.actionButtonText}>
            {activeTab === 'Masak' ? 'Resep' : 'Detail Bahan'}
          </Text>
        </View>
      </View>

      {/* Sisi Kanan: Gambar */}
      <Image source={{ uri: item.imageUri }} style={styles.foodImage} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8EF" />
      
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.logoText}>QuickMeal</Text>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Image 
            source={{ uri: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </SafeAreaView>

      {/* --- TAB SWITCHER OVAL --- */}
      <View style={styles.tabOuterContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'Masak' && styles.activeTabBg]} 
            onPress={() => setActiveTab('Masak')}
          >
            <Text style={[styles.tabText, activeTab === 'Masak' && { color: '#FFFFFF', fontWeight: 'bold' }]}>Masak</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'Bahan' && styles.activeTabBg]} 
            onPress={() => setActiveTab('Bahan')}
          >
            <Text style={[styles.tabText, activeTab === 'Bahan' && { color: '#FFFFFF', fontWeight: 'bold' }]}>Bahan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Judul Section Dinamis */}
      <Text style={styles.sectionTitle}>
        {activeTab === 'Masak' ? 'Resep Makanan' : 'Info Bahan'}
      </Text>

      <FlatList
        data={activeTab === 'Masak' ? MASAK_DATA : BAHAN_DATA}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* CustomNavbar Bawah Terintegrasi */}
      <CustomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 10 },
  logoText: { fontSize: 24, color: '#9E5F3B', fontWeight: 'bold', fontFamily: 'Langar-Regular' },
  profileImage: { width: 42, height: 42, borderRadius: 21, borderWidth: 1.5, borderColor: '#5b2f20' },
  tabOuterContainer: { paddingHorizontal: 25, marginTop: 10 },
  tabContainer: { 
    flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 35, padding: 4, alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4
  },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 30 },
  activeTabBg: { backgroundColor: '#9E5F3B' },
  tabText: { fontSize: 22, color: '#1A1A1A', fontFamily: 'Langar-Regular' },
  sectionTitle: { textAlign: 'center', fontSize: 24, color: '#9E5F3B', marginTop: 20, marginBottom: 15, fontWeight: '600', fontFamily: 'Langar-Regular' },
  listContent: { paddingHorizontal: 25, paddingBottom: 110 },
  card: { 
    backgroundColor: '#9E5F3B', 
    borderRadius: 24, 
    flexDirection: 'row', 
    padding: 16, 
    marginBottom: 15, 
    alignItems: 'center', 
    justifyContent: 'space-between',
    elevation: 3 
  },
  cardInfo: { flex: 1, marginRight: 15, justifyContent: 'center' },
  foodName: { color: 'white', fontSize: 22, fontWeight: '500', fontFamily: 'Langar-Regular', marginBottom: 4 },
  foodPrice: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 14, marginBottom: 12 },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  foodImage: { 
    width: 95, 
    height: 95, 
    borderRadius: 20,
    backgroundColor: '#FFFFFF'
  },
});