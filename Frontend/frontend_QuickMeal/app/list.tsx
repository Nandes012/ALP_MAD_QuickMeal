import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, StatusBar, ActivityIndicator } from 'react-native';
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

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

// Page state for fetched lists
const useFetchList = (activeTab: 'Masak' | 'Order') => {
  const [data, setData] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchRecipes = async () => {
      const res = await fetch(`${API_BASE_URL}/recipes`);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      if (json?.success && Array.isArray(json.data)) {
        return json.data.map((r: any) => ({
          id: String(r.id),
          name: r.title || r.name || 'Resep',
          price: Number(r.totalIngredientPrice || 0).toLocaleString('id-ID'),
          imageUri: r.image || r.imageUrl || 'https://via.placeholder.com/300',
          rating: r.cookingTime ? `${r.cookingTime}m` : undefined,
          ingredients: r.ingredients || [],
          time: r.cookingTime ? `${r.cookingTime} Menit` : undefined,
        }));
      }
      return [];
    };

    const fetchOrders = async () => {
      const res = await fetch(`${API_BASE_URL}/orders`);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      if (json?.success && Array.isArray(json.data)) {
        return json.data.map((o: any) => ({
          id: String(o.id),
          name: o.merchant_name || `Order #${o.id}`,
          price: o.total_price || '0',
          imageUri: o.image || 'https://via.placeholder.com/300',
          rating: '4.9',
        }));
      }
      return [];
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = activeTab === 'Masak' ? await fetchRecipes() : await fetchOrders();
        if (mounted) setData(result);
      } catch (err) {
        console.error('Failed fetching list:', err);
        if (mounted) setData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => { mounted = false; };
  }, [activeTab]);

  return { data, loading };
};

export default function ListScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Masak' | 'Order'>('Masak');
  const { data, loading } = useFetchList(activeTab);

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

  let listContent: React.ReactNode;

  if (loading) {
    listContent = (
      <View style={{ paddingVertical: 24, alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9E5F3B" />
        <Text style={{ marginTop: 10, color: '#8D5B3E' }}>{activeTab === 'Masak' ? 'Memuat resep...' : 'Memuat order...'}</Text>
      </View>
    );
  } else if (data.length === 0) {
    listContent = (
      <View style={{ paddingVertical: 24, alignItems: 'center' }}>
        <Text style={{ color: '#8D5B3E' }}>Belum ada item untuk ditampilkan.</Text>
      </View>
    );
  } else {
    listContent = (
      <FlatList
        data={data}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    );
  }

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

      <View style={styles.listContent}>{listContent}</View>

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