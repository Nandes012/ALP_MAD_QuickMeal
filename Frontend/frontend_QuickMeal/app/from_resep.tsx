import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FromResepScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [bahan, setBahan] = useState(['', '', '']);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else router.push('/hasil_rec_resep');
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/cook.png')} 
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Isi Kondisi Kamu</Text>
            <Text style={styles.headerSubtitle}>kami butuh tahu kondisi kamu untuk memberikan rekomendasi terbaik</Text>
          </View>

          {/* Form Content - MENGGUNAKAN VIEW, BUKAN SCROLLVIEW (Fix Error) */}
          <View style={styles.content}>
            <View style={styles.card}>
              <Text style={styles.stepText}>Pertanyaan {step} dari 3</Text>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
              </View>

              {step === 1 && (
                <View style={styles.stepBody}>
                  <View style={styles.iconCircle}><Ionicons name="time" size={35} color="#9E5F3B" /></View>
                  <Text style={styles.qTitle}>Berapa lama waktu yang kamu punya?</Text>
                  <View style={styles.timeBox}><Text style={styles.timeText}>00:00:00</Text></View>
                </View>
              )}

              {step === 2 && (
                <View style={styles.stepBody}>
                  <View style={styles.iconCircle}><Ionicons name="cash" size={35} color="#9E5F3B" /></View>
                  <Text style={styles.qTitle}>Berapa budget kamu?</Text>
                  <TextInput style={styles.input} placeholder="Budget Minimum" keyboardType="numeric" />
                  <TextInput style={styles.input} placeholder="Budget Maximum" keyboardType="numeric" />
                </View>
              )}

              {step === 3 && (
                <View style={styles.stepBody}>
                  <View style={styles.iconCircle}><Ionicons name="cart" size={35} color="#9E5F3B" /></View>
                  <Text style={styles.qTitle}>Bahan apa yang tersedia?</Text>
                  {bahan.map((_, i) => (
                    <TextInput key={i} style={styles.input} placeholder={`Bahan ke-${i+1}`} />
                  ))}
                </View>
              )}

              {/* Navigation Buttons */}
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.btnBack} onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
                  <Text style={styles.textBack}>‹ Kembali</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnNext} onPress={nextStep}>
                  <Text style={styles.textNext}>{step === 3 ? 'Selesai ✓' : 'Lanjut ›'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  header: {  padding: 25, alignItems: 'center' },
  headerTitle: { color: '#9E5F3B', fontSize: 24, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  headerSubtitle: { color: '#9E5F3B', fontSize: 15, textAlign: 'center', marginTop: 5, fontWeight: '500' },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#9E5F3B', elevation: 5 },
  stepText: { fontSize: 12, color: '#9E5F3B', marginBottom: 5 },
  progressBg: { height: 6, backgroundColor: '#EEE', borderRadius: 3, marginBottom: 20 },
  progressFill: { height: 6, backgroundColor: '#9E5F3B', borderRadius: 3 },
  stepBody: { alignItems: 'center', width: '100%' },
  iconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F9F2ED', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  qTitle: { fontSize: 16,  fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  timeBox: { width: '100%', borderWidth: 1, borderColor: '#9E5F3B', padding: 15, borderRadius: 10, alignItems: 'center' },
  timeText: { fontSize: 28, letterSpacing: 2 },
  input: { width: '100%', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, marginBottom: 10 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  btnBack: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', width: '45%', alignItems: 'center' },
  btnNext: { padding: 12, borderRadius: 8, backgroundColor: '#9E5F3B', width: '45%', alignItems: 'center' },
  textBack: { color: '#9E5F3B' },
  textNext: { color: 'white', fontWeight: 'bold' },
});