import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, StatusBar, Platform, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface ResepItem {
  id: string;
  title: string;
  price: string;
  time: string;
  image: string;
}

// Data Array untuk memudahkan kamu mengubah Title, Harga, Waktu, dan Gambar Resep sendiri
const TOP_RECS: ResepItem[] = [
  { id: 't1', title: 'Resep Nasi Goreng Orak Arik', price: '25.000', time: '20 Menit', image: 'https://i.pinimg.com/1200x/9a/f6/9f/9af69fd227aa680e75b2bdd6404162c8.jpg' },
  { id: 't2', title: 'Resep Telur Kecap', price: '25.000', time: '10 Menit', image: 'https://i.pinimg.com/736x/78/c0/8b/78c08ba3ed2d852a4e535fe7bc1e7aae.jpg' },
  { id: 't3', title: 'Resep Tempe Goreng Kriuk', price: '25.000', time: '20 Menit', image: 'https://i.pinimg.com/736x/71/48/60/714860a183bf15c2e9b1608ac0891911.jpg' },
];

const OTHER_RECS: ResepItem[] = [
  { id: 'o1', title: 'Resep Ayam Crispy', price: '25.000', time: '20 Menit', image: 'https://i.pinimg.com/1200x/13/f2/6e/13f26ed3347cc08c913d74d61456ae35.jpg' },
  { id: 'o2', title: 'Resep Pisang Goreng', price: '25.000', time: '20 Menit', image: 'https://i.pinimg.com/736x/a9/ee/b1/a9eeb17125f76fe28397bdb5073a9026.jpg' },
  { id: 'o3', title: 'Resep Bakwan', price: '25.000', time: '20 Menit', image: 'https://i.pinimg.com/736x/fb/d8/4c/fbd84cc9243979932bfef630eb1f1cb5.jpg' },
];

export default function HasilRecResepScreen() {
  const router = useRouter();

  const renderCard = (item: ResepItem) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push({
        pathname: '/detail_resep',
        params: { name: item.title, imageUrl: item.image, price: item.price }
      })}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        
        <View style={styles.cardRow}>
          {/* Menggunakan simbol dollar pudar sesuai tampilan mockup asli kamu */}
          <Text style={styles.cardPrice}>$ Rp. {item.price}</Text>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.cardTime}>{item.time}</Text>
          </View>
        </View>

        <Text style={styles.detailText}>Lihat Resep</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9E5F3B" />
      
      {/* 1. BAGIAN BACKGROUND YANG BISA KAMU UBAH SENDIRI JALURNYA */}
      <ImageBackground 
        source={require('../assets/images/cook.png')} // Silakan ganti nama file gambar latar belakang di sini
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay transparan tipis krem agar teks/konten di atas gambar latar belakang tetap terbaca jelas */}
        <View style={styles.darkOverlay}>
          
          {/* HEADER COKELAT SOLID */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerSubtitle}>
              Berdasarkan waktu, budget & bahan kamu, kami rekomendasikan masak sendiri
            </Text>
          </View>
          
          {/* DAFTAR KONTEN */}
          <FlatList
            data={TOP_RECS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderCard(item)}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<Text style={styles.sectionTitle}>Rekomendasi Terbaik</Text>}
            ListFooterComponent={
              <View style={{ marginTop: 10 }}>
                <Text style={styles.sectionTitle}>Pilihan Lainnya</Text>
                {OTHER_RECS.map((item) => renderCard(item))}
              </View>
            }
          />

          {/* --- CUSTOM NAVBAR --- */}
          <View style={styles.navbarContainer}>
            <View style={styles.navbar}>
              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
                <Ionicons name="home-outline" size={24} color="white" />
                <Text style={styles.navText}>Home</Text>
              </TouchableOpacity>

              {/* Tombol Tengah Bulat Menembus Batas */}
              <View style={styles.centerIconWrapper}>
                <TouchableOpacity style={styles.centerIconBg} onPress={() => router.push('/food_rec')}>
                  <Ionicons name="search" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.navTextCenter}>Get Food Rec</Text>
              </View>

              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/explore')}>
                <Ionicons name="file-tray-full-outline" size={24} color="white" />
                <Text style={styles.navText}>List</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  darkOverlay: { flex: 1, backgroundColor: 'rgba(255, 248, 239, 0.4)' }, // Mengatur kepekatan background (ubah 0.4 jika ingin lebih transparan/gelap)
  headerContainer: { 
    backgroundColor: '#9E5F3B', 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingBottom: 25, 
    paddingHorizontal: 30,
    alignItems: 'center'
  },
  headerSubtitle: { 
    color: 'white', 
    fontSize: 14, 
    fontWeight: '600',
    textAlign: 'center', 
    lineHeight: 20 
  },
  listContent: { 
    paddingHorizontal: 25, 
    paddingTop: 20,
    paddingBottom: 110 // Mencegah konten tertutup oleh bar navigasi bawah
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#8D5B3E', 
    marginBottom: 15,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
  },
  card: { 
    backgroundColor: '#9E5F3B', 
    borderRadius: 15, 
    flexDirection: 'row', 
    padding: 12, 
    marginBottom: 15, 
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  cardImage: { width: 75, height: 75, borderRadius: 12, backgroundColor: '#EAEAEA' },
  cardInfo: { flex: 1, marginLeft: 15 },
  cardTitle: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  cardPrice: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 12, fontWeight: '500', marginRight: 20 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  cardTime: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 12, marginLeft: 4 },
  detailText: { color: 'white', fontSize: 12, textDecorationLine: 'underline', marginTop: 6, fontWeight: '500' },
  
  // --- BOTTOM FIXED NAVBAR STYLES ---
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#9E5F3B',
    height: 65,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  centerIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  centerIconBg: {
    backgroundColor: '#8D5B3E',
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF8EF', // Border luar tombol mengikuti warna dasar krem proyekmu
    marginTop: -35, 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
    color: 'white',
    fontWeight: '500',
  },
  navTextCenter: {
    fontSize: 10,
    color: 'white',
    marginTop: 2,
    fontWeight: '600',
  }
});