import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FromResepScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1); // State untuk mengatur halaman pertanyaan (1, 2, atau 3)

  // Data State untuk Form
  const [waktu, setWaktu] = useState('00:00:00');
  const [budgetMin, setBudgetMin] = useState('10000');
  const [budgetMax, setBudgetMax] = useState('50000');
  const [bahan, setBahan] = useState(['', '', '']);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else router.push('/hasil_rec_resep'); // Jika sudah step 3, pindah ke hasil
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/images/cook.png')} // Sesuaikan dengan background kamu
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.overlay} edges={['top']}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Isi Kondisi Kamu</Text>
            <Text style={styles.headerSubtitle}>
              kami butuh tahu kondisi kamu untuk memberikan rekomendasi terbaik
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formCard}>
              {/* Progress Bar & Text */}
              <Text style={styles.stepText}>Pertanyaan {step} dari 3</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${(step / 3) * 100}%` }]} />
              </View>

              {/* Step 1: Waktu */}
              {step === 1 && (
                <View style={styles.stepContent}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="time-outline" size={40} color="#9E5F3B" />
                  </View>
                  <Text style={styles.questionTitle}>Berapa lama waktu yang kamu punya?</Text>
                  <Text style={styles.questionSubtitle}>Untuk memasak atau estimasi delivery</Text>
                  
                  <View style={styles.timeDisplayBox}>
                    <Text style={styles.timeText}>{waktu}</Text>
                    <View style={styles.timeLabels}>
                      <Text style={styles.labelSmall}>JAM</Text>
                      <Text style={styles.labelSmall}>MENIT</Text>
                      <Text style={styles.labelSmall}>DETIK</Text>
                    </View>
                  </View>
                  <Text style={styles.instruction}>Masukkan estimasi waktu yang kamu miliki</Text>
                </View>
              )}

              {/* Step 2: Budget */}
              {step === 2 && (
                <View style={styles.stepContent}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="cash-outline" size={40} color="#9E5F3B" />
                  </View>
                  <Text style={styles.questionTitle}>Berapa budget kamu?</Text>
                  <Text style={styles.questionSubtitle}>Kami akan cari yang sesuai budget anda</Text>
                  
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Budget Minimum</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Rp 10000" 
                      value={budgetMin}
                      onChangeText={setBudgetMin}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Budget Maximum</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Rp 50000" 
                      value={budgetMax}
                      onChangeText={setBudgetMax}
                      keyboardType="numeric"
                    />
                  </View>
                  <Text style={styles.instruction}>Masukkan range budget untuk makanan</Text>
                </View>
              )}

              {/* Step 3: Bahan */}
              {step === 3 && (
                <View style={styles.stepContent}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="cart-outline" size={40} color="#9E5F3B" />
                  </View>
                  <Text style={styles.questionTitle}>Bahan apa yang tersedia?</Text>
                  <Text style={styles.questionSubtitle}>Masukkan bahan masakan yang anda punya sekarang</Text>
                  
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Bahan yang kamu punya</Text>
                    {bahan.map((item, index) => (
                      <TextInput 
                        key={index}
                        style={[styles.input, { marginBottom: 10 }]} 
                        placeholder={index === 0 ? "Contoh: Ayam" : index === 1 ? "Contoh: Bawang" : "Contoh: Tomat"}
                        value={item}
                        onChangeText={(text) => {
                          const newBahan = [...bahan];
                          newBahan[index] = text;
                          setBahan(newBahan);
                        }}
                      />
                    ))}
                  </View>

                  <TouchableOpacity style={styles.addBahanButton}>
                    <Text style={styles.addBahanText}>+ Tambah Bahan Lain</Text>
                  </TouchableOpacity>
                  <Text style={styles.instruction}>Satu kotak untuk satu jenis bahan</Text>
                </View>
              )}

              {/* Navigation Buttons */}
              <View style={styles.navButtonGroup}>
                <TouchableOpacity style={styles.backBtn} onPress={prevStep}>
                  <Ionicons name="chevron-back" size={20} color="#9E5F3B" />
                  <Text style={styles.backBtnText}>Kembali</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
                  <Text style={styles.nextBtnText}>{step === 3 ? 'Selesai' : 'Lanjut'}</Text>
                  {step !== 3 && <Ionicons name="chevron-forward" size={20} color="white" />}
                  {step === 3 && <Ionicons name="checkmark" size={20} color="white" style={{marginLeft: 5}} />}
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(252, 248, 245, 0.4)' },
  header: { padding: 20, alignItems: 'center' },
  headerTitle: { color: '#5b2f20', fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { color: '#5b2f20', fontSize: 12, textAlign: 'center', marginTop: 5, paddingHorizontal: 30 },
  
  scrollContainer: { padding: 20, paddingBottom: 100 },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#9E5F3B',
    minHeight: 500,
  },
  stepText: { color: '#9E5F3B', fontSize: 12, fontWeight: '600', marginBottom: 5 },
  progressBarBg: { height: 8, backgroundColor: '#F0E0D6', borderRadius: 4, marginBottom: 30 },
  progressBarFill: { height: 8, backgroundColor: '#9E5F3B', borderRadius: 4 },
  
  stepContent: { alignItems: 'center', flex: 1 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F9F2ED', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  questionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3436', textAlign: 'center', marginBottom: 10 },
  questionSubtitle: { fontSize: 13, color: '#636E72', textAlign: 'center', marginBottom: 30 },
  
  // Step 1 Styles
  timeDisplayBox: { width: '100%', borderWidth: 2, borderColor: '#9E5F3B', borderRadius: 15, padding: 25, alignItems: 'center', marginVertical: 20 },
  timeText: { fontSize: 40, fontWeight: '300', letterSpacing: 5 },
  timeLabels: { flexDirection: 'row', width: '80%', justifyContent: 'space-between', marginTop: 5 },
  labelSmall: { fontSize: 10, color: '#636E72' },
  
  // Step 2 & 3 Styles
  inputWrapper: { width: '100%', marginBottom: 20 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#2D3436', marginBottom: 8 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#DFE6E9', borderRadius: 10, paddingHorizontal: 15, fontSize: 14 },
  addBahanButton: { width: '100%', height: 45, backgroundColor: '#9E5F3B', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#white' },
  addBahanText: { color: 'white', fontWeight: 'bold' },
  instruction: { fontSize: 11, color: '#636E72', marginTop: 15 },

  // Navigation
  navButtonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, width: '100%' },
  backBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 45, borderRadius: 10, borderWidth: 1, borderColor: '#9E5F3B' },
  backBtnText: { color: '#9E5F3B', fontWeight: '600', marginLeft: 5 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, height: 45, borderRadius: 10, backgroundColor: '#9E5F3B' },
  nextBtnText: { color: 'white', fontWeight: 'bold', marginRight: 5 }
});