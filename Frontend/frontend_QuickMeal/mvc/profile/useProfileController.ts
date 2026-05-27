import { useEffect, useRef, useState } from 'react';
import { Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useFonts, Langar_400Regular } from '@expo-google-fonts/langar';

import { API_BASE_URL } from '@/constants/api';

export const colors = {
  cream: '#FFF8EF',
  primary: '#5b2f20',
  button: '#9E5F3B',
  white: '#FFFFFF',
  lightBox: '#F2EDE4',
};

export const getProfilePictureUrl = (profilePicture: string | null | undefined): string => {
  if (!profilePicture) {
    return 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg';
  }

  if (profilePicture.startsWith('http')) {
    return profilePicture;
  }

  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}/storage/${profilePicture}`;
};

export const formatDateToDDMMYY = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

export const useProfileController = () => {
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

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    'Langar-Regular': Langar_400Regular,
  });

  useEffect(() => {
    void fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        router.replace('/login' as any);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        console.log('PROFILE FETCH NON-JSON RESPONSE:', response.status);
        return;
      }

      if (!response.ok) {
        console.log('Error fetching user:', data);
        return;
      }

      setUser(data.data);

      if (data.data.is_premium) {
        setIsVIP(true);
        await fetchSubscriptionData(token);
      }

      setLoading(false);
    } catch (error) {
      console.log('FETCH USER ERROR:', error);
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
      console.log('FETCH SUBSCRIPTION ERROR:', error);
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
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
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
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  }

  async function uploadProfilePicture(imageUri: string) {
    try {
      setUploading(true);

      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return;
      }

      const formData = new FormData();
      const filename = imageUri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('profile_picture', {
        uri: imageUri,
        name: filename,
        type,
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
        setUser({ ...user, profile_picture: data.data?.profile_picture || user.profile_picture });
        Alert.alert('Success', 'Profile picture updated successfully');
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error uploading picture:', error);
      Alert.alert('Error', 'Failed to upload profile picture');
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

      await new Promise((resolve) => setTimeout(resolve, 1500));

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
      setUser((prev: any) => (prev ? { ...prev, is_premium: true } : prev));
      await fetchSubscriptionData(token);
      startSuccessAnimation();
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

  return {
    router,
    colors,
    isVIP,
    currentView,
    setCurrentView,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentSession,
    setPaymentSession,
    paymentLoading,
    mockPaymentLoading,
    paymentHistory,
    paymentHistoryLoading,
    subscriptionData,
    showSuccessModal,
    setShowSuccessModal,
    showImagePickerModal,
    setShowImagePickerModal,
    uploading,
    user,
    loading,
    scaleAnim,
    opacityAnim,
    fontsLoaded,
    pickImageFromLibrary,
    takePhotoWithCamera,
    createUpgradePayment,
    confirmUpgradePayment,
    fetchPaymentHistory,
  };
};
