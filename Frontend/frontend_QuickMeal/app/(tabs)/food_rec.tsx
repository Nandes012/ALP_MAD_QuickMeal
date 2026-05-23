import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native'; 
import { useRouter } from 'expo-router';

export default function FoodRecScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/from_resep');
  }, [router]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
});