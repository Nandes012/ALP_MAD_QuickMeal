import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/components/ui/styles";

export default function BottomNav({ items = ["Home", "Get Food Rec", "List"] }: any) {
  return (
    <View style={styles.container}>
      {items.map((t: string) => (
        <Text key={t} style={styles.text}>{t}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", left: 0, right: 0, bottom: 0, height: 64, backgroundColor: colors.button, flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  text: { color: "#fff", fontWeight: "600" },
});
