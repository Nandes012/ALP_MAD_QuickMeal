import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ExploreScreen() {
  const router = useRouter();

  useEffect(() => {
    // Memberikan jeda waktu super singkat (10ms) agar Root Layout selesai render terlebih dahulu
    const timer = setTimeout(() => {
      router.replace('/list');
    }, 1);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#9E5F3B" />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8EF',
  },
});