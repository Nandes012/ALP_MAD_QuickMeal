import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/components/ui/styles";

export default function HeaderBar({ title = "QuickMeal", avatar }: any) {
  const router = useRouter();
  const avatarSource = typeof avatar === "string" ? { uri: avatar } : avatar ?? require("@/assets/images/icon.png");

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity onPress={() => router.push("/profile") }>
        <Image source={require('@/assets/images/profil.jpg')} style={styles.avatar} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
    headerTitle: {
        color: colors.primary,
        fontSize: 20, fontWeight: "700"
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18
    },
});
