import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomNavbar from '../../components/CustomNavbar';
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';

const { width } = Dimensions.get('window');

// =========================================================
// 1. PUSAT PENGATURAN LINK GAMBAR (Ubah di sini saja)
// =========================================================
const MY_IMAGES = {
  profile: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg',
  chefIcon: 'https://cdn-icons-png.flaticon.com/512/1000/1000390.png',
  
  // Link untuk Section Rekomendasi (Card Cokelat Horizontal)
  resep1: 'https://i.pinimg.com/736x/b8/2b/49/b82b494cdd3649fa11d52947a476b9f6.jpg',
  resep2: 'https://i.pinimg.com/736x/e9/a2/8d/e9a28dce703b11b2e1039f74ed9e1b8f.jpg',
  resep3: 'https://i.pinimg.com/1200x/a6/e5/72/a6e5726b06f614acbf383d08e70cb6d7.jpg',
  resep4: 'https://i.pinimg.com/736x/00/47/b9/0047b9bbf29995b597973ac16d3cdb23.jpg',
  
  // Link untuk Section Sudah Dilihat (Card Vertikal Grid)
  grid1: 'https://i.pinimg.com/1200x/90/b7/3f/90b73fc7d86afbb17546faeb75fa8135.jpg', // Gambar Nasi Goreng
  grid2: 'https://i.pinimg.com/1200x/e2/33/70/e23370da5d06c784c091e8c3a56c9171.jpg', // Gambar Tumis Kangkung
  grid3: 'https://i.pinimg.com/736x/71/48/60/714860a183bf15c2e9b1608ac0891911.jpg', // Gambar Tempe Goreng
  grid4: 'https://i.pinimg.com/736x/23/7c/56/237c5609e4a815edc581085f8a8f05e6.jpg', // Gambar Martabak
};

// Data mengambil link dinamis dari objek MY_IMAGES di atas
const RECOMMENDATIONS = [
  { id: 'r1', name: 'Telur Kecap', desc: 'Kelezatan yang bikin balik lagi.', image: MY_IMAGES.resep1 },
  { id: 'r2', name: 'Sosi Telur Ala Anak Kos', desc: 'Nikmat menggugah selera.', image: MY_IMAGES.resep2 },
  { id: 'r3', name: 'Tahu Crispy', desc: 'Kriuk di Luar, Lumer di Lidah.', image: MY_IMAGES.resep3 },
  { id: 'r4', name: 'Udang Goreng', desc: 'Garing di luar, lembut di dalam.', image: MY_IMAGES.resep4 },
];

const RECENT_RECIPES = [
  { id: '1', name: 'Nasi Goreng Telur Orak Arik', image: MY_IMAGES.grid1 },
  { id: '2', name: 'Tumis Kangkung', image: MY_IMAGES.grid2 },
  { id: '3', name: 'Tempe Goreng Kriuk', image: MY_IMAGES.grid3 },
  { id: '4', name: 'Martabak Mie Telor', image: MY_IMAGES.grid4 },
];

export default function HomeScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ 'Langar-Regular': Langar_400Regular });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          
          {/* HEADER */}
          <View style={styles.headerHalo}>
            <View style={styles.headerTextCol}>
               <View style={styles.haloRow}>
                  <Image source={{ uri: MY_IMAGES.chefIcon }} style={styles.chefHat} />
                  <Text style={styles.haloTitle}>Halo,</Text>
               </View>
               <Text style={styles.haloSubTitle}>Mau masak apa hari ini?</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <View style={styles.profileContainer}>
                <Image source={{ uri: MY_IMAGES.profile }} style={styles.profilePic} />
                <View style={styles.editBadge}><Ionicons name="pencil" size={8} color="white" /></View>
              </View>
            </TouchableOpacity>
          </View>

          {/* SECTION: REKOMENDASI (HORIZONTAL) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rekomendasi buat kamu hari ini</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.horizontalScroll}
          >
            {RECOMMENDATIONS.map((item) => (
              <TouchableOpacity key={item.id} style={styles.bannerCard} activeOpacity={0.9} onPress={() => router.push("/detail_resep")}>
                <View style={styles.bannerTextContent}>
                  <Text style={styles.bannerFoodName}>{item.name}</Text>
                  <Text style={styles.bannerFoodDesc} numberOfLines={2}>{item.desc}</Text>
                  <View style={styles.btnLihatResepSmall}>
                    <Text style={styles.btnResepText}>Lihat Resep</Text>
                  </View>
                </View>
                <Image source={{ uri: item.image }} style={styles.bannerImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* SECTION: RESEP DILIHAT (GRID VERTICAL KINI DENGAN GAMBAR NYATA) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Resep Yang Sudah di Lihat</Text>
          </View>

          <View style={styles.gridContainer}>
            {RECENT_RECIPES.map((item) => (
              <TouchableOpacity key={item.id} style={styles.gridCard} onPress={() => router.push("/detail_resep")}>
                {/* Gambar diletakkan di luar overlay teks agar posisinya mutlak di separuh atas card cokelat */}
                <Image source={{ uri: item.image }} style={styles.gridImage} />
                <View style={styles.gridOverlay}>
                  <Text style={styles.gridFoodName} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.btnLihatResepGrid}>
                     <Text style={styles.btnResepTextSmall}>Lihat Resep</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>

      <CustomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  
  // Header Style
  headerHalo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  headerTextCol: { flex: 1 },
  haloRow: { flexDirection: 'row', alignItems: 'center' },
  chefHat: { width: 35, height: 35, marginRight: 8 },
  haloTitle: { fontSize: 28, fontFamily: 'Langar-Regular', color: '#9E5F3B' },
  haloSubTitle: { fontSize: 16, color: '#9E5F3B', marginTop: -5, opacity: 0.6 },
  profileContainer: { position: 'relative' },
  profilePic: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#9E5F3B' },
  editBadge: { position: 'absolute', right: 0, bottom: 0, backgroundColor: '#5b2f20', borderRadius: 10, padding: 3 },

  // Section Title Style
  sectionHeader: { paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#9E5F3B', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },

  // Rekomendasi Horizontal
  horizontalScroll: { paddingLeft: 20, paddingRight: 5 },
  bannerCard: { 
    backgroundColor: '#9E5F3B', 
    marginRight: 15, 
    borderRadius: 25, 
    flexDirection: 'row', 
    padding: 15, 
    alignItems: 'center', 
    width: width * 0.82, 
    height: 150 
  },
  bannerTextContent: { flex: 1, paddingRight: 10 },
  bannerFoodName: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  bannerFoodDesc: { color: 'white', fontSize: 12, marginVertical: 6, opacity: 0.9 },
  bannerImage: { width: 100, height: 100, borderRadius: 18, resizeMode: 'cover' },
  btnLihatResepSmall: { backgroundColor: 'rgba(255,255,255,0.25)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, alignSelf: 'flex-start' },
  btnResepText: { color: 'white', fontSize: 11, fontWeight: 'bold' },

  // Grid Style (Perbaikan struktur tata letak gambar & container)
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  gridCard: { 
    width: '47%', 
    height: 250, // Ditinggikan sedikit agar teks resep panjang tidak menumpuk tombol
    backgroundColor: '#9E5F3B', 
    borderRadius: 25, 
    marginBottom: 15, 
    overflow: 'hidden' 
  },
  gridImage: { 
    width: '100%', 
    height: '52%', // Rasio proporsional agar memotong sudut atas dengan rapi sesuai gambar asli
    resizeMode: 'cover' 
  },
  gridOverlay: { 
    padding: 12, 
    flex: 1, 
    justifyContent: 'space-between' 
  },
  gridFoodName: { color: 'white', fontSize: 14, fontWeight: 'bold', lineHeight: 18 },
  btnLihatResepGrid: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, alignSelf: 'flex-start' },
  btnResepTextSmall: { color: 'white', fontSize: 10, fontWeight: 'bold' },
});