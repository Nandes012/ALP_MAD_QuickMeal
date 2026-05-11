import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// --- DATA INTERFACE ---
interface FoodItem {
  id: string;
  name: string;
  price: string;
  image: string;
  rating?: string;
}

// --- DATA DUMMY ---
const MASAK_DATA: FoodItem[] = [
  { id: '1', name: 'Ayam Bakar', price: '25.000', image: 'https://i.pinimg.com/736x/11/a0/8f/11a08f16b0beaa1eefdb30583f1da8f6.jpg' },
  { id: '2', name: 'Ayam Goreng', price: '28.000', image: 'https://i.pinimg.com/736x/02/06/01/020601302dedab7013734a652062966d.jpg' },
  { id: '3', name: 'Burger Spaicy', price: '21.000', image: 'https://i.pinimg.com/736x/38/bb/96/38bb963a9c08bc4b4894b98b9d5ff32c.jpg' },
  { id: '4', name: 'Spaghetti', price: '30.000', image: 'https://i.pinimg.com/1200x/0b/58/23/0b582305b2368e3f1e4e60a3f90da4b9.jpg' },
];

const ORDER_DATA: FoodItem[] = [
  { id: 'o1', name: 'Ayam Bakar', price: '25.000', image: 'https://i.pinimg.com/736x/11/a0/8f/11a08f16b0beaa1eefdb30583f1da8f6.jpg', rating: '4.9' },
  { id: 'o2', name: 'Ayam Goreng', price: '28.000', image: 'https://i.pinimg.com/736x/02/06/01/020601302dedab7013734a652062966d.jpg', rating: '4.9' },
  { id: 'o3', name: 'Burger Spaicy', price: '21.000', image: 'https://i.pinimg.com/736x/38/bb/96/38bb963a9c08bc4b4894b98b9d5ff32c.jpg', rating: '4.9' },
  { id: 'o4', name: 'Spaghetti', price: '30.000', image: 'https://i.pinimg.com/1200x/0b/58/23/0b582305b2368e3f1e4e60a3f90da4b9.jpg', rating: '4.9' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Masak' | 'Order'>('Masak');

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
            router.push({ 
                pathname: path as any, 
                params: { name: item.name, imageUrl: item.image, price: item.price } 
            });
          }}
        >
          <Text style={styles.detailButtonText}>
            {activeTab === 'Masak' ? 'Resep' : 'Order Detail'}
          </Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: item.image }} style={styles.foodImage} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER SECTION - Link ke Profile Aktif */}
      <View style={styles.header}>
        <Text style={styles.logoText}>QuickMeal</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push("/profile" as any)}
        >
          <Image 
            source={{ uri: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg' }} 
            style={styles.profileImage} 
          />
          <View style={styles.editIconBadge}>
             <Ionicons name="pencil" size={8} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* TAB SWITCHER */}
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

      {/* CONTENT LIST */}
      <FlatList
        data={activeTab === 'Masak' ? MASAK_DATA : ORDER_DATA}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 10 
  },
  logoText: { 
    fontSize: 28, // Ukuran disesuaikan agar font Langar terlihat jelas
    color: '#9E5F3B', 
    fontFamily: 'Langar-Regular', // Menggunakan font yang sudah dimuat
  },
  profileButton: { position: 'relative' },
  profileImage: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#5b2f20' },
  editIconBadge: { 
    position: 'absolute', 
    right: -2, 
    bottom: -2, 
    backgroundColor: '#5b2f20', 
    borderRadius: 10, 
    padding: 2 
  },
  
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    marginHorizontal: 20, 
    borderRadius: 25, 
    padding: 5, 
    marginTop: 10,
    elevation: 2 
  },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
  activeTab: { backgroundColor: '#9E5F3B' },
  tabText: { fontSize: 18, color: '#333', fontWeight: '500' },
  activeTabText: { color: 'white' },
  
  sectionTitle: { 
    textAlign: 'center', 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#8D5B3E', 
    marginTop: 20, 
    marginBottom: 10 
  },
  
  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 100 // Memberi ruang agar item terakhir tidak tertutup Navbar
  },
  card: { 
    backgroundColor: '#9E5F3B', 
    borderRadius: 20, 
    flexDirection: 'row', 
    padding: 15, 
    marginBottom: 15, 
    alignItems: 'center' 
  },
  cardInfo: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  foodName: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  foodPrice: { color: 'white', fontSize: 14, marginVertical: 5 },
  detailButton: { 
    backgroundColor: 'rgba(255,255,255,0.4)', 
    paddingVertical: 5, 
    paddingHorizontal: 15, 
    borderRadius: 12, 
    alignSelf: 'flex-start' 
  },
  detailButtonText: { color: 'white', fontSize: 12, fontWeight: '600' },
  foodImage: { width: 90, height: 90, borderRadius: 15, marginLeft: 10 },
});