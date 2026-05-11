import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FromOrderScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Navigasi ke halaman hasil rekomendasi order
      router.push('/hasil_order');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/cook.png')} // Sesuaikan path gambar background Anda
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Isi Kondisi Kamu</Text>
            <Text style={styles.headerSubtitle}>kami butuh tahu kondisi kamu untuk memberikan rekomendasi terbaik</Text>
          </View>

          {/* Form Content */}
          <View style={styles.content}>
            <View style={styles.card}>
              <Text style={styles.stepText}>Pertanyaan {step} dari 3</Text>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
              </View>

              {/* Step 1: Waktu */}
              {step === 1 && (
                <View style={styles.stepBody}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="time-outline" size={35} color="#9E5F3B" />
                  </View>
                  <Text style={styles.qTitle}>Berapa lama waktu yang kamu punya?</Text>
                  <Text style={styles.qDesc}>Untuk memasak atau estimasi delivery</Text>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeText}>00:00:00</Text>
                  </View>
                </View>
              )}

              {/* Step 2: Budget */}
              {step === 2 && (
                <View style={styles.stepBody}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="cash-outline" size={35} color="#9E5F3B" />
                  </View>
                  <Text style={styles.qTitle}>Berapa budget kamu?</Text>
                  <Text style={styles.qDesc}>Kami akan cari yang sesuai budget anda</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Budget Minimum (Rp)" 
                    keyboardType="numeric" 
                    placeholderTextColor="#999"
                  />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Budget Maximum (Rp)" 
                    keyboardType="numeric" 
                    placeholderTextColor="#999"
                  />
                </View>
              )}

              {/* Step 3: Lokasi */}
              {step === 3 && (
                <View style={styles.stepBody}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="location-outline" size={35} color="#9E5F3B" />
                  </View>
                  <Text style={styles.qTitle}>Di mana lokasi kamu?</Text>
                  <Text style={styles.qDesc}>Untuk cari restoran terdekat</Text>
                  <TextInput 
                    style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
                    placeholder="Contoh: Jl. Sudirman No. 123" 
                    multiline={true}
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.infoNote}>Lokasi membantu kami menemukan restoran terdekat</Text>
                </View>
              )}

              {/* Navigation Buttons */}
              <View style={styles.btnRow}>
                <TouchableOpacity 
                  style={styles.btnBack} 
                  onPress={() => step > 1 ? setStep(step - 1) : router.back()}
                >
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
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  header: { padding: 25, alignItems: 'center' },
  headerTitle: { color: '#9E5F3B', fontSize: 24, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  headerSubtitle: { color: '#9E5F3B', fontSize: 15, textAlign: 'center', marginTop: 5, fontWeight: '500' },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  card: { backgroundColor: 'white', borderRadius: 25, padding: 25, borderWidth: 1, borderColor: '#9E5F3B', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 5 },
  stepText: { fontSize: 13, color: '#9E5F3B', marginBottom: 5, fontWeight: '600' },
  progressBg: { height: 6, backgroundColor: '#EEE', borderRadius: 3, marginBottom: 25 },
  progressFill: { height: 6, backgroundColor: '#9E5F3B', borderRadius: 3 },
  stepBody: { alignItems: 'center', width: '100%' },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F9F2ED', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  qTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  qDesc: { fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 20, marginTop: 5 },
  timeBox: { width: '100%', borderWidth: 1.5, borderColor: '#9E5F3B', padding: 20, borderRadius: 15, alignItems: 'center', backgroundColor: '#FFF' },
  timeText: { fontSize: 32, letterSpacing: 2, fontWeight: '300', color: '#333' },
  input: { width: '100%', borderWidth: 1, borderColor: '#DDD', borderRadius: 12, padding: 15, marginBottom: 15, backgroundColor: '#FAFAFA', fontSize: 14 },
  infoNote: { fontSize: 11, color: '#999', textAlign: 'center', marginTop: -5 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  btnBack: { padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#DDD', width: '47%', alignItems: 'center', backgroundColor: '#FFF' },
  btnNext: { padding: 15, borderRadius: 12, backgroundColor: '#9E5F3B', width: '47%', alignItems: 'center' },
  textBack: { color: '#666', fontWeight: '600' },
  textNext: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});