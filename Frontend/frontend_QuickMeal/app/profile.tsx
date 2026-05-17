import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, ActivityIndicator, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

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

// Helper function to format date to DD/MM/YY
const formatDateToDDMMYY = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

export default function Profile() {
  const router = useRouter();
  
  const [isVIP, setIsVIP] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'upgrade' | 'payment' | 'payment-history' | 'payment-success'>('main');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('BCA');
  const [paymentSession, setPaymentSession] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [mockPaymentLoading, setMockPaymentLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [paymentHistoryLoading, setPaymentHistoryLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

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
        // Fetch subscription data if user is VIP
        await fetchSubscriptionData(token);
      }

      setLoading(false);

    } catch (error) {
      console.log("FETCH USER ERROR:", error);
      setLoading(false);
    }
  }

  async function fetchSubscriptionData(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/subscription/current`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.data) {
        setSubscriptionData(data.data);
      }
    } catch (error) {
      console.log("FETCH SUBSCRIPTION ERROR:", error);
    }
  }

  async function pickImageFromLibrary() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
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

  async function createUpgradePayment() {
    try {
      setPaymentLoading(true);

      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/subscription/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          method: selectedPaymentMethod,
          amount: 80000,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.message || 'Failed to create payment session');
        return;
      }

      setPaymentSession(data.data);
      setCurrentView('payment');
    } catch (error) {
      console.error('Error creating payment session:', error);
      Alert.alert('Error', 'Failed to start payment');
    } finally {
      setPaymentLoading(false);
    }
  }

  async function confirmUpgradePayment() {
    try {
      if (!paymentSession?.subscription?.id) {
        Alert.alert('Error', 'Payment session not found');
        return;
      }

      setPaymentLoading(true);
      setMockPaymentLoading(true);

      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return;
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = await fetch(`${API_BASE_URL}/subscription/upgrade/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscription_id: paymentSession.subscription.id,
          payment_method: selectedPaymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.message || 'Payment confirmation failed');
        setMockPaymentLoading(false);
        return;
      }

      setIsVIP(true);
      setUser((prev: any) => prev ? { ...prev, is_premium: true } : prev);
      
      // Fetch updated subscription data
      await fetchSubscriptionData(token);
      
      // Play success animation
      startSuccessAnimation();
      
      // Transition to success view
      setCurrentView('payment-success');
      setMockPaymentLoading(false);
    } catch (error) {
      console.error('Error confirming payment:', error);
      Alert.alert('Error', 'Failed to confirm payment');
      setMockPaymentLoading(false);
    } finally {
      setPaymentLoading(false);
    }
  }

  function startSuccessAnimation() {
    scaleAnim.setValue(0);
    opacityAnim.setValue(0);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }

  async function fetchPaymentHistory() {
    try {
      setPaymentHistoryLoading(true);
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/subscription/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentHistory(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setPaymentHistoryLoading(false);
    }
  }

  // 1. Layar Profil Utama
  if (!fontsLoaded || loading) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.button} />
        </View>
      </SafeAreaView>
    );
  }

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
        
        {isVIP && (
          <Text style={styles.vipDateText}>
            Berakhir: {subscriptionData?.subscription?.end_date 
              ? formatDateToDDMMYY(subscriptionData.subscription.end_date) 
              : 'Loading...'}
          </Text>
        )}

        <TouchableOpacity style={styles.vipLinkRow}>
          <Text style={styles.vipDesc}>Fitur & elemen premium, dan bebas iklan</Text>
          <Ionicons name="chevron-forward" size={14} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuGroup}>
        <View style={styles.box}>
          <Row title="Profile Details" />
          <TouchableOpacity 
            style={local.row} 
            activeOpacity={0.8}
            onPress={() => {
              fetchPaymentHistory();
              setCurrentView('payment-history');
            }}
          >
            <Text style={local.rowText}>Payment History</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
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
      
      {['BCA', 'MasterCard', 'QRIS'].map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.paymentOption,
            selectedPaymentMethod === item && styles.paymentOptionSelected,
          ]}
          onPress={() => setSelectedPaymentMethod(item)}
        >
          <View style={styles.paymentRow}>
             <Ionicons name="card-outline" size={20} color={colors.primary} />
             <Text style={styles.paymentOptionText}>{item}</Text>
          </View>
          <Text style={styles.priceText}>Rp 80.000,00</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.confirmBtn} onPress={createUpgradePayment} disabled={paymentLoading}>
        {paymentLoading ? (
          <ActivityIndicator color={colors.button} />
        ) : (
          <Text style={styles.confirmBtnText}>Lanjut Pembayaran</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  // 3. Layar Konfirmasi
  const renderPaymentConfirm = () => (
    <SafeAreaView style={[styles.page, { justifyContent: 'flex-end' }]}>
      <View style={styles.headerWithBackButton}>
        <TouchableOpacity onPress={() => setCurrentView('upgrade')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Konfirmasi Pembayaran</Text>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.paymentSummaryCard}>
          <Text style={styles.paymentSummaryTitle}>Ringkasan Pembayaran</Text>
          <Text style={styles.paymentSummaryText}>Paket: QuickMeal VIP</Text>
          <Text style={styles.paymentSummaryText}>Metode: {selectedPaymentMethod}</Text>
          <Text style={styles.paymentSummaryText}>Nominal: Rp 80.000,00</Text>
        </View>

        {paymentSession?.qris_code && selectedPaymentMethod === 'QRIS' && (
          <View style={styles.qrisContainer}>
            <Text style={styles.qrisTitle}>Scan QRIS untuk Pembayaran</Text>
            <Image
              source={{ uri: paymentSession.qris_code }}
              style={styles.qrisImage}
              resizeMode="contain"
            />
            <Text style={styles.qrisSubtext}>Arahkan kamera ke kode QR ini</Text>
          </View>
        )}

        {mockPaymentLoading && (
          <View style={styles.mockPaymentModal}>
            <ActivityIndicator size="large" color={colors.button} />
            <Text style={styles.mockPaymentText}>Memproses Pembayaran...</Text>
          </View>
        )}

        <View style={{ marginBottom: 20 }} />
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity 
          style={styles.finalPaymentBtn} 
          onPress={confirmUpgradePayment}
          disabled={paymentLoading}
        >
          {paymentLoading ? (
            <ActivityIndicator color="#CCC" />
          ) : (
            <Text style={styles.finalPaymentBtnText}>CONFIRM PAYMENT</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // 4. Layar Payment History
  const renderPaymentHistory = () => {
    let historyContent;

    if (paymentHistoryLoading) {
      historyContent = (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.button} />
        </View>
      );
    } else if (paymentHistory.length === 0) {
      historyContent = (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>Belum ada riwayat pembayaran</Text>
        </View>
      );
    } else {
      const completedPayments = paymentHistory.filter(p => p.status !== 'pending');
      
      if (completedPayments.length === 0) {
        historyContent = (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>Belum ada riwayat pembayaran</Text>
          </View>
        );
      } else {
        historyContent = completedPayments.map((payment) => (
          <View key={payment.id} style={styles.paymentHistoryItem}>
            <View style={styles.historyItemLeft}>
              <View style={[
                styles.statusBadge,
                payment.status === 'completed' ? styles.statusSuccess : styles.statusPending
              ]}>
                <Ionicons 
                  name={payment.status === 'completed' ? "checkmark-circle" : "time-outline"} 
                  size={20} 
                  color="white" 
                />
              </View>
              <View>
                <Text style={styles.historyMethod}>{payment.method}</Text>
                <Text style={styles.historyDate}>{payment.formatted_date}</Text>
              </View>
            </View>
            <Text style={[
              styles.historyAmount,
              payment.status === 'completed' ? styles.amountSuccess : styles.amountPending
            ]}>
              Rp {payment.amount.toLocaleString('id-ID')}
            </Text>
          </View>
        ));
      }
    }

    return (
      <SafeAreaView style={styles.page}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => setCurrentView('main')} style={{ marginBottom: 20 }}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>

          <Text style={styles.historyTitle}>Riwayat Pembayaran</Text>

          {historyContent}
        </ScrollView>
      </SafeAreaView>
    );
  };

  // 5. Layar Success Animation
  const renderPaymentSuccess = () => {
    const scale = scaleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <SafeAreaView style={[styles.page, styles.successPage]}>
        <View style={styles.successContainer}>
          <Animated.View
            style={[
              styles.successIconContainer,
              {
                transform: [{ scale }],
                opacity: opacityAnim,
              },
            ]}
          >
            <View style={styles.checkmarkCircle}>
              <Ionicons name="checkmark" size={80} color="white" />
            </View>
          </Animated.View>

          <Text style={styles.successTitle}>Pembayaran Berhasil!</Text>
          <Text style={styles.successSubtitle}>Akun Anda sudah diupgrade ke VIP</Text>
          <Text style={styles.successDuration}>Berlaku 30 hari</Text>

          <View style={styles.benefitList}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={24} color={colors.button} />
              <Text style={styles.benefitText}>Akses fitur premium</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={24} color={colors.button} />
              <Text style={styles.benefitText}>Bebas dari iklan</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={24} color={colors.button} />
              <Text style={styles.benefitText}>Prioritas support</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.successBtn}
            onPress={() => {
              setShowSuccessModal(false);
              setCurrentView('main');
              setPaymentSession(null);
            }}
          >
            <Text style={styles.successBtnText}>Kembali ke Profil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.page}>
      {currentView === 'main' && renderMainProfile()}
      {currentView === 'upgrade' && renderUpgradeView()}
      {currentView === 'payment' && renderPaymentConfirm()}
      {currentView === 'payment-history' && renderPaymentHistory()}
      {currentView === 'payment-success' && renderPaymentSuccess()}

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
              setCurrentView('main');
              setPaymentSession(null);
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

type RowProps = Readonly<{
  title: string;
}>;

function Row({ title }: RowProps) {
  return (
    <TouchableOpacity style={local.row} activeOpacity={0.8}>
      <Text style={local.rowText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.primary} />
    </TouchableOpacity>
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
  paymentOptionSelected: { borderColor: colors.button, borderWidth: 2 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  paymentOptionText: { fontWeight: 'bold', color: colors.primary },
  priceText: { color: colors.primary },
  confirmBtn: { backgroundColor: 'white', borderRadius: 25, paddingVertical: 15, alignItems: 'center', marginTop: 30, elevation: 2 },
  confirmBtnText: { fontWeight: 'bold', fontSize: 16, color: colors.button },
  paymentSummaryCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20 },
  paymentSummaryTitle: { fontSize: 18, fontWeight: 'bold', color: colors.primary, marginBottom: 10 },
  paymentSummaryText: { fontSize: 14, color: colors.primary, marginBottom: 6 },
  paymentSummaryToken: { fontSize: 12, color: colors.button, marginTop: 8, fontWeight: '600' },
  finalPaymentBtn: { backgroundColor: 'white', borderRadius: 30, paddingVertical: 18, alignItems: 'center', marginBottom: 20 },
  finalPaymentBtnText: { fontWeight: 'bold', fontSize: 18, color: '#CCC' },
  loadingState: { flex: 1, alignItems: 'center', justifyContent: 'center' },

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

  // Payment History Styles
  historyTitle: { fontSize: 24, fontWeight: 'bold', color: colors.primary, marginBottom: 20 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyStateText: { marginTop: 15, fontSize: 16, color: '#999', fontWeight: '500' },
  paymentHistoryItem: { 
    backgroundColor: 'white', 
    borderRadius: 15, 
    padding: 16, 
    marginBottom: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.button,
  },
  historyItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusBadge: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  statusSuccess: { backgroundColor: '#4CAF50' },
  statusPending: { backgroundColor: '#FFC107' },
  historyMethod: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  historyDate: { fontSize: 12, color: '#999', marginTop: 4 },
  historyAmount: { fontSize: 16, fontWeight: 'bold' },
  amountSuccess: { color: '#4CAF50' },
  amountPending: { color: '#FFC107' },

  // Success Screen Styles
  successPage: { backgroundColor: 'white', justifyContent: 'center' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  successIconContainer: { marginBottom: 30 },
  checkmarkCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.button, justifyContent: 'center', alignItems: 'center' },
  successTitle: { fontSize: 28, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 10 },
  successSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 5 },
  successDuration: { fontSize: 14, color: colors.button, fontWeight: '600', marginBottom: 30 },
  benefitList: { backgroundColor: colors.lightBox, borderRadius: 15, padding: 20, marginBottom: 30, width: '100%' },
  benefitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  benefitText: { marginLeft: 12, fontSize: 14, color: colors.primary, fontWeight: '500' },
  successBtn: { backgroundColor: colors.button, borderRadius: 25, paddingVertical: 14, paddingHorizontal: 40, width: '100%', alignItems: 'center' },
  successBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  // Mock Payment Styles
  mockPaymentModal: { 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    borderRadius: 15, 
    padding: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20 
  },
  mockPaymentText: { color: 'white', marginTop: 15, fontSize: 14, fontWeight: '600' },

  // QRIS Styles
  qrisContainer: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 20, 
    alignItems: 'center', 
    marginVertical: 20,
    borderWidth: 2,
    borderColor: colors.button,
  },
  qrisTitle: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginBottom: 15 },
  qrisImage: { width: 250, height: 250, marginBottom: 10 },
  qrisSubtext: { fontSize: 12, color: '#999', fontWeight: '500' },
  bottomButtonContainer: { padding: 20, backgroundColor: colors.cream },

  // Header with back button
  headerWithBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
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