import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "@/components/ui/styles";

export default function HeaderBar({ title = "QuickMeal", avatar }: any) {
  const avatarSource = typeof avatar === "string" ? { uri: avatar } : avatar ?? require("@/assets/images/icon.png");

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Image source={avatarSource} style={styles.avatar} />
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
  title: { color: colors.primary, fontSize: 20, fontWeight: "700" },
  avatar: { width: 36, height: 36, borderRadius: 18 },
});
