import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import CustomNavbar from '../components/CustomNavbar';

// DATABASE LOKAL RESEP
const RECIPE_DETAILS_DATABASE: Record<string, { bahan: string[]; alat: string[]; langkah: string[] }> = {
  'Nasi Goreng Telur Orak Arik': {
    bahan: ['2 piring nasi putih dingin', '2 butir telur ayam (kocok)', '3 siung bawang putih', '2 sdm kecap manis', 'Garam & merica secukupnya'],
    alat: ['Wajan', 'Spatula', 'Pisau & Talenan'],
    langkah: ['Tumis bawang putih cincang hingga wangi.', 'Masukkan telur kocok, buat menjadi orak-arik.', 'Masukkan nasi putih, beri kecap manis, garam, dan merica.', 'Aduk sampai rata dan bumbu meresap sempurna.']
  },
  'Nasi Goreng Kecap Telur': {
    bahan: ['2 piring nasi putih', '1 butir telur', '3 siung bawang merah', '2 siung bawang putih', '3 sdm kecap manis', 'Cabai sesuai selera'],
    alat: ['Wajan', 'Spatula'],
    langkah: ['Haluskan atau iris tipis bawang merah, bawang putih, dan cabai.', 'Tumis bumbu iris hingga harum, lalu sisihkan di pinggir wajan.', 'Masukkan telur, buat orak-arik hingga matang.', 'Campurkan nasi, tuang kecap manis, garam, dan kaldu bubuk. Aduk rata di atas api besar.']
  },
  'Indomie Goreng Nugget': {
    bahan: ['1 bungkus Indomie Goreng', '3 buah nugget ayam', '1 butir telur (opsional)', 'Air untuk merebus'],
    alat: ['Panci kecil', 'Wajan penggorengan', 'Piring saji'],
    langkah: ['Goreng nugget ayam hingga berwarna cokelat keemasan, tiriskan lalu potong sesuai selera.', 'Rebus mi instan dalam air mendidih selama 3 menit.', 'Selagi merebus, tuang bumbu mi ke atas piring.', 'Tiriskan mi, campur rata dengan bumbu, lalu sajikan dengan topping nugget goreng di atasnya.']
  },
  'Ayam Goreng Kecap': {
    bahan: ['500g daging ayam (potong-potong)', '4 siung bawang putih', '1 buah bawang bombay', '5 sdm kecap manis', '1 sdm saus tiram', 'Minyak goreng'],
    alat: ['Wajan', 'Spatula', 'Ulekan / Blender bumbu'],
    langkah: ['Goreng ayam setengah matang terlebih dahulu, tiriskan.', 'Tumis bawang putih cincang dan irisan bawang bombay sampai wangi.', 'Masukkan ayam, tambahkan kecap manis, saus tiram, garam, merica, dan sedikit air.', 'Masak hingga bumbu meresap dan kuah mengental pecah minyak.']
  },
  'Sayur Bening': {
    bahan: ['1 ikat bayam segar', '1 buah jagung manis (potong dadu)', '3 siung bawang merah (iris)', '2 ruas kunci (memarkan)', 'Garam & gula secukupnya'],
    alat: ['Panci sup', 'Sendok sayur'],
    langkah: ['Didihkan air di dalam panci bersama irisan bawang merah and temu kunci.', 'Masukkan potongan jagung manis, masak hingga jagung menjadi empuk.', 'Masukkan daun bayam, tambahkan garam dan sedikit gula.', 'Masak sebentar sekitar 2-3 menit agar bayam tidak terlalu lembek, angkat.']
  },
  'Ikan Goreng Tepung': {
    bahan: ['300g fillet ikan (kakap/dori)', '1 bungkus tepung bumbu serbaguna', '1 butir telur', 'Jeruk nipis untuk marinasi'],
    alat: ['Wajan deep fry', 'Mangkuk adonan', 'Capitan makanan'],
    langkah: ['Potong fillet ikan, lumuri dengan perasan air jeruk nipis dan garam, diamkan 10 menit.', 'Celupkan ikan ke dalam kocokan telur.', 'Balurkan ikan ke tepung bumbu serbaguna kering sambil ditekan-tekan.', 'Goreng dalam minyak banyak yang sudah panas hingga crispy garing keemasan.']
  },
  'Telur Kecap Special': {
    bahan: ['4 butir telur ayam', '3 siung bawang merah', '2 siung bawang putih', '2 buah cabai merah iris', '4 sdm kecap manis', '50ml air matang'],
    alat: ['Wajan anti lengket', 'Spatula'],
    langkah: ['Goreng telur secara ceplok mata sapi, sisihkan.', 'Tumis bawang merah, bawang putih, dan cabai sampai matang layu.', 'Tuangkan air, kecap manis, garam, dan merica.', 'Masukkan telur ceplok, balik perlahan agar bumbu kecap meresap sempurna ke dalam telur.']
  },
  'Tumis Kangkung Belacan': {
    bahan: ['1 ikat kangkung', '1 sdt terasi/belacan bakar', '3 siung bawang merah', '2 siung bawang putih', '5 buah cabai rawit'],
    alat: ['Wajan', 'Spatula'],
    langkah: ['Ulek kasar bawang merah, bawang putih, cabai, dan terasi bakar.', 'Tumis bumbu ulek tersebut sampai baunya harum matang.', 'Masukkan kangkung yang sudah dipetiki dan dicuci bersih.', 'Beri sedikit air, garam, dan gula. Masak dengan api besar secara cepat agar kangkung tetap renyah.']
  },
  'Martabak Mie Telor': {
    bahan: ['1 bungkus mi instan goreng', '2 butir telur ayam', '1 batang daun bawang (iris)'],
    alat: ['Panci kecil', 'Wajan datar'],
    langkah: ['Rebus mi instan hingga matang, tiriskan.', 'Campurkan mi dengan bumbunya, telur, dan irisan daun bawang dalam mangkuk.', 'Goreng di wajan datar dengan sedikit minyak hingga kedua sisi matang kecokelatan.']
  },
  'Tahu Cabe Garam': {
    bahan: ['1 kotak tahu putih besar', '3 sdm tepung maizena', '5 siung bawang putih (cincang halus)', '3 buah cabai rawit (iris)', '1 batang daun bawang'],
    alat: ['Wajan', 'Saringan', 'Pisau'],
    langkah: ['Potong tahu bentuk dadu kecil, balurkan dengan tepung maizena, lalu goreng hingga berkulit crispy.', 'Goreng bawang putih cincang hingga kuning keemasan, tiriskan segera agar tidak gosong.', 'Tumis irisan cabai dan daun bawang dengan sedikit minyak.', 'Masukkan tahu crispy and bawang putih goreng, taburi garam dan merica bubuk, aduk cepat hingga rata.']
  },
  'Telur Kecap': {
    bahan: ['3 butir telur ayam', '3 siung bawang merah', '2 siung bawang putih', '3 sdm kecap manis', '50ml air matang'],
    alat: ['Wajan anti lengket', 'Spatula'],
    langkah: ['Goreng telur secara ceplok satu per satu, tiriskan.', 'Tumis bawang merah dan bawang putih sampai layu.', 'Masukkan air, kecap manis, garam, dan merica.', 'Masukkan telur ceplok, masak hingga kuah kecap menyusut dan meresap.']
  },
  'Sosis Telur Ala Anak Kos': {
    bahan: ['2 buah sosis sapi/ayam (potong)', '1 butir telur ayam', '1 batang daun bawang', 'Garam & penyedap rasa'],
    alat: ['Wajan kecil', 'Garpu / pengocok telur'],
    langkah: ['Kocok lepas telur bersama daun bawang, garam, dan penyedap.', 'Goreng potongan sosis sebentar di wajan.', 'Tuangkan kocokan telur di atas sosis, masak dadar bolak-balik hingga matang.']
  },
  'Tahu Crispy': {
    bahan: ['5 buah tahu putih (potong kotak)', '5 sdm tepung terigu', '1 sdm tepung maizena', '1 sdt baking powder', 'Air secukupnya'],
    alat: ['Wajan dalam (Deep fry)', 'Saringan gorengan'],
    langkah: ['Campurkan tepung terigu, maizena, baking powder, garam, dan air hingga encer.', 'Masukkan tahu, rendam sebentar.', 'Goreng tahu dalam minyak banyak yang sangat panas.', 'Tuang sisa adonan tepung encer secara bertahap untuk membuat kremesan renyah.']
  },
  'Udang Goreng': {
    bahan: ['250g udang segar (kupas kulit)', '1 bungkus tepung bumbu instan', '1 butir telur (kocok)', 'Minyak untuk menggoreng'],
    alat: ['Wajan', 'Penjepit makanan'],
    langkah: ['Celupkan udang ke dalam kocokan telur.', 'Balurkan ke tepung bumbu instan sambil dicubit ringan agar keriting.', 'Goreng udang dalam minyak panas hingga berwarna kuning keemasan.']
  },
  'Tumis Kangkung': {
    bahan: ['1 ikat kangkung segar', '3 siung bawang merah', '2 siung bawang putih', '2 buah cabai merah', '1 sdm saus tiram'],
    alat: ['Wajan', 'Spatula'],
    langkah: ['Tumis bawang merah, bawang putih, dan cabai sampai matang harum.', 'Masukkan kangkung yang sudah dicuci bersih.', 'Tambahkan saus tiram, sedikit garam, dan gula.', 'Masak dengan api besar sebentar saja agar kangkung tetap hijau segar.']
  },
  'Tempe Goreng Kriuk': {
    bahan: ['1 papan tempe (iris tipis)', '4 sdm tepung beras', '2 sdm tepung terigu', '1 sdt ketumbar bubuk', 'Air secukupnya'],
    alat: ['Wajan', 'Spatula penggorengan'],
    langkah: ['Buat adonan pelapis dari tepung beras, terigu, ketumbar, garam, dan air.', 'Celupkan tiap irisan tempe ke dalam adonan tepung.', 'Goreng dalam minyak panas sampai tempe berwarna cokelat keemasan dan garing.']
  },
};

export default function DetailResepScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Bersihkan nama resep dari spasi ganda atau spasi di awal/akhir kata akibat perpindahan parameter
  const recipeName = params.name ? String(params.name).replace(/\s+/g, ' ').trim() : 'Nasi Goreng Telur Orak Arik';
  const recipeImage = params.imageUrl ? String(params.imageUrl) : 'https://i.pinimg.com/1200x/9a/f6/9f/9af69fd227aa680e75b2bdd6404162c8.jpg';

  // Mencocokkan data database lokal secara aman
  const currentRecipeData = RECIPE_DETAILS_DATABASE[recipeName] || RECIPE_DETAILS_DATABASE['Nasi Goreng Telur Orak Arik'];

  const [showBahan, setShowBahan] = useState(true);
  const [showAlat, setShowAlat] = useState(false);
  const [showLangkah, setShowLangkah] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8EF" />
      
      {/* HEADER NAVBAR */}
      <SafeAreaView edges={['top']} style={styles.appBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#8D5B3E" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Detail Resep Makanan</Text>
        <View style={{ width: 40 }} /> 
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* BANNER GAMBAR DINAMIS */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipeImage }} style={styles.mainImage} resizeMode="cover" />
          <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
            <Ionicons name="play" size={36} color="#9E5F3B" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* JUDUL RESEP DINAMIS */}
        <Text style={styles.recipeTitle}>{recipeName}</Text>

        {/* ACCOMODATION SECTION: BAHAN-BAHAN */}
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.accordionHeader} 
            onPress={() => setShowBahan(!showBahan)}
            activeOpacity={0.7}
          >
            <Text style={styles.accordionTitle}>Bahan-bahan ({currentRecipeData.bahan.length} item)</Text>
            <Ionicons name={showBahan ? "chevron-up" : "chevron-down"} size={20} color="black" />
          </TouchableOpacity>
          
          {showBahan && (
            <View style={styles.accordionBody}>
              {currentRecipeData.bahan.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ACCOMODATION SECTION: ALAT MASAK */}
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.accordionHeader} 
            onPress={() => setShowAlat(!showAlat)}
            activeOpacity={0.7}
          >
            <Text style={styles.accordionTitle}>Alat Masak</Text>
            <Ionicons name={showAlat ? "chevron-up" : "chevron-down"} size={20} color="black" />
          </TouchableOpacity>
          
          {showAlat && (
            <View style={styles.accordionBody}>
              {currentRecipeData.alat.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ACCOMODATION SECTION: LANGKAH MEMASAK */}
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.accordionHeader} 
            onPress={() => setShowLangkah(!showLangkah)}
            activeOpacity={0.7}
          >
            <Text style={styles.accordionTitle}>Langkah Memasak</Text>
            <Ionicons name={showLangkah ? "chevron-up" : "chevron-down"} size={20} color="black" />
          </TouchableOpacity>
          
          {showLangkah && (
            <View style={[styles.accordionBody, { gap: 12 }]}>
              {currentRecipeData.langkah.map((item, index) => (
                <View key={index} style={styles.stepRow}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNumberText}>{index + 1}.</Text>
                  </View>
                  <View style={styles.stepContentBox}>
                    <Text style={styles.stepText}>{item}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>

      <CustomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  appBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#FFF8EF' },
  backButton: { padding: 8 },
  appBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#8D5B3E', textAlign: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 },
  imageContainer: { width: '100%', height: 190, borderRadius: 15, overflow: 'hidden', position: 'relative', backgroundColor: '#EAEAEA' },
  mainImage: { width: '100%', height: '100%' },
  playButton: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -27.5 }, { translateY: -27.5 }], backgroundColor: 'rgba(255, 255, 255, 0.9)', width: 55, height: 55, borderRadius: 27.5, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  recipeTitle: { fontSize: 18, fontWeight: '700', color: '#333333', marginTop: 15, marginBottom: 20, paddingHorizontal: 2, fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia' },
  cardContainer: { backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: '#EFE3D5', marginBottom: 15, overflow: 'hidden', elevation: 1 },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18, backgroundColor: 'white' },
  accordionTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  accordionBody: { paddingHorizontal: 18, paddingBottom: 15, borderTopWidth: 1, borderColor: '#F7EDE2', paddingTop: 12 },
  bulletItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  bulletPoint: { fontSize: 15, color: '#8D5B3E', marginRight: 8, lineHeight: 18 },
  bulletText: { fontSize: 13, color: '#444444', flex: 1, lineHeight: 18 },
  stepRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  stepNumberBadge: { backgroundColor: '#9E5F3B', width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  stepNumberText: { color: 'white', fontSize: 13, fontWeight: 'bold' },
  stepContentBox: { flex: 1, backgroundColor: '#E8EDF2', borderRadius: 15, paddingVertical: 12, paddingHorizontal: 15 },
  stepText: { fontSize: 12, color: '#2C3E50', fontWeight: '500', lineHeight: 16 },
});