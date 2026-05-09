import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AlatPage() {
  const router = useRouter();
  const { name } = useLocalSearchParams();

  // Daftar alat masak
  const ALAT = ["Wajan", "Spatula", "Pisau", "Talenan", "Piring Saji"];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5b2f20" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alat Masak {name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.infoText}>Peralatan yang harus kamu siapkan:</Text>
          
          {ALAT.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              {/* Lingkaran Checklist */}
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={14} color="white" />
              </View>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Footer spacer */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF8EF' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  backButton: {
    padding: 5
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#5b2f20',
    flex: 1,
    textAlign: 'center'
  },
  content: { 
    padding: 20 
  },
  card: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 20, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: { 
    fontSize: 14, 
    color: '#9E5F3B', 
    marginBottom: 20, 
    fontWeight: '600' 
  },
  itemRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FDF7F2'
  },
  checkCircle: { 
    width: 22, 
    height: 22, 
    borderRadius: 11, 
    backgroundColor: '#9E5F3B', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  itemText: { 
    fontSize: 15, 
    color: '#333',
    fontWeight: '500'
  }
});