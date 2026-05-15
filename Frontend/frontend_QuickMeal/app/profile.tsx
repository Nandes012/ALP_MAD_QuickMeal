import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

// --- IMPORT FONT LANGAR ---
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';
import { API_BASE_URL } from "@/constants/api";

const colors = {
  cream: "#FFF8EF",
  primary: "#5b2f20",
  button: "#9E5F3B",
  white: "#FFFFFF",
  lightBox: "#F2EDE4" 
};

// Helper function to construct profile picture URL
const getProfilePictureUrl = (profilePicture: string | null | undefined): string => {
  if (!profilePicture) {
    return 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg';
  }
  
  // If it's already a full URL, return as is
  if (profilePicture.startsWith('http')) {
    return profilePicture;
  }
  
  // Construct the storage URL
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}/storage/${profilePicture}`;
};

export default function Profile() {
  const router = useRouter();
  
  const [isVIP, setIsVIP] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'upgrade' | 'payment'>('main');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    'Langar-Regular': Langar_400Regular,
  });

  // Fetch user data from API
  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      setLoading(true);
      
      // Get token from storage
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        router.replace("/login" as any);
        return;
      }

      const url = `${API_BASE_URL}/auth/me`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type") || "";
      let data: any = null;
      
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        console.log("PROFILE FETCH NON-JSON RESPONSE:", response.status);
        return;
      }

      console.log("USER DATA:", data);

      if (!response.ok) {
        console.log("Error fetching user:", data);
        return;
      }

      // Set user data
      setUser(data.data);
      
      // Check if VIP
      if (data.data.is_premium) {
        setIsVIP(true);
      }

      setLoading(false);

    } catch (error) {
      console.log("FETCH USER ERROR:", error);
      setLoading(false);
    }
  }

  async function pickImageFromLibrary() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadProfilePicture(result.assets[0].uri);
      }
      setShowImagePickerModal(false);
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  }

  async function takePhotoWithCamera() {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadProfilePicture(result.assets[0].uri);
      }
      setShowImagePickerModal(false);
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  }

  async function uploadProfilePicture(imageUri: string) {
    try {
      setUploading(true);

      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        Alert.alert("Error", "No authentication token found");
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      const filename = imageUri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('profile_picture', {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);

      const response = await fetch(`${API_BASE_URL}/profile/update-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Update user data with new profile picture
        setUser({ ...user, profile_picture: data.data?.profile_picture || user.profile_picture });
        Alert.alert("Success", "Profile picture updated successfully");
      } else {
        Alert.alert("Error", data.message || "Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error uploading picture:", error);
      Alert.alert("Error", "Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  }

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
        <Text style={styles.username}>{user?.name || 'Loading...'}</Text>
        <TouchableOpacity onPress={() => setShowImagePickerModal(true)}>
          <Image 
            source={{ uri: getProfilePictureUrl(user?.profile_picture) }} 
            style={styles.smallAvatar} 
          />
          <View style={styles.editBadge}>
              <Ionicons name="pencil" size={8} color="white" />
          </View>
        </TouchableOpacity>
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

      <TouchableOpacity style={styles.logout} onPress={async () => {
        await AsyncStorage.removeItem('auth_token');
        router.replace("/login" as any);
      }}>
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

      {/* Image Picker Modal */}
      <Modal visible={showImagePickerModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.imagePickerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Change Profile Picture</Text>
              <TouchableOpacity onPress={() => setShowImagePickerModal(false)}>
                <Ionicons name="close" size={28} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {uploading ? (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="large" color={colors.button} />
                <Text style={styles.uploadingText}>Uploading...</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={takePhotoWithCamera}
                >
                  <Ionicons name="camera" size={32} color={colors.button} />
                  <Text style={styles.optionText}>Take a Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={pickImageFromLibrary}
                >
                  <Ionicons name="image" size={32} color={colors.button} />
                  <Text style={styles.optionText}>Choose from Files</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

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
  imagePickerModal: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.cream, borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingTop: 20, paddingHorizontal: 20, paddingBottom: 30 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalHeaderText: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  optionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, paddingVertical: 18, paddingHorizontal: 20, marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
  optionText: { fontSize: 16, fontWeight: '600', color: colors.primary, marginLeft: 15 },
  uploadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  uploadingText: { marginTop: 15, fontSize: 16, color: colors.primary, fontWeight: '600' },
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