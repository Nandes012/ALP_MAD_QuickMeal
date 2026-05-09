import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// --- IMPORT FONT LANGAR ---
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';

// 1. Perbaikan Interface (Samakan nama property dengan data)
interface FoodItem {
  id: string;
  name: string;
  price: string;
  imageUri: string; // Gunakan imageUri secara konsisten
  rating?: string;
  ingredients?: string[];
  time?: string; // Tambahkan opsional time untuk detail resep
}

// 2. Data Dummy (Pastikan property name sesuai interface)
const MASAK_DATA: FoodItem[] = [
  { 
    id: '1', 
    name: 'Ayam Bakar', 
    price: '25.000', 
    time: '45 Menit',
    imageUri: 'https://i.pinimg.com/1200x/b5/0e/9b/b50e9babe23daade5751dcd7423f91ca.jpg',
    ingredients: ['1/2 kg Ayam', 'Kecap Manis', 'Bawang Merah & Putih', 'Lengkuas', 'Serai', 'Garam & Gula']
  },
  { 
    id: '2', 
    name: 'Ayam Goreng', 
    price: '28.000', 
    time: '30 Menit',
    imageUri: 'https://i.pinimg.com/736x/02/06/01/020601302dedab7013734a652062966d.jpg',
    ingredients: ['1/2 kg Ayam', 'Tepung Bumbu', 'Bawang Putih', 'Ketumbar', 'Kunyit', 'Minyak Goreng']
  },
  { 
    id: '3', 
    name: 'Burger Spaicy', 
    price: '21.000', 
    time: '15 Menit',
    imageUri: 'https://i.pinimg.com/736x/38/bb/96/38bb963a9c08bc4b4894b98b9d5ff32c.jpg',
    ingredients: ['Roti Burger', 'Daging Sapi (Patty)', 'Saus Sambal Ekstra Hot', 'Selada', 'Keju Slice', 'Mayonaise']
  },
  { 
    id: '4', 
    name: 'Spaghetti', 
    price: '30.000', 
    time: '20 Menit',
    imageUri: 'https://i.pinimg.com/1200x/68/4c/a1/684ca1498560c84097bebc3805da551b.jpg',
    ingredients: ['Pasta Spaghetti', 'Saus Bolognese', 'Daging Cincang', 'Keju Parmesan', 'Oregano', 'Minyak Zaitun']
  },
];

const ORDER_DATA: FoodItem[] = [
  { id: 'o1', name: 'Ayam Bakar', price: '25.000', imageUri: 'https://i.pinimg.com/736x/11/a0/8f/11a08f16b0beaa1eefdb30583f1da8f6.jpg', rating: '4.9' },
  { id: 'o2', name: 'Ayam Goreng', price: '28.000', imageUri: 'https://i.pinimg.com/736x/02/06/01/020601302dedab7013734a652062966d.jpg', rating: '4.9' },
  { id: 'o3', name: 'Burger Spaicy', price: '21.000', imageUri: 'https://i.pinimg.com/736x/38/bb/96/38bb963a9c08bc4b4894b98b9d5ff32c.jpg', rating: '4.9' },
  { id: 'o4', name: 'Spaghetti', price: '30.000', imageUri: 'https://i.pinimg.com/1200x/68/4c/a1/684ca1498560c84097bebc3805da551b.jpg', rating: '4.9' },
];

export default function ListScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Masak' | 'Order'>('Masak');

  const [fontsLoaded] = useFonts({
    'Langar-Regular': Langar_400Regular,
  });

  if (!fontsLoaded) return null;

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.foodName}>{item.name}</Text>
          {activeTab === 'Order' && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}
        </View>
        <Text style={styles.foodPrice}>RP. {item.price}</Text>
        
        <TouchableOpacity 
          style={styles.detailButton}
          onPress={() => {
            const path = activeTab === 'Masak' ? '/detail_resep' : '/detail_order';
            const ingredientsString = item.ingredients ? JSON.stringify(item.ingredients) : JSON.stringify([]);

            router.push({ 
                pathname: path as any, 
                params: { 
                  name: item.name, 
                  imageUrl: encodeURIComponent(item.imageUri), // Encode agar URL aman dikirim
                  price: item.price,
                  time: item.time || "25 Menit",
                  ingredients: ingredientsString 
                } 
            });
          }}
        >
          <Text style={styles.detailButtonText}>
            {activeTab === 'Masak' ? 'Resep' : 'Order Detail'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* 3. Gunakan item.imageUri sesuai interface */}
      <Image source={{ uri: item.imageUri }} style={styles.foodImage} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.logoText}>QuickMeal</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Image source={{ uri: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg' }} style={styles.profileImage} />
          <View style={styles.editIconBadge}>
             <Ionicons name="pencil" size={8} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'Masak' && styles.activeTab]} 
          onPress={() => setActiveTab('Masak')}
        >
          <Text style={[styles.tabText, activeTab === 'Masak' && styles.activeTabText]}>Masak</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'Order' && styles.activeTab]} 
          onPress={() => setActiveTab('Order')}
        >
          <Text style={[styles.tabText, activeTab === 'Order' && styles.activeTabText]}>Order</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        {activeTab === 'Masak' ? 'Resep Makanan' : 'Order Makanan'}
      </Text>

      <FlatList
        data={activeTab === 'Masak' ? MASAK_DATA : ORDER_DATA}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/" as any)} style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="white" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <View style={styles.navCircleContainer}>
          <TouchableOpacity onPress={() => router.push("/kondisi_order" as any)} style={styles.navCircle}>
            <Ionicons name="search" size={24} color="white" />
            <Text style={styles.navCircleText}>Get Food Rec</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="briefcase" size={24} color="white" />
          <Text style={styles.navText}>List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ... Styles tetap sama ...
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF8EF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
    logoText: { fontSize: 28, color: '#9E5F3B', fontFamily: 'Langar-Regular' },
    profileButton: { position: 'relative' },
    profileImage: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#5b2f20' },
    editIconBadge: { position: 'absolute', right: -2, bottom: -2, backgroundColor: '#5b2f20', borderRadius: 10, padding: 2 },
    tabContainer: { flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 20, borderRadius: 25, padding: 5, marginTop: 10, elevation: 2 },
    tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
    activeTab: { backgroundColor: '#9E5F3B' },
    tabText: { fontSize: 18, color: '#333', fontWeight: '500' },
    activeTabText: { color: 'white' },
    sectionTitle: { textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#8D5B3E', marginTop: 20, marginBottom: 10 },
    listContent: { paddingHorizontal: 20, paddingBottom: 100 },
    card: { backgroundColor: '#9E5F3B', borderRadius: 20, flexDirection: 'row', padding: 15, marginBottom: 15, alignItems: 'center' },
    cardInfo: { flex: 1 },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    foodName: { color: 'white', fontSize: 22, fontWeight: 'bold' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    ratingText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
    foodPrice: { color: 'white', fontSize: 14, marginVertical: 5 },
    detailButton: { backgroundColor: 'rgba(255,255,255,0.4)', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 12, alignSelf: 'flex-start' },
    detailButtonText: { color: 'white', fontSize: 12, fontWeight: '600' },
    foodImage: { width: 90, height: 90, borderRadius: 15, marginLeft: 10 },
    bottomNav: { position: 'absolute', bottom: 0, width: '100%', height: 75, backgroundColor: '#8D5B3E', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    navItem: { alignItems: 'center' },
    navText: { color: 'white', fontSize: 10, marginTop: 2 },
    navCircleContainer: { marginTop: -40 },
    navCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#6F4E37', justifyContent: 'center', alignItems: 'center', borderWidth: 5, borderColor: '#FFF8EF' },
    navCircleText: { color: 'white', fontSize: 8, textAlign: 'center', fontWeight: 'bold' }
  });