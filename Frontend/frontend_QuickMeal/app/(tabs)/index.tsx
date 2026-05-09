import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// --- IMPORT FONT LANGAR ---
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';

interface FoodItem {
  id: string;
  name: string;
  rating: string;
  desc: string;
  imageUri: string;
}

const POPULAR_FOOD: FoodItem[] = [
  { id: '1', name: 'Ayam Goreng', rating: '4.9', desc: 'Kelezatan bumbu rempah yang meresap hingga ke tulang.', imageUri: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=500&auto=format&fit=crop' },
  { id: '2', name: 'Ayam Bakar', rating: '4.8', desc: 'Sentuhan kecap manis dan aroma bakaran yang menggoda.', imageUri: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=500&auto=format&fit=crop' },
  { id: '3', name: 'Nasi Goreng', rating: '4.9', desc: 'Nasi goreng spesial dengan topping telur dan acar segar.', imageUri: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=500&auto=format&fit=crop' },
  { id: '4', name: 'Nasi Kuning', rating: '4.7', desc: 'Gurihnya santan dipadu dengan lauk lengkap khas nusantara.', imageUri: 'https://i.pinimg.com/736x/15/67/4c/15674cf0afcc0d0aa09b01840eec90af.jpg' },
  { id: '5', name: 'Sate Ayam', rating: '4.9', desc: 'Potongan daging empuk dengan siraman saus kacang kental.', imageUri: 'https://i.pinimg.com/736x/a6/8e/c5/a68ec592ddcfad79a8480821a5ab6320.jpg' },
];

export default function HomeScreen() {
  const router = useRouter();

  // --- MEMUAT FONT ---
  const [fontsLoaded] = useFonts({
    'Langar-Regular': Langar_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const renderFoodCard = (item: FoodItem) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.card} 
      activeOpacity={0.9}
      // Tambahan: Klik area kartu juga bisa masuk ke detail
      onPress={() => router.push({
        pathname: "/detail_order",
        params: { name: item.name, rating: item.rating, image: item.imageUri }
      })}
    >
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.foodName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
          <Text style={styles.foodDesc} numberOfLines={2}>{item.desc}</Text>
          
          {/* PERUBAHAN DI SINI: Navigasi saat klik Lihat Detail */}
          <TouchableOpacity 
            onPress={() => router.push({
              pathname: "/detail_order",
              params: { name: item.name, rating: item.rating, image: item.imageUri }
            })}
          >
            <Text style={styles.detailText}>Lihat Detail</Text>
          </TouchableOpacity>
        </View>
        <Image source={{ uri: item.imageUri }} style={styles.foodImage} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerBar}>
          <Text style={styles.logoText}>QuickMeal</Text>
          
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={() => router.push("/profile" as any)}
          >
            <Image 
              source={{ uri: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg' }} 
              style={styles.profilePic} 
            />
            <View style={styles.editIconBadge}>
               <Ionicons name="pencil" size={8} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://img.freepik.com/free-photo/top-view-circular-food-frame_23-2148723447.jpg' }} 
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Makanan Populer</Text>
        </View>

        <View style={styles.listContainer}>
          {POPULAR_FOOD.map((item) => renderFoodCard(item))}
        </View>
        
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoText: { 
    fontSize: 28, 
    color: '#9E5F3B', 
    fontFamily: 'Langar-Regular', 
  },
  profileButton: { position: 'relative' },
  profilePic: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#5b2f20' 
  },
  editIconBadge: { 
    position: 'absolute', 
    right: -2, 
    bottom: -2, 
    backgroundColor: '#5b2f20', 
    borderRadius: 10, 
    padding: 2 
  },
  bannerContainer: { width: '100%', height: 180 },
  bannerImage: { width: '100%', height: '100%' },
  sectionTitleContainer: { paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#9E5F3B', 
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' 
  },
  listContainer: { paddingHorizontal: 20 },
  card: {
    backgroundColor: '#9E5F3B',
    borderRadius: 25,
    marginBottom: 15,
    padding: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  textContainer: { flex: 1, paddingRight: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  foodName: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: 'white', fontSize: 14, marginLeft: 4, fontWeight: '600' },
  foodDesc: { color: 'white', fontSize: 13, marginBottom: 10, opacity: 0.9, lineHeight: 18 },
  detailText: { color: 'white', fontSize: 13, textDecorationLine: 'underline', fontWeight: '500' },
  foodImage: { width: 90, height: 90, borderRadius: 15, backgroundColor: '#eee' },
});