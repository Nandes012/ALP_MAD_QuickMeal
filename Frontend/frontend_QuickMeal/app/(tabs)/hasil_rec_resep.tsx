import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. Definisi Tipe Data
interface ResepItem {
  id: string;
  title: string;
  menu?: string;
  price: string;
  time: string;
  image: string; // Kita ubah tipe datanya menjadi string (URL)
}

// 2. DATA DENGAN URL GAMBAR (Ganti link di dalam tanda kutip dengan link kamu)
const TOP_RECS: ResepItem[] = [
  { 
    id: 't1', 
    title: 'Resep Spesial 1', 
    menu: 'Nasi goreng', 
    price: '25.000', 
    time: '15 - 20 Menit', 
    image: 'https://i.pinimg.com/736x/11/a0/8f/11a08f16b0beaa1eefdb30583f1da8f6.jpg' // <--- GANTI URL DISINI
  },
  { 
    id: 't2', 
    title: 'Resep Spesial 2', 
    menu: 'Ayam kremas', 
    price: '25.000', 
    time: '15 - 20 Menit', 
    image: 'https://i.pinimg.com/736x/02/06/01/020601302dedab7013734a652062966d.jpg' // <--- GANTI URL DISINI
  },
  { 
    id: 't3', 
    title: 'Resep Spesial 3', 
    menu: 'Burger Spaicy', 
    price: '25.000', 
    time: '15 - 20 Menit', 
    image: 'https://i.pinimg.com/736x/38/bb/96/38bb963a9c08bc4b4894b98b9d5ff32c.jpg' // <--- GANTI URL DISINI
  },
];

const OTHER_RECS: ResepItem[] = [
  { id: 'o1', title: 'Resep Ayam Crispy', price: '25.000', time: '15-20 Min', image: 'https://i.pinimg.com/736x/5b/d5/05/5bd505f837ab3aa00ac51eea9ce3c5a4.jpg' },
  { id: 'o2', title: 'Resep Pisang Goreng', price: '25.000', time: '15-20 Min', image: 'https://i.pinimg.com/736x/a9/ee/b1/a9eeb17125f76fe28397bdb5073a9026.jpg' },
  { id: 'o3', title: 'Resep Bakwan', price: '25.000', time: '15-20 Min', image: 'https://i.pinimg.com/1200x/0b/58/23/0b582305b2368e3f1e4e60a3f90da4b9.jpg' },
  { id: 'o4', title: 'Resep Tempe Mendoan', price: '15.000', time: '10-15 Min', image: 'https://i.pinimg.com/736x/41/58/7b/41587be549c3e4ddda64cc86b69204cd.jpg' },
  { id: 'o5', title: 'Resep Sayur Asem', price: '20.000', time: '20-25 Min', image: 'https://i.pinimg.com/736x/77/a4/d1/77a4d1f15ba7a10919b0e55721130a58.jpg' },
  { id: 'o6', title: 'Resep Telur Balado', price: '18.000', time: '15 Min', image: 'https://i.pinimg.com/1200x/2f/1c/46/2f1c464817c86b700fe116f04081aa9f.jpg' },
  { id: 'o7', title: 'Resep Cah Kangkung', price: '12.000', time: '10 Min', image: 'https://i.pinimg.com/1200x/e2/33/70/e23370da5d06c784c091e8c3a56c9171.jpg' },
  { id: 'o8', title: 'Resep Oreg Tempe', price: '15.000', time: '15 Min', image: 'https://i.pinimg.com/736x/68/a8/84/68a8846edaee438a6ce6634199d56e68.jpg' },
];

export default function HasilRecResepScreen() {
  
  const renderCard = (item: ResepItem) => (
    <TouchableOpacity key={item.id} style={styles.card}>
      {/* PENTING: Gunakan source={{ uri: item.image }} untuk menampilkan gambar dari URL */}
      <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
      
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.menu && <Text style={styles.cardMenu}>{item.menu}</Text>}
        <View style={styles.cardRow}>
          <Text style={styles.cardPrice}>$ Rp. {item.price}</Text>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color="white" />
            <Text style={styles.cardTime}>{item.time}</Text>
          </View>
        </View>
        <Text style={styles.detailText}>Lihat Detail</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground 
        source={require('../../assets/images/cook.png')} 
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.overlay} edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Kamu bisa masak!!!</Text>
            <Text style={styles.headerSubtitle}>Berdasarkan waktu, budget & bahan kamu, kami rekomendasikan masak sendiri</Text>
          </View>

          <FlatList
            data={TOP_RECS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderCard(item)}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<Text style={styles.sectionTitle}>Rekomendasi Terbaik</Text>}
            ListFooterComponent={
              <View style={{ marginTop: 20 }}>
                <Text style={styles.sectionTitle}>Pilihan Lainnya</Text>
                {OTHER_RECS.map((item) => renderCard(item))}
              </View>
            }
          />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(252, 248, 245, 0.4)' },
  header: {
    paddingVertical: 25,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: { color: '#5b2f20', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  headerSubtitle: { color: '#5b2f20', fontSize: 12, textAlign: 'center', marginTop: 8, lineHeight: 18 },
  listContent: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#9E5F3B', marginBottom: 15 },
  card: {
    backgroundColor: '#9E5F3B',
    borderRadius: 15,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  cardImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 12, 
    backgroundColor: '#ddd' // Warna abu-abu muncul jika gambar sedang loading
  },
  cardInfo: { flex: 1, marginLeft: 15 },
  cardTitle: { color: 'white', fontSize: 15, fontWeight: 'bold' },
  cardMenu: { color: 'white', fontSize: 13, marginTop: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  cardPrice: { color: 'white', fontSize: 12, fontWeight: '600', marginRight: 15 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  cardTime: { color: 'white', fontSize: 11, marginLeft: 4 },
  detailText: { color: 'white', fontSize: 11, textDecorationLine: 'underline', marginTop: 8 },
});