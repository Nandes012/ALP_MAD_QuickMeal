import React from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

const SAMPLE_ITEMS = [
  { id: '1', title: 'Nasi Goreng Spesial', subtitle: 'Rp25.000' },
  { id: '2', title: 'Ayam Bakar', subtitle: 'Rp30.000' },
  { id: '3', title: 'Mie Goreng', subtitle: 'Rp20.000' },
  { id: '4', title: 'Soto Ayam', subtitle: 'Rp22.000' },
];

function Item({ title, subtitle }: any) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Text style={styles.header}>Menu Hari Ini</Text>
      <FlatList
        data={SAMPLE_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item title={item.title} subtitle={item.subtitle} />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    padding: 16,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  item: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#f6f6f6',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    marginTop: 6,
    color: '#666',
  },
});