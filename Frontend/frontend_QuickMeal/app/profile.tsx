import React, { useState } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// --- IMPORT FONT LANGAR ---
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';

const colors = {
  cream: "#FFF8EF",
  primary: "#5b2f20",
  button: "#9E5F3B",
  white: "#FFFFFF",
  lightBox: "#F2EDE4" 
};

export default function Profile() {
  const router = useRouter();
  
  const [isVIP, setIsVIP] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'upgrade' | 'payment'>('main');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [fontsLoaded] = useFonts({
    'Langar-Regular': Langar_400Regular,
  });

  if (!fontsLoaded) return null;

  function Row({ title }: { title: string }) {
    return (
      <TouchableOpacity style={local.row} activeOpacity={0.8}>
        <Text style={local.rowText}>{title}</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
      </TouchableOpacity>
    );
  }

  // 1. Layar Profil Utama
  const renderMainProfile = () => (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.username}>St mutmainnah</Text>
        <View>
          <Image source={{ uri: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg' }} style={styles.smallAvatar} />
          <View style={styles.editBadge}>
              <Ionicons name="pencil" size={8} color="white" />
          </View>
        </View>
      </View>

      <View style={styles.vipCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.vipTitle}>QuickMeal 💎 VIP</Text>
          <TouchableOpacity 
            style={styles.upgradeBtn} 
            onPress={() => setCurrentView('upgrade')}
          >
            <Text style={styles.upgradeText}>{isVIP ? 'Perpanjang' : 'Upgrade'}</Text>
          </TouchableOpacity>
        </View>
        
        {isVIP && <Text style={styles.vipDateText}>Berakhir 11 hari yang lalu</Text>}

        <TouchableOpacity style={styles.vipLinkRow}>
          <Text style={styles.vipDesc}>Fitur & elemen premium, dan bebas iklan</Text>
          <Ionicons name="chevron-forward" size={14} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuGroup}>
        <View style={styles.box}>
          <Row title="Profile Details" />
          <Row title="Order History" />
          <Row title="Saved Wishlist" />
        </View>

        <View style={[styles.box, { marginTop: 20 }]}>
          <Row title="Payment Methods" />
          <Row title="Help & Support" />
        </View>
      </View>

      <TouchableOpacity style={styles.logout} onPress={() => router.replace("/login" as any)}>
        <Ionicons name="log-out-outline" size={24} color="#FF0000" style={{ marginRight: 10 }} />
        <Text style={styles.logoutText}>Logout Akun</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // 2. Layar Pilih Paket
  const renderUpgradeView = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => setCurrentView('main')} style={{ marginBottom: 20 }}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <View style={styles.upgradeHeaderCard}>
        <Text style={[styles.upgradeHeaderTitle, {fontFamily: 'Langar-Regular'}]}>QuickMeal</Text>
        <View style={styles.packageContainer}>
          <View style={styles.packageBox}>
            <Text style={styles.packageLabel}>GRATIS</Text>
          </View>
          <View style={[styles.packageBox, { backgroundColor: 'rgba(255,255,255,0.4)' }]}>
            <Ionicons name="diamond" size={30} color="white" />
            <Text style={styles.packageLabel}>VIP</Text>
          </View>
        </View>
      </View>

      <View style={styles.featureBox}>
          <Text style={styles.featureText}>• Fitur VIP</Text>
          <Text style={styles.featureText}>• Tidak ada iklan</Text>
      </View>

      <Text style={styles.paymentMethodTitle}>Pembayaran ke VIP :</Text>
      
      {['MasterCard', 'BCA', 'Alfamart'].map((item) => (
        <TouchableOpacity key={item} style={styles.paymentOption} onPress={() => setCurrentView('payment')}>
          <View style={styles.paymentRow}>
             <Ionicons name="card-outline" size={20} color={colors.primary} />
             <Text style={styles.paymentOptionText}>{item}</Text>
          </View>
          <Text style={styles.priceText}>Rp 80.000,00</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.confirmBtn} onPress={() => setCurrentView('payment')}>
        <Text style={styles.confirmBtnText}>Lanjut Pembayaran</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // 3. Layar Konfirmasi
  const renderPaymentConfirm = () => (
    <View style={[styles.container, { flex: 1, justifyContent: 'flex-end' }]}>
       <TouchableOpacity 
        style={styles.finalPaymentBtn} 
        onPress={() => setShowSuccessModal(true)}
       >
        <Text style={styles.finalPaymentBtnText}>CONFIRM PAYMENT</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.page}>
      {currentView === 'main' && renderMainProfile()}
      {currentView === 'upgrade' && renderUpgradeView()}
      {currentView === 'payment' && renderPaymentConfirm()}

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalContent} 
            activeOpacity={1} 
            onPress={() => {
              setShowSuccessModal(false);
              setIsVIP(true);
              setCurrentView('main');
            }}
          >
            <Text style={styles.modalText}>Selamat Akun Anda telah Diupgrade</Text>
            <Text style={styles.modalSubText}>Ketuk untuk tutup</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream },
  container: { padding: 20, paddingBottom: 40 }, // Padding disesuaikan karena Navbar dihapus
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  username: { fontSize: 20, fontWeight: '600', color: colors.primary },
  smallAvatar: { width: 45, height: 45, borderRadius: 22.5 },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.primary, borderRadius: 10, padding: 2 },

  vipCard: { backgroundColor: colors.button, borderRadius: 20, padding: 20, marginBottom: 25 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vipTitle: { fontWeight: 'bold', fontSize: 22, color: '#fff' },
  upgradeBtn: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  upgradeText: { color: colors.button, fontWeight: 'bold', fontSize: 12 },
  vipDateText: { color: '#fff', fontSize: 12, marginTop: 5, opacity: 0.8 },
  vipLinkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  vipDesc: { color: '#fff', fontSize: 13, marginRight: 5 },

  menuGroup: { gap: 0 },
  box: { backgroundColor: colors.lightBox, borderRadius: 20, overflow: 'hidden' },
  
  logout: { 
    marginTop: 30, 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    paddingVertical: 15, 
    alignItems: 'center', 
    flexDirection: 'row', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20
  },
  logoutText: { color: '#FF0000', fontWeight: 'bold', fontSize: 18 },

  upgradeHeaderCard: { backgroundColor: colors.button, borderRadius: 25, padding: 30, alignItems: 'center' },
  upgradeHeaderTitle: { color: 'white', fontSize: 28, marginBottom: 20 },
  packageContainer: { flexDirection: 'row', gap: 15 },
  packageBox: { width: 90, height: 110, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  packageLabel: { color: 'white', fontWeight: 'bold', marginTop: 8 },
  featureBox: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginTop: 20 },
  featureText: { color: colors.primary, fontSize: 16, marginBottom: 8 },
  paymentMethodTitle: { marginTop: 25, fontWeight: 'bold', fontSize: 16, color: colors.primary },
  paymentOption: { backgroundColor: 'white', borderRadius: 15, padding: 18, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderWidth: 1, borderColor: '#ddd' },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  paymentOptionText: { fontWeight: 'bold', color: colors.primary },
  priceText: { color: colors.primary },
  confirmBtn: { backgroundColor: 'white', borderRadius: 25, paddingVertical: 15, alignItems: 'center', marginTop: 30, elevation: 2 },
  confirmBtnText: { fontWeight: 'bold', fontSize: 16, color: colors.button },
  finalPaymentBtn: { backgroundColor: 'white', borderRadius: 30, paddingVertical: 18, alignItems: 'center', marginBottom: 20 },
  finalPaymentBtnText: { fontWeight: 'bold', fontSize: 18, color: '#CCC' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.button, width: '85%', paddingVertical: 50, paddingHorizontal: 30, borderRadius: 30, alignItems: 'center' },
  modalText: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 25 },
  modalSubText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
});

const local = StyleSheet.create({
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E0E0E0' 
  },
  rowText: { fontSize: 16, color: colors.primary, fontWeight: '500' },
});