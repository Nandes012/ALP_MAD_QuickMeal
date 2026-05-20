import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FromResepScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [bahan, setBahan] = useState(['', '', '']);

  // 🌟 Logic State untuk Jam, Menit, Detik aktif
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // 🌟 Membuat array pilihan angka formal
  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);
  const secondsArray = Array.from({ length: 60 }, (_, i) => i);

  // Tinggi item satuan untuk kalkulasi snapping scroll otomatis
  const ITEM_HEIGHT = 40; 

  // 🌟 Fungsi untuk memperbarui teks bahan tertentu
  const handleBahanChange = (text: string, index: number) => {
    const newBahan = [...bahan];
    newBahan[index] = text;
    setBahan(newBahan);
  };

  // 🌟 Fungsi untuk menambah kolom input bahan baru
  const tambahBahan = () => {
    setBahan([...bahan, '']);
  };

  // 🌟 Fungsi untuk menghapus kolom input bahan tertentu (Opsional agar user bisa mengoreksi)
  const hapusBahan = (index: number) => {
    if (bahan.length > 1) {
      const newBahan = bahan.filter((_, i) => i !== index);
      setBahan(newBahan);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else router.push('/hasil_rec_resep');
  };

  // 🌟 Fungsi pembantu render kolom gulir roda jam dengan Label yang Jelas
  const renderWheelPicker = (
    data: number[], 
    currentValue: number, 
    setValue: (val: number) => void,
    maxLimit: number,
    labelText: string 
  ) => {
    return (
      <View style={{ alignItems: 'center', width: 65 }}>
        
        {/* Kotak Input Ketik Manual */}
        <TextInput
          style={{ 
            color: '#9E5F3B', 
            fontWeight: 'bold', 
            fontSize: 16, 
            textAlign: 'center',
            backgroundColor: '#F9F2ED',
            borderRadius: 6,
            marginBottom: 4,
            paddingVertical: 2,
            width: '100%',
            borderWidth: 0.5,
            borderColor: '#E8D8CE'
          }}
          keyboardType="numeric"
          maxLength={2}
          value={String(currentValue).padStart(2, '0')}
          onChangeText={(text) => {
            const num = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
            setValue(num > maxLimit ? maxLimit : num);
          }}
        />
        
        {/* Roda Penggulung Mekanis */}
        <View style={{ height: ITEM_HEIGHT * 2.5, width: '100%', overflow: 'hidden' }}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => {
              const yOffset = e.nativeEvent.contentOffset.y;
              const index = Math.round(yOffset / ITEM_HEIGHT);
              if (data[index] !== undefined) {
                setValue(data[index]);
              }
            }}
            contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 0.75 }}
          >
            {data.map((val) => {
              const isSelected = val === currentValue;
              return (
                <TouchableOpacity 
                  key={val} 
                  style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => setValue(val)}
                >
                  <Text style={{
                    fontSize: isSelected ? 24 : 15,
                    fontWeight: isSelected ? 'bold' : '300',
                    color: isSelected ? '#9E5F3B' : '#C0C0C0',
                  }}>
                    {String(val).padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* LABEL PENJELAS (JAM / MENIT / DETIK) */}
        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#9E5F3B', marginTop: 6, letterSpacing: 0.5 }}>
          {labelText}
        </Text>
      </View>
    );
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
            <Text style={styles.headerSubtitle}>kami butuh tahu kondisi kamu untuk memberikan rekomendasi resep terbaik</Text>
          </View>

          {/* Form Content */}
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
                  
                  {/* UTAMA BOX TIMER */}
                  <View style={styles.timeBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 165, paddingVertical: 5 }}>
                      
                      {/* KOLOM JAM */}
                      {renderWheelPicker(hoursArray, hours, setHours, 23, "JAM")}
                      
                      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#9E5F3B', marginHorizontal: 12, marginTop: -15 }}>:</Text>
                      
                      {/* KOLOM MENIT */}
                      {renderWheelPicker(minutesArray, minutes, setMinutes, 59, "MENIT")}
                      
                      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#9E5F3B', marginHorizontal: 12, marginTop: -15 }}>:</Text>
                      
                      {/* KOLOM DETIK */}
                      {renderWheelPicker(secondsArray, seconds, setSeconds, 59, "DETIK")}

                    </View>
                    <Text style={{ fontSize: 11, color: '#9E5F3B', opacity: 0.6, marginTop: 8, fontStyle: 'italic' }}>
                      *Scroll atas-bawah angka atau ketik langsung pada kotak nomor
                    </Text>
                  </View>
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

              {/* 🌟 PERBAIKAN DINAMIS PADA STEP 3: INPUT BISA DITAMBAH */}
              {step === 3 && (
                <View style={styles.stepBody}>
                  <View style={styles.iconCircle}><Ionicons name="cart" size={35} color="#9E5F3B" /></View>
                  <Text style={styles.qTitle}>Bahan apa yang tersedia?</Text>
                  
                  {/* Box List dengan scroll area maksimal tinggi 180 agar tidak berantakan */}
                  <View style={{ width: '100%', maxHeight: 180 }}>
                    <ScrollView showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
                      {bahan.map((val, i) => (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 10 }}>
                          <TextInput 
                            style={[styles.input, { flex: 1, marginBottom: 0 }]} 
                            placeholder={`Bahan ke-${i+1}`} 
                            value={val}
                            onChangeText={(text) => handleBahanChange(text, i)}
                          />
                          {bahan.length > 1 && (
                            <TouchableOpacity onPress={() => hapusBahan(i)} style={{ marginLeft: 10, padding: 5 }}>
                              <Ionicons name="trash-outline" size={22} color="#D9534F" />
                            </TouchableOpacity>
                          )}
                        </View>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Tombol Tambah Elemen Bahan */}
                  <TouchableOpacity 
                    onPress={tambahBahan} 
                    style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      marginTop: 12, 
                      backgroundColor: '#F9F2ED', 
                      paddingVertical: 8, 
                      paddingHorizontal: 15, 
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: '#9E5F3B'
                    }}
                  >
                    <Ionicons name="add-circle-outline" size={20} color="#9E5F3B" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#9E5F3B', fontWeight: 'bold', fontSize: 13 }}>Tambah Bahan</Text>
                  </TouchableOpacity>
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