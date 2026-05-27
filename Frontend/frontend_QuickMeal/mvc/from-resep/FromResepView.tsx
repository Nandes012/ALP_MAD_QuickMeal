import React from 'react';
import { ActivityIndicator, FlatList, ImageBackground, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = Readonly<{
  step: number;
  bahan: string[];
  budgetMin: string;
  setBudgetMin: (value: string) => void;
  budgetMax: string;
  setBudgetMax: (value: string) => void;
  hours: number;
  setHours: (value: number) => void;
  minutes: number;
  setMinutes: (value: number) => void;
  seconds: number;
  setSeconds: (value: number) => void;
  ingredients: Array<{ id: string; name?: string; ingredient_name?: string }>;
  loadingIngredients: boolean;
  dropdownVisibleIndex: number | null;
  setDropdownVisibleIndex: (value: number | null) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  fetchError: string;
  hoursArray: number[];
  minutesArray: number[];
  secondsArray: number[];
  ITEM_HEIGHT: number;
  handleBahanChange: (text: string, index: number) => void;
  tambahBahan: () => void;
  hapusBahan: (index: number) => void;
  isNextDisabled: () => boolean;
  nextStep: () => Promise<void>;
  router: { replace: (...args: any[]) => void };
}>;

export default function FromResepView(props: Props) {
  const {
    step,
    bahan,
    budgetMin,
    setBudgetMin,
    budgetMax,
    setBudgetMax,
    hours,
    setHours,
    minutes,
    setMinutes,
    seconds,
    setSeconds,
    ingredients,
    loadingIngredients,
    dropdownVisibleIndex,
    setDropdownVisibleIndex,
    searchQuery,
    setSearchQuery,
    fetchError,
    hoursArray,
    minutesArray,
    secondsArray,
    ITEM_HEIGHT,
    handleBahanChange,
    tambahBahan,
    hapusBahan,
    isNextDisabled,
    nextStep,
    router,
  } = props;

  const renderWheelPicker = (
    data: number[],
    currentValue: number,
    setValue: (val: number) => void,
    maxLimit: number,
    labelText: string,
  ) => (
    <View style={{ alignItems: 'center', width: 65 }}>
      <TextInput
        style={{ color: '#9E5F3B', fontWeight: 'bold', fontSize: 16, textAlign: 'center', backgroundColor: '#F9F2ED', borderRadius: 6, marginBottom: 4, paddingVertical: 2, width: '100%', borderWidth: 0.5, borderColor: '#E8D8CE' }}
        keyboardType="numeric"
        maxLength={2}
        value={String(currentValue).padStart(2, '0')}
        onChangeText={(text) => {
          const num = Number.parseInt(text.replace(/\D/g, ''), 10) || 0;
          setValue(Math.min(num, maxLimit));
        }}
      />
      <View style={{ height: ITEM_HEIGHT * 2.5, width: '100%', overflow: 'hidden' }}>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const yOffset = event.nativeEvent.contentOffset.y;
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
                <Text style={{ fontSize: isSelected ? 24 : 15, fontWeight: isSelected ? 'bold' : '300', color: isSelected ? '#9E5F3B' : '#C0C0C0' }}>
                  {String(val).padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#9E5F3B', marginTop: 6, letterSpacing: 0.5 }}>
        {labelText}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/images/cook.png')} style={styles.backgroundImage}>
        <SafeAreaView style={styles.overlay}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Isi Kondisi Kamu</Text>
              <Text style={styles.headerSubtitle}>kami butuh tahu kondisi kamu untuk memberikan rekomendasi resep terbaik</Text>
            </View>

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
                    <View style={styles.timeBox}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 165, paddingVertical: 5 }}>
                        {renderWheelPicker(hoursArray, hours, setHours, 23, 'JAM')}
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#9E5F3B', marginHorizontal: 12, marginTop: -15 }}>:</Text>
                        {renderWheelPicker(minutesArray, minutes, setMinutes, 59, 'MENIT')}
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#9E5F3B', marginHorizontal: 12, marginTop: -15 }}>:</Text>
                        {renderWheelPicker(secondsArray, seconds, setSeconds, 59, 'DETIK')}
                      </View>
                      <Text style={{ fontSize: 11, color: '#9E5F3B', opacity: 0.6, marginTop: 8, fontStyle: 'italic' }}>*Scroll atas-bawah angka atau ketik langsung pada kotak nomor</Text>
                      {hours === 0 && minutes === 0 && seconds === 0 && (
                        <Text style={{ fontSize: 12, color: '#D9534F', marginTop: 10, fontWeight: 'bold' }}>waktu 00:00:00 tidak dapat digunakan</Text>
                      )}
                    </View>
                  </View>
                )}

                {step === 2 && (
                  <View style={styles.stepBody}>
                    <View style={styles.iconCircle}><Ionicons name="cash" size={35} color="#9E5F3B" /></View>
                    <Text style={styles.qTitle}>Berapa budget kamu?</Text>
                    <TextInput style={styles.input} placeholder="Budget Minimum. contoh:0" keyboardType="numeric" value={budgetMin} onChangeText={setBudgetMin} />
                    <TextInput style={styles.input} placeholder="Budget Maximum. Contoh:100000" keyboardType="numeric" value={budgetMax} onChangeText={setBudgetMax} />
                  </View>
                )}

                {step === 3 && (
                  <View style={styles.stepBody}>
                    <View style={styles.iconCircle}><Ionicons name="cart" size={35} color="#9E5F3B" /></View>
                    <Text style={styles.qTitle}>Bahan apa yang tersedia?</Text>

                    {loadingIngredients ? (
                      <ActivityIndicator size="large" color="#9E5F3B" />
                    ) : (
                      <>
                        {Boolean(fetchError) && <Text style={{ fontSize: 13, color: '#D9534F', marginBottom: 12, fontWeight: 'bold' }}>{fetchError}</Text>}
                        <View style={{ width: '100%', maxHeight: 180 }}>
                          <ScrollView showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
                            {bahan.map((val, i) => (
                              <View key={`${val}-${i}`} style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 10, position: 'relative' }}>
                                <TouchableOpacity
                                  onPress={() => setDropdownVisibleIndex(dropdownVisibleIndex === i ? null : i)}
                                  style={[styles.input, { flex: 1, marginBottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 12 }]}
                                >
                                  <Text style={{ color: val ? '#9E5F3B' : '#AAA', flex: 1 }}>{val || `Pilih Bahan ${i + 1}`}</Text>
                                  <Ionicons name="chevron-down" size={20} color="#9E5F3B" />
                                </TouchableOpacity>

                                {dropdownVisibleIndex === i && (
                                  <Modal transparent={true} visible={true} onRequestClose={() => { setDropdownVisibleIndex(null); setSearchQuery(''); }}>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { setDropdownVisibleIndex(null); setSearchQuery(''); }}>
                                      <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ backgroundColor: 'white', borderRadius: 12, width: '80%', maxHeight: 400, borderWidth: 1, borderColor: '#9E5F3B' }}>
                                          <TextInput
                                            style={{ borderBottomWidth: 1, borderBottomColor: '#E8D8CE', paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#9E5F3B' }}
                                            placeholder="Cari bahan..."
                                            placeholderTextColor="#AAA"
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                          />
                                          <FlatList
                                            data={ingredients.filter((item) => {
                                              const ingredientName = item.name || item.ingredient_name || '';
                                              return ingredientName.toLowerCase().includes(searchQuery.toLowerCase());
                                            })}
                                            keyExtractor={(item) => String(item.id)}
                                            renderItem={({ item }) => {
                                              const ingredientName = item.name || item.ingredient_name || 'Unknown';
                                              return (
                                                <TouchableOpacity onPress={() => { handleBahanChange(ingredientName, i); setDropdownVisibleIndex(null); setSearchQuery(''); }} style={{ paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E8D8CE' }}>
                                                  <Text style={{ color: '#9E5F3B', fontSize: 14 }}>{ingredientName}</Text>
                                                </TouchableOpacity>
                                              );
                                            }}
                                            ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#999', paddingVertical: 20 }}>Tidak ada bahan yang cocok</Text>}
                                          />
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  </Modal>
                                )}

                                {bahan.length > 1 && (
                                  <TouchableOpacity onPress={() => hapusBahan(i)} style={{ marginLeft: 10, padding: 5 }}>
                                    <Ionicons name="trash-outline" size={22} color="#D9534F" />
                                  </TouchableOpacity>
                                )}
                              </View>
                            ))}
                          </ScrollView>
                        </View>

                        <TouchableOpacity onPress={tambahBahan} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: '#F9F2ED', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: '#9E5F3B' }}>
                          <Ionicons name="add-circle-outline" size={20} color="#9E5F3B" style={{ marginRight: 6 }} />
                          <Text style={{ color: '#9E5F3B', fontWeight: 'bold', fontSize: 13 }}>Tambah Bahan</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                )}

                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.btnBack} onPress={() => router.replace('/home')}>
                    <Text style={styles.textBack}>‹ Kembali</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btnNext, isNextDisabled() && styles.btnNextDisabled]} onPress={nextStep} disabled={isNextDisabled()}>
                    <Text style={[styles.textNext, isNextDisabled() && styles.textNextDisabled]}>{step === 3 ? 'Selesai ✓' : 'Lanjut ›'}</Text>
                  </TouchableOpacity>
                </View>
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
  backgroundImage: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 24 },
  header: { padding: 25, alignItems: 'center' },
  headerTitle: { color: '#9E5F3B', fontSize: 24, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  headerSubtitle: { color: '#9E5F3B', fontSize: 15, textAlign: 'center', marginTop: 5, fontWeight: '500' },
  content: { flex: 1, padding: 20, justifyContent: 'flex-start' },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#9E5F3B', elevation: 5 },
  stepText: { fontSize: 12, color: '#9E5F3B', marginBottom: 5 },
  progressBg: { height: 6, backgroundColor: '#EEE', borderRadius: 3, marginBottom: 20 },
  progressFill: { height: 6, backgroundColor: '#9E5F3B', borderRadius: 3 },
  stepBody: { alignItems: 'center', width: '100%' },
  iconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F9F2ED', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  qTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  timeBox: { width: '100%', borderWidth: 1, borderColor: '#9E5F3B', padding: 15, borderRadius: 10, alignItems: 'center' },
  timeText: { fontSize: 28, letterSpacing: 2 },
  input: { width: '100%', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, marginBottom: 10 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  btnBack: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', width: '45%', alignItems: 'center' },
  btnNext: { padding: 12, borderRadius: 8, backgroundColor: '#9E5F3B', width: '45%', alignItems: 'center' },
  btnNextDisabled: { backgroundColor: '#CCCCCC', opacity: 0.6 },
  textBack: { color: '#9E5F3B' },
  textNext: { color: 'white', fontWeight: 'bold' },
  textNextDisabled: { color: '#999999' },
});
