import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Platform } from 'react-native'; 
import { useRouter } from 'expo-router';

export default function FoodRecScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/images/kue.png')} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.textContainer}>
            <Text style={styles.subtitle}>
              kami butuh tahu kondisi kamu untuk memberikan rekomendasi terbaik
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            {/* Tombol Resep Dibuat Menjadi Pilihan Tunggal Utama */}
            <TouchableOpacity 
              style={styles.mainButton} 
              onPress={() => router.push('/from_resep')}
            >
              <Text style={styles.buttonText}>Resep</Text>
            </TouchableOpacity>

            {/* Tombol Order Sudah Dihapus Total dari Sini */}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 248, 239, 0.3)', // Overlay agar teks kontras
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#8D5B3E',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', 
  },
  subtitle: {
    fontSize: 14,
    color: '#8D5B3E',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonGroup: {
    width: '85%',
    alignItems: 'center',
  },
  mainButton: {
    backgroundColor: '#9E5F3B',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3, // Shadow untuk Android
    shadowColor: '#000', // Shadow untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});