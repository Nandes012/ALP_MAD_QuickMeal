import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import FoodCard from "@/components/ui/FoodCard";

export default function FoodList({ data = [], onItemPress }: any) {
  if (!data || data.length === 0) return <View style={styles.empty}><Text>No items</Text></View>;

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <FoodCard item={item} onPress={onItemPress} />}
      keyExtractor={(i) => i.id}
      style={{ width: "100%" }}
    />
  );
}

const styles = StyleSheet.create({
  empty: { padding: 16, alignItems: "center" },
});
