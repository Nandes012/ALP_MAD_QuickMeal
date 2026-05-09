import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image } from 'react-native';

export default function FoodRecScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground 

        source={require('../../assets/images/kue.png')}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Pilih kondisi</Text>
            <Text style={styles.subtitle}>
              kami butuh tahu kondisi kamu untuk memberikan rekomendasi terbaik
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.mainButton}>
              <Text style={styles.buttonText}>Resep</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mainButton}>
              <Text style={styles.buttonText}>Order</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8D5B3E',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#8D5B3E',
    textAlign: 'center',
    lineHeight: 15,
  },
  buttonGroup: {
    width: '80%',
    alignItems: 'center',
  },
  mainButton: {
    backgroundColor: '#9E5F3B',
    width: '85%',
    paddingVertical: 13,
    borderRadius: 30,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
});