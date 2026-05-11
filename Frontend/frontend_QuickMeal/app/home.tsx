import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import HeaderBar from "../components/home/HeaderBar";
import Banner from "../components/home/Banner";
import FoodList from "../components/home/FoodList";
import FoodCard from "../components/ui/FoodCard";
import { colors } from "../components/ui/styles";

// API Base URL - update this to match your backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPopularRecipes();
  }, []);

  const fetchPopularRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/recipes/popular`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch recipes");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Error fetching popular recipes:", err);
      // Show mock data as fallback
      setData([
        { id: "1", title: "Ayam Goreng", subtitle: "Kelezatan yang bikin balik lagi.", image: "https://i.pinimg.com/736x/22/bc/ba/22bcba3a598d866b204acd2031177c62.jpg" },
        { id: "2", title: "Ayam Bakar", subtitle: "Sekali coba, langsung jatuh cinta.", image: "https://i.pinimg.com/736x/1a/9b/6e/1a9b6ed12a4d877dbf69f7a1cf93e1c2.jpg" },
        { id: "3", title: "Nasi Goreng", subtitle: "Santapan yang selalu dirindukan.", image: "https://i.pinimg.com/1200x/d3/7b/f1/d37bf17c96e03b533f0f4b1c9b130011.jpg" },
      ]);
    } finally {
      setLoading(false);
    }
  };

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

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Memuat resep populer...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Tidak dapat memuat data. Menampilkan data default.</Text>
            </View>
          ) : null}

          <FlatList data={data} renderItem={renderItem} keyExtractor={(i) => i.id} style={{ width: "100%" }} />
        </View>

        {/* add spacing so content can scroll above bottom nav */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* BottomNav removed — use Tabs layout's tab bar to avoid duplicate nav */}
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
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: colors.primary,
    },
    errorContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: "#FFE5E5",
        borderRadius: 8,
        marginBottom: 15,
    },
    errorText: {
        fontSize: 12,
        color: "#C41E3A",
        textAlign: "center",
    },
});

