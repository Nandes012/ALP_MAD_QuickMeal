import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "@/components/ui/styles";
import { useRecipeView } from "@/hooks/useRecipeView";

export default function FoodCard({ item, onPress }: any) {
  const imgSource = typeof item.image === "string" ? { uri: item.image } : item.image;
  const { saveRecipeView, saving } = useRecipeView();

  const handleDetailPress = async () => {
    const success = await saveRecipeView(item.id);
    if (success) {
      onPress?.(item);
    }
  };

  return (
    <TouchableOpacity style={styles.wrapper} onPress={handleDetailPress} activeOpacity={0.9} disabled={saving}>
      <View style={styles.content}>
        <View style={styles.left}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.sub}>{item.subtitle}</Text>
          <TouchableOpacity onPress={handleDetailPress} disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.detail}>Lihat Detail</Text>
            )}
          </TouchableOpacity>
        </View>

        <Image source={imgSource} style={styles.image} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
    width: "100%",
  },
  content: {
    backgroundColor: colors.button,
    padding: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  sub: {
    color: "#fff",
    opacity: 0.9,
    marginBottom: 8,
  },
  detail: {
    color: "#fff",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
});
