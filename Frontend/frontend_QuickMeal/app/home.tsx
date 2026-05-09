import React from "react";
import { SafeAreaView, ScrollView, View, Text, Image, FlatList, StyleSheet } from "react-native";
import HeaderBar from "../components/home/HeaderBar";
import Banner from "../components/home/Banner";
import FoodList from "../components/home/FoodList";
// BottomNav removed: tab bar is provided by `app/(tabs)/_layout.tsx` to avoid duplicates
import FoodCard from "../components/ui/FoodCard";
import { colors } from "../components/ui/styles";

const data = [
  { id: "1", title: "Ayam Goreng", subtitle: "Kelezatan yang bikin balik lagi.", image: "https://i.pinimg.com/736x/22/bc/ba/22bcba3a598d866b204acd2031177c62.jpg" },
  { id: "2", title: "Ayam Bakar", subtitle: "Sekali coba, langsung jatuh cinta.", image: "https://i.pinimg.com/736x/1a/9b/6e/1a9b6ed12a4d877dbf69f7a1cf93e1c2.jpg" },
  { id: "3", title: "Nasi Goreng", subtitle: "Santapan yang selalu dirindukan.", image: "https://i.pinimg.com/1200x/d3/7b/f1/d37bf17c96e03b533f0f4b1c9b130011.jpg" },
  { id: "4", title: "Nasi Kuning", subtitle: "Warna & rasa khas Indonesia.", image: "https://i.pinimg.com/736x/19/59/d2/1959d258e6df9c309edf3238151f85fb.jpg" },
  { id: "5", title: "Sate", subtitle: "Potongan daging lezat tusuk demi tusuk.", image: "https://i.pinimg.com/736x/91/4e/fe/914efeca7a7527e28549b2e6cc0e8fe1.jpg" },
  { id: "6", title: "Bakso", subtitle: "Kuah hangat, kenyal, penuh rasa.", image: "https://i.pinimg.com/736x/49/19/c5/4919c5c03ffd9c188ae991ca5a7ea9de.jpg" },
  { id: "7", title: "Mie Ayam", subtitle: "Mie kenyal dengan ayam berbumbu.", image: "https://i.pinimg.com/736x/66/b8/8f/66b88f39805655a875f8cb56e49ab4d4.jpg" },
  { id: "8", title: "Pempek", subtitle: "Kudapan Palembang yang gurih.", image: "https://i.pinimg.com/1200x/d6/41/a0/d641a0baebf71cf94032df80c7ab4ae7.jpg" },
  { id: "9", title: "Rendang", subtitle: "Daging empuk, rempah kaya aroma.", image: "https://i.pinimg.com/736x/e3/24/d3/e324d32512d363c6d65512e44ce2896a.jpg" },
  { id: "10", title: "Gado-Gado", subtitle: "Sayur segar dengan saus kacang.", image: "https://i.pinimg.com/1200x/be/cc/8f/becc8f639992b67d5930e9e07e466aed.jpg" },
  { id: "11", title: "Soto", subtitle: "Kuah bening berisi rempah dan daging.", image: "https://i.pinimg.com/736x/d9/14/ee/d914eedf08d2a7c9e1463b155fd471b0.jpg" },
  { id: "12", title: "Burger", subtitle: "Sensasi Daging Asli, Bikin Nagih.", image: "https://i.pinimg.com/736x/90/fa/94/90fa9415fa688431e05075009f721fcd.jpg" },
];

export default function Home() {
  function renderItem({ item }: any) {
    return <FoodCard item={item} onPress={() => {}} />;
  }

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <HeaderBar />

        <Banner source={require("@/assets/images/logo.jpg")} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Makanan Populer</Text>

          <FlatList data={data} renderItem={renderItem} keyExtractor={(i) => i.id} style={{ width: "100%" }} />
        </View>

        {/* add spacing so content can scroll above bottom nav */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* BottomNav removed — Tabs layout renders the bottom tab bar */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    page: {
        flex: 1, backgroundColor: "#FFF8EF",
        paddingTop: 18,
        alignItems: "center"
    },
    section: {
        width: "100%",
        paddingHorizontal: 18
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.primary,
        marginBottom: 12
    },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 120,
  },
});

